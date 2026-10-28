// Edits made to a wing's babies from the wing diagram, and how a host applies them to its babies.

import { WingBaby } from '../../../../types';

export type WingBabyEdit =
  | { action: 'length'; position: string; length: number }   // a baby's length changed
  | { action: 'add'; position: string; length: number }      // a baby was added at the end of its side (e.g. 'L6')
  | { action: 'remove'; position: string };                  // a baby was removed; the ones after it move down by one

const parse = (position: string) => {
  const match = position.toUpperCase().match(/^([LRC])(\d+)$/);
  return match ? { prefix: match[1], number: Number(match[2]) } : null;
};

/** Returns the babies with the edit applied (a new array; the babies themselves are copied when changed). */
export function applyBabyEdit(babies: WingBaby[], edit: WingBabyEdit, wing_id: number): WingBaby[] {
  const position = edit.position.toUpperCase();
  switch (edit.action) {
    case 'length':
      return babies.map(b => b.position.toUpperCase() == position ? { ...b, length: edit.length } : b);

    case 'add':
      return [...babies, { id: 0, wing_id: wing_id, position: position, length: edit.length }];

    case 'remove': {
      const removed = parse(position);
      return babies
        .filter(b => b.position.toUpperCase() != position)
        .map(b => {
          const p = parse(b.position);
          // renumber the babies after the removed one on the same side
          return (removed && p && p.prefix == removed.prefix && p.number > removed.number)
            ? { ...b, position: p.prefix + (p.number - 1) }
            : b;
        });
    }
  }
}
