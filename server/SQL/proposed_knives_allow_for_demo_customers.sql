-- Proposal (not applied): knives that demo customers may pick in the hat calculator.
-- Also add the column to the `knives` table in 01_create_db.sql if this is accepted:
--   `allow_for_demo_customers` BOOL NOT NULL DEFAULT FALSE,
CALL add_column_if_not_exists('knives', 'allow_for_demo_customers', 'BOOLEAN NOT NULL DEFAULT FALSE');
