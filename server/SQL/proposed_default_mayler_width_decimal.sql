-- PROPOSED, not yet applied. Review and run manually.
-- customers.default_mayler_width was created as INT, so 0.15 / 0.17 / 0.20 are rounded to 0 on save.
-- Existing values are all 0 (rounded), so reset them to NULL (= "no default") rather than keep a bogus 0.
ALTER TABLE customers MODIFY COLUMN default_mayler_width DECIMAL(4,2) NULL;
UPDATE customers SET default_mayler_width = NULL WHERE default_mayler_width = 0;
