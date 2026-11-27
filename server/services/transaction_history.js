const db = require('./db');
const helper = require('../helper');

/*
  THE MATERIAL LEDGER

  Every row of transaction_history is ONE movement of material, from a source to a destination:

      external --> purchase --> bank --> allocation --> hat_order (babies / tails)
                      <--          <--          <--          <--  (when material goes back)

  'external' is outside of the system: material that was bought, or that was removed.

  The changes are recorded by the server, in the same database transaction as the change itself.
  The caller reads the state BEFORE the change (snapshot_*), makes the change, and then tells the
  ledger what it is now (track_*). The ledger works out the difference and writes the movement.
  Deleting something calls release_*, which moves what is left in it back to where it came from
  (a deleted purchase: out of the system), before the rows are deleted.

  Records of demo customers are not kept (their purchases are dummy ones).
  Rows are never deleted, and have no foreign keys: their ids stay after the purchase/bank/allocation is gone.
*/

const EVENT = {
  purchase_created: 'purchase_created',
  purchase_topped_up: 'purchase_topped_up',
  purchase_reduced: 'purchase_reduced',
  purchase_deleted: 'purchase_deleted',
  bank_created: 'bank_created',
  bank_topped_up: 'bank_topped_up',
  bank_reduced: 'bank_reduced',
  bank_deleted: 'bank_deleted',
  allocation_created: 'allocation_created',
  allocation_topped_up: 'allocation_topped_up',
  allocation_reduced: 'allocation_reduced',
  allocation_deleted: 'allocation_deleted',
  babies_to_order: 'babies_to_order',
  babies_from_order: 'babies_from_order',
  tails_to_order: 'tails_to_order',
  tails_from_order: 'tails_from_order'
};

const num = (v) => Number(v ?? 0);
// decimals of the ledger (DECIMAL(15,2)): avoids float noise like 0.1 + 0.2
const round2 = (v) => Math.round((num(v) + Number.EPSILON) * 100) / 100;

// ---------------------------------------------------------------------------------------------
// Reading the state
// ---------------------------------------------------------------------------------------------

/**
 * The whole chain of an entity (its allocation, bank, purchase, raw material and customer), and its units.
 * Give the lowest one you have: { allocation_id } or { bank_id } or { purchase_id }.
 * Returns null when it doesn't exist.
 */
async function context_of(conn, { allocation_id, bank_id, purchase_id }) {
  let rows;
  if (allocation_id) {
    rows = await db.transaction_query(
      `SELECT a.id AS allocation_id, cb.id AS customer_bank_id, cb.customer_id, rmp.id AS purchase_id,
              rmp.raw_material_id, rmp.quantity_units, COALESCE(c.is_demo_customer, 0) AS is_demo
         FROM customer_banks_allocations a
         JOIN customer_banks cb ON cb.id = a.customer_bank_id
         JOIN raw_material_purchases rmp ON rmp.id = cb.raw_material_purchase_id
         LEFT JOIN customers c ON c.id = cb.customer_id
        WHERE a.id = (?)`, [allocation_id], conn);
  }
  else if (bank_id) {
    rows = await db.transaction_query(
      `SELECT NULL AS allocation_id, cb.id AS customer_bank_id, cb.customer_id, rmp.id AS purchase_id,
              rmp.raw_material_id, rmp.quantity_units, COALESCE(c.is_demo_customer, 0) AS is_demo
         FROM customer_banks cb
         JOIN raw_material_purchases rmp ON rmp.id = cb.raw_material_purchase_id
         LEFT JOIN customers c ON c.id = cb.customer_id
        WHERE cb.id = (?)`, [bank_id], conn);
  }
  else if (purchase_id) {
    rows = await db.transaction_query(
      `SELECT NULL AS allocation_id, NULL AS customer_bank_id, NULL AS customer_id, rmp.id AS purchase_id,
              rmp.raw_material_id, rmp.quantity_units, 0 AS is_demo
         FROM raw_material_purchases rmp
        WHERE rmp.id = (?)`, [purchase_id], conn);
  }
  else {
    return null;
  }
  const ctx = helper.emptyOrRows(rows)[0];
  return ctx ? { ...ctx, is_demo: !!ctx.is_demo } : null;
}

/** A purchase as it is now (before a change): { id, quantity, remaining, units }, or null if it doesn't exist (yet). */
async function snapshot_purchase(conn, id) {
  if (!id || id <= 0) return null;
  const rows = await db.transaction_query(
    `SELECT id, purchase_quantity AS quantity, remaining_quantity AS remaining, quantity_units AS units
       FROM raw_material_purchases WHERE id = (?) FOR UPDATE`, [id], conn);
  const r = helper.emptyOrRows(rows)[0];
  return r ? { id: r.id, quantity: num(r.quantity), remaining: num(r.remaining), units: r.units } : null;
}

/** A customer bank as it is now: { id, purchase_id, quantity, remaining }, or null. */
async function snapshot_bank(conn, id) {
  if (!id || id <= 0) return null;
  const rows = await db.transaction_query(
    `SELECT id, raw_material_purchase_id AS purchase_id, quantity, remaining_quantity AS remaining
       FROM customer_banks WHERE id = (?) FOR UPDATE`, [id], conn);
  const r = helper.emptyOrRows(rows)[0];
  return r ? { id: r.id, purchase_id: r.purchase_id, quantity: num(r.quantity), remaining: num(r.remaining) } : null;
}

/** An allocation as it is now: { id, bank_id, quantity, remaining }, or null. */
async function snapshot_allocation(conn, id) {
  if (!id || id <= 0) return null;
  const rows = await db.transaction_query(
    `SELECT id, customer_bank_id AS bank_id, quantity, remaining_quantity AS remaining
       FROM customer_banks_allocations WHERE id = (?) FOR UPDATE`, [id], conn);
  const r = helper.emptyOrRows(rows)[0];
  return r ? { id: r.id, bank_id: r.bank_id, quantity: num(r.quantity), remaining: num(r.remaining) } : null;
}

/** What is not in banks yet: the purchase quantity minus its banks (not counting `except_bank_id`). */
async function purchase_free_quantity(conn, purchase_id, except_bank_id = 0) {
  const rows = await db.transaction_query(
    `SELECT rmp.purchase_quantity - COALESCE((SELECT SUM(cb.quantity) FROM customer_banks cb
                WHERE cb.raw_material_purchase_id = rmp.id AND cb.id <> (?)), 0) AS free
       FROM raw_material_purchases rmp WHERE rmp.id = (?)`, [except_bank_id, purchase_id], conn);
  return round2(helper.emptyOrRows(rows)[0]?.free);
}

/** What is not allocated yet: the bank quantity minus its allocations (not counting `except_allocation_id`). */
async function bank_free_quantity(conn, bank_id, except_allocation_id = 0) {
  const rows = await db.transaction_query(
    `SELECT cb.quantity - COALESCE((SELECT SUM(a.quantity) FROM customer_banks_allocations a
                WHERE a.customer_bank_id = cb.id AND a.id <> (?)), 0) AS free
       FROM customer_banks cb WHERE cb.id = (?)`, [except_allocation_id, bank_id], conn);
  return round2(helper.emptyOrRows(rows)[0]?.free);
}

// ---------------------------------------------------------------------------------------------
// Writing a movement
// ---------------------------------------------------------------------------------------------

/**
 * Records one movement.
 *   m.event      one of EVENT
 *   m.from / m.to   { type: 'external'|'purchase'|'bank'|'allocation'|'hat_order', id }
 *   m.quantity   positive; nothing is recorded for 0
 *   m.units      'kg' | 'units' | 'babies' | 'tails' (default: the units of the purchase)
 *   m.ctx        the result of context_of (the chain of ids); nothing is recorded for demo customers
 *   m.user, m.balance_after, m.detail, m.note, m.customer_hat_id, m.reverses_id: optional
 * Returns the id of the new record, or 0 when nothing was recorded.
 */
async function record_move(conn, m) {
  const quantity = round2(m.quantity);
  if (!quantity || quantity <= 0) return 0;
  const ctx = m.ctx ?? {};
  if (ctx.is_demo) return 0;
  const result = await db.transaction_query(
    `INSERT INTO transaction_history
       (date, added_by, transaction_quantity, transaction_type, quantity_units,
        from_type, from_id, to_type, to_id,
        raw_material_id, purchase_id, customer_id, customer_bank_id, allocation_id, customer_hat_id,
        balance_after, detail, reverses_id, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      helper.nowDateStr(), m.user ?? null, quantity, m.event, m.units ?? ctx.quantity_units ?? 'units',
      m.from.type, m.from.id ?? null, m.to.type, m.to.id ?? null,
      ctx.raw_material_id ?? null, ctx.purchase_id ?? null, ctx.customer_id ?? null,
      ctx.customer_bank_id ?? null, ctx.allocation_id ?? null, m.customer_hat_id ?? null,
      (m.balance_after === undefined || m.balance_after === null) ? null : round2(m.balance_after),
      (m.detail === undefined || m.detail === null) ? null : JSON.stringify(m.detail),
      m.reverses_id ?? null, m.note ?? null
    ],
    conn);
  return result.insertId;
}

// ---------------------------------------------------------------------------------------------
// Tracking changes: snapshot before, change, then track
// ---------------------------------------------------------------------------------------------

/**
 * A purchase was created or its quantity changed:
 * more: external --> purchase (created / topped up); less: purchase --> external (reduced).
 *   before     snapshot_purchase() from before the change (null for a new purchase)
 *   after      { quantity, remaining }: what the purchase is now
 */
async function track_purchase(conn, before, purchase_id, after, user) {
  const delta = round2(num(after.quantity) - num(before?.quantity));
  if (delta === 0) return;
  const ctx = await context_of(conn, { purchase_id });
  if (!ctx) return;
  const more = delta > 0;
  await record_move(conn, {
    event: more ? (before ? EVENT.purchase_topped_up : EVENT.purchase_created) : EVENT.purchase_reduced,
    from: more ? { type: 'external' } : { type: 'purchase', id: purchase_id },
    to: more ? { type: 'purchase', id: purchase_id } : { type: 'external' },
    quantity: Math.abs(delta), ctx, user, balance_after: after.remaining
  });
}

/**
 * A customer bank was created or its quantity changed:
 * more: purchase --> bank (created / topped up); less: bank --> purchase (reduced).
 * A bank which moved to another purchase gives its material back to the old one, and takes it from the new one.
 *   before     snapshot_bank() from before the change (null for a new bank)
 *   after      { purchase_id, quantity, remaining }
 */
async function track_bank(conn, before, bank_id, after, user) {
  const ctx = await context_of(conn, { bank_id });
  if (!ctx) return;
  if (before && before.purchase_id != after.purchase_id) {
    const old_ctx = { ...ctx, purchase_id: before.purchase_id };
    old_ctx.raw_material_id = (await context_of(conn, { purchase_id: before.purchase_id }))?.raw_material_id ?? ctx.raw_material_id;
    await record_move(conn, {
      event: EVENT.bank_reduced, from: { type: 'bank', id: bank_id }, to: { type: 'purchase', id: before.purchase_id },
      quantity: before.quantity, ctx: old_ctx, user, note: 'moved to another purchase'
    });
    before = null;   // the same as a new bank, of the new purchase
  }
  const delta = round2(num(after.quantity) - num(before?.quantity));
  if (delta === 0) return;
  const more = delta > 0;
  await record_move(conn, {
    event: more ? (before ? EVENT.bank_topped_up : EVENT.bank_created) : EVENT.bank_reduced,
    from: more ? { type: 'purchase', id: after.purchase_id } : { type: 'bank', id: bank_id },
    to: more ? { type: 'bank', id: bank_id } : { type: 'purchase', id: after.purchase_id },
    quantity: Math.abs(delta), ctx, user, balance_after: after.remaining
  });
}

/**
 * An allocation was created or its quantity changed:
 * more: bank --> allocation (created / topped up); less: allocation --> bank (reduced).
 *   before     snapshot_allocation() from before the change (null for a new allocation)
 *   after      { quantity, remaining }
 */
async function track_allocation(conn, before, allocation_id, after, user) {
  const delta = round2(num(after.quantity) - num(before?.quantity));
  if (delta === 0) return;
  const ctx = await context_of(conn, { allocation_id });
  if (!ctx) return;
  const more = delta > 0;
  await record_move(conn, {
    event: more ? (before ? EVENT.allocation_topped_up : EVENT.allocation_created) : EVENT.allocation_reduced,
    from: more ? { type: 'bank', id: ctx.customer_bank_id } : { type: 'allocation', id: allocation_id },
    to: more ? { type: 'allocation', id: allocation_id } : { type: 'bank', id: ctx.customer_bank_id },
    quantity: Math.abs(delta), ctx, user, balance_after: after.remaining
  });
}

// ---------------------------------------------------------------------------------------------
// Deleting: material goes back to where it came from. Call BEFORE deleting the rows.
// ---------------------------------------------------------------------------------------------

/** The material of an allocation goes back to its bank. */
async function release_allocation(conn, allocation_id, user, note = null) {
  const snap = await snapshot_allocation(conn, allocation_id);
  if (!snap) return;
  const ctx = await context_of(conn, { allocation_id });
  if (!ctx) return;
  await record_move(conn, {
    event: EVENT.allocation_deleted, from: { type: 'allocation', id: allocation_id }, to: { type: 'bank', id: ctx.customer_bank_id },
    quantity: snap.quantity, ctx, user, note,
    balance_after: round2(await bank_free_quantity(conn, ctx.customer_bank_id, allocation_id) + snap.quantity)
  });
}

/** The allocations of a bank go back to it, and then the bank's material goes back to its purchase. */
async function release_bank(conn, bank_id, user, note = null) {
  const snap = await snapshot_bank(conn, bank_id);
  if (!snap) return;
  const allocations = await db.transaction_query(
    `SELECT id FROM customer_banks_allocations WHERE customer_bank_id = (?) ORDER BY id`, [bank_id], conn);
  for (const a of helper.emptyOrRows(allocations)) {
    await release_allocation(conn, a.id, user, note);
  }
  const ctx = await context_of(conn, { bank_id });
  if (!ctx) return;
  await record_move(conn, {
    event: EVENT.bank_deleted, from: { type: 'bank', id: bank_id }, to: { type: 'purchase', id: snap.purchase_id },
    quantity: snap.quantity, ctx, user, note,
    balance_after: round2(await purchase_free_quantity(conn, snap.purchase_id, bank_id) + snap.quantity)
  });
}

/** All the banks selected by a where rule on customer_banks (e.g. "where customer_id=5") go back to their purchases. */
async function release_banks_where(conn, where_rule, user, note = null) {
  const banks = await db.transaction_query(`SELECT id FROM customer_banks ${where_rule} ORDER BY id`, [], conn);
  for (const b of helper.emptyOrRows(banks)) {
    await release_bank(conn, b.id, user, note);
  }
}

/** The banks of a purchase go back to it, and then the purchase's material leaves the system. */
async function release_purchase(conn, purchase_id, user, note = null) {
  const snap = await snapshot_purchase(conn, purchase_id);
  if (!snap) return;
  await release_banks_where(conn, `WHERE raw_material_purchase_id = ${Number(purchase_id)}`, user, note);
  const ctx = await context_of(conn, { purchase_id });
  if (!ctx) return;
  await record_move(conn, {
    event: EVENT.purchase_deleted, from: { type: 'purchase', id: purchase_id }, to: { type: 'external' },
    quantity: snap.quantity, ctx, user, note, balance_after: 0
  });
}

// ---------------------------------------------------------------------------------------------
// Orders: babies and tails move from an allocation to an order (a customer hat), or back (cancelled order)
// ---------------------------------------------------------------------------------------------

/**
 * babies: [{ length, count }]. The babies of the wing move from the allocation to the order.
 * Recorded once per allocation (wall, crown), with the lengths and counts in `detail`.
 */
async function track_babies_to_order(conn, { allocation_id, customer_hat_id, babies, user, wing_id }) {
  const total = (babies ?? []).reduce((acc, b) => acc + num(b.count), 0);
  if (!allocation_id || allocation_id <= 0 || total <= 0) return;
  const ctx = await context_of(conn, { allocation_id });
  if (!ctx) return;
  await record_move(conn, {
    event: EVENT.babies_to_order, from: { type: 'allocation', id: allocation_id }, to: { type: 'hat_order', id: customer_hat_id },
    quantity: total, units: 'babies', ctx, user, customer_hat_id,
    detail: { wing_id: wing_id ?? null, babies: babies.map(b => ({ length: b.length, count: num(b.count) })) }
  });
}

/** The babies of a cancelled/deleted order go back to their allocation. Same arguments as track_babies_to_order. */
async function track_babies_from_order(conn, { allocation_id, customer_hat_id, babies, user, wing_id, reverses_id = null }) {
  const total = (babies ?? []).reduce((acc, b) => acc + num(b.count), 0);
  if (!allocation_id || allocation_id <= 0 || total <= 0) return;
  const ctx = await context_of(conn, { allocation_id });
  if (!ctx) return;
  await record_move(conn, {
    event: EVENT.babies_from_order, from: { type: 'hat_order', id: customer_hat_id }, to: { type: 'allocation', id: allocation_id },
    quantity: total, units: 'babies', ctx, user, customer_hat_id, reverses_id,
    detail: { wing_id: wing_id ?? null, babies: babies.map(b => ({ length: b.length, count: num(b.count) })) }
  });
}

/** `count` tails move from the (tails) allocation to the order. */
async function track_tails_to_order(conn, { allocation_id, customer_hat_id, count, user, side = null }) {
  if (!allocation_id || allocation_id <= 0 || num(count) <= 0) return;
  const ctx = await context_of(conn, { allocation_id });
  if (!ctx) return;
  await record_move(conn, {
    event: EVENT.tails_to_order, from: { type: 'allocation', id: allocation_id }, to: { type: 'hat_order', id: customer_hat_id },
    quantity: count, units: 'tails', ctx, user, customer_hat_id, detail: side ? { side } : null
  });
}

/** `count` tails of a cancelled/deleted order go back to the allocation. */
async function track_tails_from_order(conn, { allocation_id, customer_hat_id, count, user, side = null, reverses_id = null }) {
  if (!allocation_id || allocation_id <= 0 || num(count) <= 0) return;
  const ctx = await context_of(conn, { allocation_id });
  if (!ctx) return;
  await record_move(conn, {
    event: EVENT.tails_from_order, from: { type: 'hat_order', id: customer_hat_id }, to: { type: 'allocation', id: allocation_id },
    quantity: count, units: 'tails', ctx, user, customer_hat_id, reverses_id, detail: side ? { side } : null
  });
}

// ---------------------------------------------------------------------------------------------
// Reading the history
// ---------------------------------------------------------------------------------------------

async function get_enum_values(table, column) {
  return await helper.getEnumValues(table, column);
}

/**
 * The movements of an entity, oldest first. `kind` is where the history is opened from:
 *   'raw_material'  every movement of the purchases of the material (to/from banks, bought, removed)
 *   'purchase'      purchase <-> banks, and bought/removed
 *   'bank'          bank <-> its purchase, and bank <-> allocations
 *   'allocation'    allocation <-> its bank, and allocation <-> orders (babies/tails)
 * Each row says its `direction` for that entity ('in' / 'out'), and who is on the other side
 * (`other_type`, `other_id`, `other_label`).
 */
async function get_flow(kind, id) {
  const entity = { raw_material: null, purchase: 'purchase', bank: 'bank', allocation: 'allocation' }[kind];
  if (entity === undefined) {
    throw new Error(`Unknown history kind: ${kind}`);
  }
  id = Number(id);
  if (!Number.isInteger(id)) {
    throw new Error('Invalid id');
  }

  const where = (kind === 'raw_material')
    ? `th.raw_material_id = ${id} AND (th.from_type = 'purchase' OR th.to_type = 'purchase')`
    : `((th.from_type = '${entity}' AND th.from_id = ${id}) OR (th.to_type = '${entity}' AND th.to_id = ${id}))`;

  // the side of the entity: for the material it is the purchase side of each movement
  const own = (kind === 'raw_material') ? 'purchase' : entity;
  const rows = await db.query(
    `SELECT
        th.id, th.date, th.added_by, CONCAT_WS(' ', u.firstname, u.lastname) AS added_by_name,
        th.transaction_type, th.transaction_quantity, th.quantity_units, th.balance_after, th.detail, th.note, th.reverses_id,
        th.from_type, th.from_id, th.to_type, th.to_id,
        th.raw_material_id, th.purchase_id, th.customer_id, th.customer_bank_id, th.allocation_id, th.customer_hat_id,
        rm.name AS raw_material_name, c.name AS customer_name,
        IF(th.to_type = '${own}', 'in', 'out') AS direction,
        IF(th.to_type = '${own}', th.from_type, th.to_type) AS other_type,
        IF(th.to_type = '${own}', th.from_id, th.to_id) AS other_id,
        cba.allocation_type
      FROM transaction_history th
      LEFT JOIN users u ON u.id = th.added_by
      LEFT JOIN raw_materials rm ON rm.id = th.raw_material_id
      LEFT JOIN customers c ON c.id = th.customer_id
      LEFT JOIN customer_banks_allocations cba ON cba.id = th.allocation_id
      WHERE th.from_type IS NOT NULL AND ${where}
      ORDER BY th.date, th.id`);
  return helper.emptyOrRows(rows);
}

/**
 * The material in stock (bought and not given to banks) over time, for the quantity units
 * (the cumulative amount after each movement of a purchase).
 */
async function get_raw_materials_quantity_history(quantity_units) {
  const rows = await db.query(
    `SELECT
        th.id,
        th.date,
        th.transaction_quantity,
        th.transaction_type,
        SUM(IF(th.to_type = 'purchase', th.transaction_quantity, -th.transaction_quantity))
          OVER (ORDER BY th.date, th.id ROWS UNBOUNDED PRECEDING) AS cumulative_amount
      FROM transaction_history th
      WHERE th.quantity_units = (?)
        AND th.from_type IS NOT NULL
        AND (th.to_type = 'purchase' OR th.from_type = 'purchase')
      ORDER BY th.date, th.id;`, [quantity_units]);
  return helper.emptyOrRows(rows);
}

module.exports = {
  EVENT,
  context_of,
  snapshot_purchase,
  snapshot_bank,
  snapshot_allocation,
  purchase_free_quantity,
  bank_free_quantity,
  record_move,
  track_purchase,
  track_bank,
  track_allocation,
  release_allocation,
  release_bank,
  release_banks_where,
  release_purchase,
  track_babies_to_order,
  track_babies_from_order,
  track_tails_to_order,
  track_tails_from_order,
  get_enum_values,
  get_flow,
  get_raw_materials_quantity_history
}
