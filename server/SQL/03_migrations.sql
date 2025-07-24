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