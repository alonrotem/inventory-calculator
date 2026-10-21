use inventory;

#====================== MIGRATIONS =====================
#=======================================================

# Move the isurgent from customer_hats to orders (1-to-many)
CALL add_column_if_not_exists('orders', 'isurgent', 'BOOL default false');
CALL run_if_column_exists('customer_hats', 'isurgent',
  'update orders o join customer_hats ch on o.customer_hat_id=ch.id set o.isurgent=ch.isurgent;');
CALL drop_column_if_exists('customer_hats', 'isurgent');

# Move the white_hair from customer_hats to orders (1-to-many)
CALL add_column_if_not_exists('orders', 'white_hair', 'BOOL default false');
CALL run_if_column_exists('customer_hats', 'white_hair',
  'update orders o join customer_hats ch on o.customer_hat_id=ch.id set o.white_hair=ch.white_hair;');
CALL drop_column_if_exists('customer_hats', 'white_hair');

# Move the white_hair_notes from customer_hats to orders (1-to-many)
CALL add_column_if_not_exists('orders', 'white_hair_notes', 'Varchar(256) null');
CALL run_if_column_exists('customer_hats', 'white_hair_notes',
  'update orders o join customer_hats ch on o.customer_hat_id=ch.id set o.white_hair_notes=ch.white_hair_notes;');
CALL drop_column_if_exists('customer_hats', 'white_hair_notes');

# Move the white_hair_notes from customer_hats to orders (1-to-many)
CALL add_column_if_not_exists('orders', 'order_notes', 'Varchar(256) null');
CALL run_if_column_exists('customer_hats', 'order_notes',
  'update orders o join customer_hats ch on o.customer_hat_id=ch.id set o.order_notes=ch.order_notes;');
CALL drop_column_if_exists('customer_hats', 'order_notes');

# Split the L1 baby
CALL add_column_if_not_exists('wings', 'split_l1', 'int not null default 1');
# Set the crown width area (to calculate wings per diameter)
CALL add_column_if_not_exists('wings', 'crown_width', 'float not null default 2');

# Add hat diameter to the order
CALL add_column_if_not_exists('orders', 'diameter_inches', 'float not null default 12.5');

# Change the precision of the raw_materials -> purchase_quantity column (decimal of up to 15 digits + 2 precision decimal places)
call convert_column_type('raw_materials', 'purchase_quantity', 'DECIMAL(15,2) not null');
call convert_column_type('raw_materials', 'remaining_quantity', 'DECIMAL(15,2) not null');

CALL add_column_if_not_exists('customer_banks', 'quantity_in_kg', 'DECIMAL(15,2) not null default 0');
CALL add_column_if_not_exists('customer_banks', 'quantity_units', 'ENUM(\'kg\', \'units\') DEFAULT \'units\'');
call convert_column_type('customer_banks', 'quantity', 'DECIMAL(15,2) not null');
call convert_column_type('customer_banks', 'remaining_quantity', 'DECIMAL(15,2) not null');
call convert_column_type('customer_banks_allocations', 'quantity', 'DECIMAL(15,2) not null');
call convert_column_type('customer_banks_allocations', 'remaining_quantity', 'DECIMAL(15,2) not null');
call convert_column_type('currencies', 'symbol', 'VARCHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci  NULL');

CALL add_column_if_not_exists('wings', 'angled_crown', 'boolean default false');

CALL add_column_if_not_exists('users', 'is_demo_customer', 'boolean not null default false');
CALL add_column_if_not_exists('customers', 'is_demo_customer', 'boolean not null default false');
CALL add_column_if_not_exists('account_requests', 'is_demo_customer', 'boolean not null default false');
CALL add_column_if_not_exists('account_invites', 'is_demo_customer', 'boolean not null default false');
CALL add_column_if_not_exists('account_invites', 'create_new_customer', 'boolean not null default false');

CALL add_column_if_not_exists('account_requests', 'address', 'varchar(255) NULL');
CALL add_column_if_not_exists('account_requests', 'business_name', 'varchar(255) NULL');

CREATE TABLE  IF NOT EXISTS wings_customers (
	`wing_id`				INT NOT NULL,
	`customer_id`			INT NOT NULL,
	CONSTRAINT fk_wings_customers_wing
	  FOREIGN KEY (`wing_id`) REFERENCES wings(`id`) ON DELETE cascade,
	CONSTRAINT fk_wings_customers_customer
	  FOREIGN KEY (`customer_id`) REFERENCES customers(`id`) ON DELETE cascade
);

-- Tails material (r/l)
CALL rename_column('customer_hats', 'tails_material_id', 'tails_material_id_r');
CALL add_column_if_not_exists('customer_hats', 'tails_material_id_l', 'int NULL');
update customer_hats set tails_material_id_l = tails_material_id_r 
	where tails_material_id_l is null;

call drop_fk('customer_hats', 'fk_customer_hats_tails_material_id');
call drop_fk('customer_hats', 'fk_customer_hats_tails_material_id_l');
call drop_fk('customer_hats', 'fk_customer_hats_tails_material_id_r');
/*
call drop_column_if_exists('customer_hats', 'tails_material_id');
call drop_column_if_exists('customer_hats', 'tails_material_id_r');
call drop_column_if_exists('customer_hats', 'tails_material_id_l');
*/
/*
call convert_column_type('customer_hats', 'tails_material_id_r', 'int NULL');
call add_column_if_not_exists('customer_hats', 'tails_material_id_r', 'int NULL');
call add_column_if_not_exists('customer_hats', 'tails_material_id_l', 'int NULL');
*/
-- call add_fk('customer_hats', 'fk_customer_hats_tails_material_id_r', 'tails_material_id_r', 'raw_materials', 'id', true);
-- call add_fk('customer_hats', 'fk_customer_hats_tails_material_id_l', 'tails_material_id_l', 'raw_materials', 'id', true);

-- Tails allocation (r/l)
call drop_fk('customer_hats', 'fk_customer_hats_tails_alloc_id');
call drop_fk('customer_hats', 'fk_customer_hats_tails_alloc_id_l');
call drop_fk('customer_hats', 'fk_customer_hats_tails_alloc_id_r');

CALL rename_column('customer_hats', 'tails_allocation_id', 'tails_allocation_id_r');
CALL add_column_if_not_exists('customer_hats', 'tails_allocation_id_l', 'INT NOT NULL default 0');
update customer_hats set tails_allocation_id_l = tails_allocation_id_r 
	where tails_allocation_id_l = 0;
/*
call drop_column_if_exists('customer_hats', 'tails_allocation_id');
call drop_column_if_exists('customer_hats', 'tails_allocation_id_l');
call drop_column_if_exists('customer_hats', 'tails_allocation_id_r');

CALL add_column_if_not_exists('customer_hats', 'tails_allocation_id_l', 'int default 0');
CALL add_column_if_not_exists('customer_hats', 'tails_allocation_id_r', 'int default 0');
*/
call convert_column_type('customer_hats', 'tails_allocation_id_l', 'INT NOT NULL default 0');
call convert_column_type('customer_hats', 'tails_allocation_id_r', 'INT NOT NULL default 0');

/*
call add_fk('customer_hats', 'fk_customer_hats_tails_alloc_id_l', 'tails_allocation_id_l', 'customer_banks_allocations', 'id', true);
call add_fk('customer_hats', 'fk_customer_hats_tails_alloc_id_r', 'tails_allocation_id_r', 'customer_banks_allocations', 'id', true);
*/

-- Tails overdraft (r/l)
CALL rename_column('customer_hats', 'tails_overdraft', 'tails_overdraft_r');
CALL add_column_if_not_exists('customer_hats', 'tails_overdraft_l', 'float null');
call convert_column_type('customer_hats', 'tails_overdraft_l', 'float null');
call convert_column_type('customer_hats', 'tails_overdraft_r', 'float null');

update customer_hats set tails_overdraft_r = (tails_overdraft_r/2)
	where tails_overdraft_l is null;

update customer_hats set tails_overdraft_l = tails_overdraft_r 
	where tails_overdraft_l is null;


-- Tails (hr/hl)
CALL rename_column('customer_hats', 'hr_hl_width', 'hr_width');
call convert_column_type('customer_hats', 'hr_width', 'FLOAT NULL default 0.17');
CALL add_column_if_not_exists('customer_hats', 'hl_width', 'FLOAT NULL default 0.17');
update customer_hats set hr_width = 0.17 
	where hr_width is null or hr_width = 0;

-- Tails allocation now counting half-tails...
call convert_column_type('customer_banks_allocations', 'tails_quantity', 'float not null default 0');
call convert_column_type('customer_banks_allocations', 'tails_in_orders', 'float not null default 0');

-- Single order overdrafts
CALL rename_column('orders', 'tails_overdraft', 'tails_overdraft_r');
call convert_column_type('orders', 'tails_overdraft_r', 'float null');
CALL add_column_if_not_exists('orders', 'tails_overdraft_l', 'float null');

update orders set tails_overdraft_r = (tails_overdraft_r/2)
	where tails_overdraft_l is null;

update orders set tails_overdraft_l = tails_overdraft_r 
	where tails_overdraft_l is null;

-- material can be used for H material
CALL add_column_if_not_exists('raw_materials', 'is_usable_for_h_material', 'bool default true');

-- make tentative orders
# CALL add_column_if_not_exists('orders', 'is_tentative', 'bool default false');
call drop_column_if_exists('orders', 'is_tentative');
call convert_column_type('orders_status', 'order_status', 'ENUM(
			''new'',
            ''inline'',
            ''shipped'',
            ''onhold'',
            ''completed'',
            ''cancelled'',
            ''tentative''
		) NOT NULL'
);

call drop_fk('customer_hats', 'fk_customer_hats_wall_alloc_id');
call drop_fk('customer_hats', 'fk_customer_hats_crown_alloc_id');

call convert_column_type('customer_hats', 'wall_allocation_id', 'INT NOT null default 0');
call convert_column_type('customer_hats', 'crown_allocation_id', 'INT NOT null default 0');

CALL add_column_if_not_exists('orders_status', 'notes','varchar(255) NULL');
CALL add_column_if_not_exists('orders_status', 'updated_by', 'int not null default 1');

call drop_fk('customer_hats', 'fk_customer_hats_tails_material_id_r');
call drop_fk('customer_hats', 'fk_customer_hats_tails_material_id_l');

-- +++++++++++++++++++++++++++++++++++++++++++++
-- Clear duplicate records on the wings_customers table
-- 1. Create a safe copy containing exactly ONE of each record
CREATE TABLE wings_customers_clean AS 
SELECT DISTINCT wing_id, customer_id
FROM wings_customers;
-- 2. Drop the original table that contains duplicates
DROP TABLE wings_customers;
-- 3. Rename the clean table to take its place
RENAME TABLE wings_customers_clean TO wings_customers;
-- +++++++++++++++++++++++++++++++++++++++++++++

-- ========= NEW SEPARATE RAW MATERIAL PURCHASES ==================
DROP PROCEDURE IF EXISTS migrate_raw_material_banks_if_needed;
DELIMITER $$
CREATE PROCEDURE migrate_raw_material_banks_if_needed()
BEGIN
    DECLARE legacy_banks INT DEFAULT 0;

    -- Migrate only while raw_materials still carries the legacy purchase columns
    -- (01_create_db.sql may already have created an empty raw_material_purchases table)
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'raw_materials'
          AND column_name = 'purchase_quantity'
    ) THEN
        -- customer_banks still points at raw_materials (legacy), decided once up front
        SELECT COUNT(*) INTO legacy_banks
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'customer_banks'
          AND column_name = 'raw_material_id';

        START TRANSACTION;

        -- 1. Create table
        CREATE TABLE IF NOT EXISTS `raw_material_purchases` (
          `id`                  INT NOT NULL AUTO_INCREMENT,
          `raw_material_id`     INT NOT NULL,
          `purchased_at`        DATE NOT NULL DEFAULT (CURRENT_DATE),
          `purchase_quantity`   DECIMAL(15,2) NOT NULL,
          `remaining_quantity`  DECIMAL(15,2) NOT NULL,
          `quantity_units`      ENUM('kg', 'units') DEFAULT 'units',
          `units_per_kg`        FLOAT NULL,
          `vendor_name`         VARCHAR(255) NULL,
          `origin_country`      VARCHAR(2) NULL,
          `price`               FLOAT NULL,
          `currency`            VARCHAR(3) NULL,
          `notes`               VARCHAR(255) NULL,
          PRIMARY KEY (`id`),
          CONSTRAINT `fk_raw_material_purchases_material`
            FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials`(`id`) ON DELETE CASCADE
        );

        -- 2. Migrate data
        INSERT INTO `raw_material_purchases` (
          `raw_material_id`, `purchased_at`, `purchase_quantity`, `remaining_quantity`,
          `quantity_units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`
        )
        SELECT 
          `id`, `purchased_at`, `purchase_quantity`, `remaining_quantity`,
          `quantity_units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`
        FROM `raw_materials` rm
        WHERE NOT EXISTS (
          SELECT 1 FROM `raw_material_purchases` p WHERE p.`raw_material_id` = rm.`id`
        );

        -- 3-5. Re-point customer_banks from raw_materials to raw_material_purchases
        IF legacy_banks > 0 THEN
            CALL drop_fk('customer_banks', 'fk_customer_raw_material');

            ALTER TABLE `customer_banks`
              CHANGE COLUMN `raw_material_id` `raw_material_purchase_id` INT NOT NULL;

            -- Update FK values (one purchase was created per raw material)
            UPDATE `customer_banks` cb
            JOIN `raw_material_purchases` rmp
              ON cb.`raw_material_purchase_id` = rmp.`raw_material_id`
            SET cb.`raw_material_purchase_id` = rmp.`id`;

            ALTER TABLE `customer_banks`
              ADD CONSTRAINT `fk_customer_bank_raw_material_purchase`
                FOREIGN KEY (`raw_material_purchase_id`) REFERENCES `raw_material_purchases`(`id`) ON DELETE CASCADE;
        END IF;

        -- 6. Clean up raw_materials: drop the FKs first (if present), then the columns (if present)
        CALL drop_fk('raw_materials', 'fk_raw_material_country');
        CALL drop_fk('raw_materials', 'fk_raw_material_currency');
        CALL drop_column_if_exists('raw_materials', 'purchased_at');
        CALL drop_column_if_exists('raw_materials', 'purchase_quantity');
        CALL drop_column_if_exists('raw_materials', 'remaining_quantity');
        CALL drop_column_if_exists('raw_materials', 'quantity_units');
        CALL drop_column_if_exists('raw_materials', 'units_per_kg');
        CALL drop_column_if_exists('raw_materials', 'vendor_name');
        CALL drop_column_if_exists('raw_materials', 'origin_country');
        CALL drop_column_if_exists('raw_materials', 'price');
        CALL drop_column_if_exists('raw_materials', 'currency');
        CALL drop_column_if_exists('raw_materials', 'notes');

        COMMIT;
    END IF;
END $$
DELIMITER ;
-- Run the procedure
CALL migrate_raw_material_banks_if_needed();
-- Clean up
DROP PROCEDURE IF EXISTS migrate_raw_material_banks_if_needed;

call add_fk('raw_material_purchases', 'fk_raw_material_country', 'origin_country', 'countries', 'code', true);
call add_fk('raw_material_purchases', 'fk_raw_material_currency', 'currency', 'currencies', 'code', true);
-- =========/ NEW SEPARATE RAW MATERIAL PURCHASES ==================  

-- Set raw materials user
update raw_materials rm set rm.created_by=1, rm.updated_by=1 where rm.created_by=0; 
CALL add_column_if_not_exists('raw_material_purchases', 'updated_by','int null');
update raw_material_purchases set updated_by=1 where updated_by is null;

select "Migrations done", CURRENT_TIMESTAMP;
