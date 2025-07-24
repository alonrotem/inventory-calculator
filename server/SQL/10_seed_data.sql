use inventory;
SET @delete_records=TRUE;

# ========== DELETES ==========

# CUSTOMERS
# -----------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `customers` where @delete_records=TRUE;", 'SELECT \'Table customers does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# MATERIAL_COLORS
# -----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'material_colors');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `material_colors` where @delete_records=TRUE;", 'SELECT \'Table material_colors does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# RAW_MATERIALS
# ---------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'raw_materials');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `raw_materials` where @delete_records=TRUE;", 'SELECT \'Table raw_materials does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CUSTOMER_BANKS
# ----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_banks');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `customer_banks` where @delete_records=TRUE;", 'SELECT \'Table customer_banks does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;



# Table customer_banks_babies does not exist in the database!

# CUSTOMER_BANKS_ALLOCATIONS
# ----------------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_banks_allocations');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `customer_banks_allocations` where @delete_records=TRUE;", 'SELECT \'Table customer_banks_allocations does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;



# Table babies does not exist in the database!

# ALLOCATION_BABIES
# -------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'allocation_babies');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `allocation_babies` where @delete_records=TRUE;", 'SELECT \'Table allocation_babies does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# TRANSACTION_HISTORY
# ---------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'transaction_history');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `transaction_history` where @delete_records=TRUE;", 'SELECT \'Table transaction_history does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# WINGS
# -------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'wings');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `wings` where @delete_records=TRUE;", 'SELECT \'Table wings does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# WINGS_BABIES
# --------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'wings_babies');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `wings_babies` where @delete_records=TRUE;", 'SELECT \'Table wings_babies does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CUSTOMER_HATS
# ---------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_hats');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `customer_hats` where @delete_records=TRUE;", 'SELECT \'Table customer_hats does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;



# Table hats_wings does not exist in the database!

# ORDERS
# --------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'orders');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `orders` where @delete_records=TRUE;", 'SELECT \'Table orders does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ORDERS_STATUS
# ---------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'orders_status');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `orders_status` where @delete_records=TRUE;", 'SELECT \'Table orders_status does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# SETTINGS
# ----------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'settings');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `settings` where @delete_records=TRUE;", 'SELECT \'Table settings does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ========== INSERTS ==========

# CUSTOMERS
# -----------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customers` (`id`, `name`, `business_name`, `email`, `phone`, `tax_id`, `customer_code`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`, `order_seq_number`) 
VALUES
(9, 'Alon Rotem', 'Romtech', 'alon@mail.com', '+359 (88) 401-3532', 'Tax payer 1234', 'L', null, '2025-01-06 20:05:29', '2025-07-02 11:21:03', 1, 1, 1),
(10, 'Avi Bar', 'Romtech', 'avi_bar@mail.com', '+359 87 985 8868', 'Tax payer 5678', 'AB', null, '2025-01-06 20:05:29', '2025-07-24 10:04:32', 1, 1, 14),
(11, 'Guy Tal', 'Guytech', 'guy@mail.com', '+359 87 123 4567', 'Tax payer 90123', null, null, '2025-01-06 20:05:29', '2025-06-27 12:52:29', 1, 1, 1),
(12, 'London', 'London Inc', '', '', '456456', 'L', null, '2025-02-24 22:19:45', '2025-07-23 19:57:10', 0, 0, 7),
(13, 'NY', 'NY', 'ny@gmail.con', '878782858', '234578', 'USA', null, '2025-02-25 20:10:16', '2025-07-22 21:54:08', 0, 0, 12),
(14, 'VK BKLYN', 'K Shtreimel ', '', '7184568578', '369632', 'VК', null, '2025-07-15 15:48:13', '2025-07-15 15:53:25', 0, 0, 1)
as new_customers
ON DUPLICATE KEY UPDATE
`name`=new_customers.`name`, `business_name`=new_customers.`business_name`, `email`=new_customers.`email`, `phone`=new_customers.`phone`, `tax_id`=new_customers.`tax_id`, `customer_code`=new_customers.`customer_code`, `notes`=new_customers.`notes`, `created_at`=new_customers.`created_at`, `updated_at`=new_customers.`updated_at`, `created_by`=new_customers.`created_by`, `updated_by`=new_customers.`updated_by`, `order_seq_number`=new_customers.`order_seq_number`;", 'SELECT \'Table customers does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# MATERIAL_COLORS
# -----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'material_colors');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `material_colors` (`priority`, `color`) 
VALUES
(50, 'Black'),
(30, 'Brown'),
(40, 'Dark brown'),
(20, 'Light brown'),
(60, 'Mixed color'),
(10, 'Natural')
as new_material_colors
ON DUPLICATE KEY UPDATE
`priority`=new_material_colors.`priority`, `color`=new_material_colors.`color`;", 'SELECT \'Table material_colors does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# RAW_MATERIALS
# ---------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'raw_materials');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `raw_materials` (`id`, `name`, `purchased_at`, `purchase_quantity`, `remaining_quantity`, `quantity_units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`, `color`, `created_at`, `updated_at`, `created_by`, `updated_by`, `allow_shortening_babies_in_pairs`) 
VALUES
(13, 'Sable', '2024-06-08 00:00:00', 210, 0, 'units', 30, 'JJ', 'US', 30, 'USD', 'This is a test material', 'Dark brown', '2025-01-06 20:05:29', '2025-02-16 21:07:25', 1, 1, 0),
(15, 'SM', '2024-06-08 00:00:00', 1000, 600, 'units', 112, 'KK', 'RU', 3, 'USD', 'This is a test material', 'Dark brown', '2025-01-06 20:05:29', '2025-02-25 20:11:19', 1, 1, 0),
(16, 'BM', '2024-06-08 00:00:00', 750, 550, 'units', 135, null, 'US', 60, 'EUR', 'This is a test material', 'Light brown', '2025-01-06 20:05:29', '2025-05-27 21:20:24', 1, 1, 0),
(17, 'Canady', '2024-06-08 00:00:00', 7, 3, 'kg', 10, 'XY', 'US', 10, 'USD', 'This is a test material', 'Light brown', '2025-01-06 20:05:29', '2025-06-01 22:33:15', 1, 1, 0),
(19, 'DМ light', '2025-01-07 00:00:00', 750, 600, 'units', 2, 'KK', 'US', 25, 'USD', 'Demo material for calculations', 'Natural', '2025-01-07 15:19:09', '2025-06-01 09:25:50', 0, 0, 0),
(20, 'DM', '2025-02-08 00:00:00', 100, 5, 'units', 80, 'dd', 'US', 20, 'USD', '', 'Black', '2025-02-08 21:20:42', '2025-07-10 15:42:10', 0, 0, 1),
(21, 'DM Medium brown', '2025-06-05 00:00:00', 500, 400, 'units', 4, '', 'US', 25, 'USD', '', 'Dark brown', '2025-06-05 08:38:20', '2025-06-05 08:38:20', 0, 0, 0),
(22, 'DM', '2025-06-05 00:00:00', 1000, 600, 'units', 110, '', 'US', 14, 'USD', '', 'Dark brown', '2025-06-05 10:39:38', '2025-06-06 13:00:29', 0, 0, 0),
(23, 'BM', '2025-06-05 00:00:00', 2200, 1600, 'units', 0, '', 'RU', 18, 'USD', '', 'Natural', '2025-06-05 11:59:21', '2025-07-23 19:48:24', 0, 0, 0),
(24, 'Sable H', '2025-06-06 00:00:00', 2350, 0, 'units', 235, '', 'US', 7, 'USD', '', 'Mixed color', '2025-06-06 12:52:24', '2025-07-21 08:41:23', 0, 0, 0),
(25, 'DM ', '2025-07-01 00:00:00', 500, 200, 'units', 0, 'London', 'US', 1.5, 'USD', 'return from dyeing on July 1st dyeing cost 2$', 'Dark brown', '2025-07-01 17:55:24', '2025-07-15 15:49:57', 0, 0, 0),
(26, 'Sable ', '2025-07-08 00:00:00', 2000, 796, 'units', 340, '', 'US', 0, 'USD', '', 'Natural', '2025-07-08 14:53:01', '2025-07-15 15:49:25', 0, 0, 0),
(27, 'Demo H materials', '2025-07-18 00:00:00', 5000, 4000, 'units', 230, '', 'US', 3, 'USD', '', 'Natural', '2025-07-18 07:04:10', '2025-07-18 07:04:28', 0, 0, 0),
(28, 'Stable ', '2025-07-23 00:00:00', 6000, 5000, 'units', 230, '', 'US', 6, 'USD', '', 'Natural', '2025-07-22 21:57:22', '2025-07-22 21:57:46', 0, 0, 0)
as new_raw_materials
ON DUPLICATE KEY UPDATE
`name`=new_raw_materials.`name`, `purchased_at`=new_raw_materials.`purchased_at`, `purchase_quantity`=new_raw_materials.`purchase_quantity`, `remaining_quantity`=new_raw_materials.`remaining_quantity`, `quantity_units`=new_raw_materials.`quantity_units`, `units_per_kg`=new_raw_materials.`units_per_kg`, `vendor_name`=new_raw_materials.`vendor_name`, `origin_country`=new_raw_materials.`origin_country`, `price`=new_raw_materials.`price`, `currency`=new_raw_materials.`currency`, `notes`=new_raw_materials.`notes`, `color`=new_raw_materials.`color`, `created_at`=new_raw_materials.`created_at`, `updated_at`=new_raw_materials.`updated_at`, `created_by`=new_raw_materials.`created_by`, `updated_by`=new_raw_materials.`updated_by`, `allow_shortening_babies_in_pairs`=new_raw_materials.`allow_shortening_babies_in_pairs`;", 'SELECT \'Table raw_materials does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CUSTOMER_BANKS
# ----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_banks');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_banks` (`id`, `customer_id`, `raw_material_id`, `quantity`, `remaining_quantity`) 
VALUES
(13, 9, 13, 10, 2),
(15, 10, 13, 30, 10),
(16, 11, 13, 170, 70),
(20, 10, 20, 15, 5),
(21, 12, 20, 80, 69),
(22, 13, 15, 400, 292),
(23, 10, 16, 200, 8),
(24, 10, 16, 200, 100),
(25, 12, 19, 150, 50),
(26, 12, 19, 150, 150),
(28, 9, 17, 4, 0),
(29, 10, 21, 100, 90),
(30, 11, 22, 200, 100),
(31, 12, 23, 600, 0),
(32, 13, 24, 1240, 840),
(33, 13, 22, 200, 100),
(34, 10, 24, 1110, 110),
(35, 10, 26, 500, 0),
(36, 14, 26, 704, 0),
(37, 14, 25, 300, 100),
(38, 12, 27, 1000, 0),
(39, 12, 28, 1000, 600)
as new_customer_banks
ON DUPLICATE KEY UPDATE
`customer_id`=new_customer_banks.`customer_id`, `raw_material_id`=new_customer_banks.`raw_material_id`, `quantity`=new_customer_banks.`quantity`, `remaining_quantity`=new_customer_banks.`remaining_quantity`;", 'SELECT \'Table customer_banks does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;



# Table customer_banks_babies does not exist in the database!

# CUSTOMER_BANKS_ALLOCATIONS
# ----------------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_banks_allocations');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_banks_allocations` (`id`, `customer_bank_id`, `quantity`, `remaining_quantity`, `allocation_type`, `tails_quantity`, `tails_in_orders`) 
VALUES
(2, 13, 5, 5, 'babies', 0, 0),
(3, 13, 3, 2, 'babies', 0, 0),
(11, 15, 10, 0, 'babies', 0, 0),
(12, 15, 10, 0, 'babies', 0, 0),
(13, 20, 10, 0, 'babies', 0, 0),
(14, 16, 100, 0, 'babies', 0, 0),
(16, 21, 11, 0, 'babies', 0, 0),
(17, 22, 100, 0, 'babies', 0, 0),
(18, 23, 172, 0, 'babies', 0, 0),
(23, 25, 100, 0, 'babies', 0, 0),
(25, 28, 3, 0, 'babies', 0, 0),
(26, 28, 1, 0, 'tails', 10000, 0),
(27, 23, 20, 0, 'tails', 0, 0),
(28, 29, 10, 0, 'babies', 0, 0),
(29, 30, 100, 0, 'babies', 0, 0),
(32, 22, 8, 0, 'babies', 0, 0),
(33, 33, 100, 0, 'babies', 0, 0),
(34, 34, 600, 0, 'tails', 0, 164),
(35, 34, 400, 0, 'tails', 222, 178),
(36, 32, 400, 0, 'tails', 0, 400),
(38, 24, 100, 0, 'babies', 0, 0),
(39, 35, 400, 0, 'tails', 0, 0),
(40, 35, 100, 0, 'tails', 0, 0),
(42, 37, 200, 0, 'babies', 0, 0),
(43, 36, 704, 0, 'tails', 0, 0),
(44, 38, 1000, 0, 'tails', 0, 0),
(45, 31, 600, 0, 'babies', 0, 0),
(46, 39, 400, 0, 'tails', 0, 0)
as new_customer_banks_allocations
ON DUPLICATE KEY UPDATE
`customer_bank_id`=new_customer_banks_allocations.`customer_bank_id`, `quantity`=new_customer_banks_allocations.`quantity`, `remaining_quantity`=new_customer_banks_allocations.`remaining_quantity`, `allocation_type`=new_customer_banks_allocations.`allocation_type`, `tails_quantity`=new_customer_banks_allocations.`tails_quantity`, `tails_in_orders`=new_customer_banks_allocations.`tails_in_orders`;", 'SELECT \'Table customer_banks_allocations does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;



# Table babies does not exist in the database!

# ALLOCATION_BABIES
# -------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'allocation_babies');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `allocation_babies` (`id`, `allocation_id`, `length`, `quantity`, `quantity_in_pending_orders`) 
VALUES
(1, 3, 10.5, 10, 0),
(2, 3, 9, 19, 0),
(3, 3, 6, 35, 0),
(4, 3, 7.5, 20, 0),
(5, 3, 11, 34, 0),
(6, 3, 6.5, 11, 0),
(7, 3, 5, 13, 0),
(40, 2, 12, 1088, 0),
(41, 2, 11, 1616, 0),
(42, 2, 10.5, 1000, 0),
(43, 2, 10, 2080, 0),
(44, 2, 9.5, 1000, 0),
(45, 2, 9, 1000, 0),
(46, 2, 8.5, 1000, 0),
(47, 2, 8, 1000, 0),
(48, 2, 7.5, 1000, 0),
(49, 2, 7, 1000, 0),
(50, 2, 6.5, 1000, 0),
(51, 2, 6, 1000, 0),
(52, 2, 5.5, 1200, 0),
(62, 11, 7, 912, 88),
(63, 11, 6.5, 1612, 88),
(64, 11, 6, 1380, 220),
(65, 11, 5.5, 1456, 44),
(66, 13, 7, 76, 1444),
(67, 13, 6.5, 384, 1136),
(68, 13, 6, 1000, 520),
(69, 13, 5.5, 692, 671),
(70, 14, 11, 500, 0),
(71, 14, 10, 600, 0),
(72, 14, 9.5, 500, 0),
(73, 14, 9, 500, 0),
(74, 14, 8.5, 500, 0),
(75, 14, 8, 400, 0),
(76, 14, 7.5, 800, 0),
(77, 14, 7, 800, 0),
(78, 14, 6.5, 700, 0),
(79, 14, 6, 200, 0),
(80, 14, 5.5, 210, 0),
(81, 14, 5, 200, 0),
(82, 13, 10, 1692, 956),
(83, 13, 8.5, 1384, 949),
(84, 13, 8, 1076, 1415),
(89, 13, 11, 1000, 0),
(96, 16, 7.5, 3200, 0),
(97, 17, 9, 1140, 860),
(98, 17, 8.5, 4724, 176),
(99, 17, 8, 988, 1036),
(100, 17, 7.5, 1306, 694),
(101, 17, 7, 6464, 1036),
(102, 17, 6.5, 4964, 1036),
(103, 17, 6, 5964, 1036),
(104, 17, 5.5, 3096, 904),
(105, 17, 10, 2850, 2150),
(152, 18, 10, 1022, 2578),
(153, 18, 9.5, 2114, 1430),
(154, 18, 9, 2562, 2402),
(155, 18, 8.5, 3738, 1650),
(156, 18, 8, 3435, 1353),
(157, 18, 7.5, 1423, 1665),
(158, 18, 7, 1935, 2153),
(159, 18, 6.5, 1374, 2714),
(160, 18, 6, 16590, 4501),
(161, 18, 5.5, 1682, 2406),
(162, 18, 5, 3000, 0),
(204, 13, 9.5, 1692, 410),
(205, 13, 9, 1692, 483),
(206, 13, 7.5, 1500, 520),
(207, 13, 5, 384, 1258),
(229, 13, 11.5, 500, 0),
(230, 13, 10.5, 1200, 88),
(243, 11, 9, 956, 44),
(248, 23, 11, 700, 0),
(249, 23, 10.5, 1080, 220),
(250, 23, 10, 144, 1056),
(251, 23, 9.5, 548, 352),
(252, 23, 9, 234, 616),
(253, 23, 8.5, 628, 572),
(254, 23, 8, 384, 616),
(255, 23, 7.5, 208, 792),
(256, 23, 7, 8, 792),
(257, 23, 6.5, 658, 792),
(258, 23, 6, 420, 880),
(259, 23, 5.5, 980, 220),
(260, 25, 10, 2200, 0),
(261, 25, 9, 880, 0),
(262, 25, 8, 1760, 0),
(263, 25, 7.5, 1760, 0),
(264, 25, 7, 1760, 0),
(265, 25, 6.5, 1760, 0),
(266, 25, 6, 1760, 0),
(267, 25, 5.5, 440, 0),
(279, 28, 11, 1000, 0),
(280, 28, 10.5, 1000, 0),
(281, 28, 10, 2304, 396),
(282, 28, 9.5, 1200, 0),
(283, 28, 9, 1112, 88),
(284, 28, 8.5, 2200, 0),
(285, 28, 8, 912, 88),
(286, 28, 7.5, 956, 44),
(287, 28, 7, 1112, 88),
(288, 28, 6.5, 1112, 88),
(289, 28, 6, 2112, 88),
(290, 28, 5.5, 912, 88),
(291, 29, 5.5, 1010, 0),
(292, 28, 12, 240, 0),
(293, 28, 11.5, 200, 0),
(307, 33, 9, 1240, 0),
(318, 33, 6, 30, 0),
(320, 33, 5, 30, 0),
(322, 17, 11, 88, 0),
(323, 25, 9.5, 880, 0),
(324, 25, 8.5, 1320, 0),
(344, 38, 10, 50, 0),
(345, 38, 9.5, 100, 0),
(346, 38, 9, 200, 0),
(347, 38, 8.5, 300, 0),
(348, 38, 8, 230, 0),
(349, 38, 7.5, 800, 0),
(350, 38, 7, 900, 0),
(351, 38, 6.5, 800, 0),
(352, 38, 6, 1200, 0),
(353, 38, 5.5, 1000, 0),
(365, 42, 10, 300, 0),
(366, 42, 9.5, 556, 44),
(367, 42, 9, 724, 176),
(368, 42, 8.5, 762, 88),
(369, 42, 8, 712, 88),
(370, 42, 7.5, 812, 88),
(371, 42, 7, 912, 88),
(372, 42, 6.5, 1312, 88),
(373, 42, 6, 1080, 220),
(374, 42, 5.5, 1156, 44),
(375, 42, 5, 1000, 0),
(392, 11, 8, 412, 88),
(393, 11, 7.5, 868, 132),
(394, 11, 5, 1500, 0),
(395, 16, 11, 500, 0),
(396, 16, 10.5, 700, 0),
(397, 16, 10, 1000, 0),
(398, 16, 9.5, 850, 0),
(399, 16, 9, 800, 0),
(400, 16, 8.5, 1000, 0),
(401, 16, 8, 2000, 0),
(402, 16, 7, 2600, 0),
(403, 16, 6.5, 2500, 0),
(404, 16, 6, 2500, 0),
(405, 16, 5.5, 3000, 0),
(406, 16, 5, 2000, 0),
(408, 45, 11, 248, 352),
(409, 45, 10.5, 150, 0),
(410, 45, 10, 200, 0),
(411, 45, 9.5, 200, 0),
(412, 45, 9, 600, 0),
(413, 45, 8.5, 600, 0),
(414, 45, 8, 800, 176),
(415, 45, 7.5, 1000, 352),
(416, 45, 7, 636, 916),
(417, 45, 6.5, 1412, 540),
(418, 45, 6, 1312, 892),
(419, 45, 5.5, 812, 540),
(420, 45, 5, 1000, 0),
(436, 45, 12, 60, 0),
(437, 45, 11.5, 80, 0)
as new_allocation_babies
ON DUPLICATE KEY UPDATE
`allocation_id`=new_allocation_babies.`allocation_id`, `length`=new_allocation_babies.`length`, `quantity`=new_allocation_babies.`quantity`, `quantity_in_pending_orders`=new_allocation_babies.`quantity_in_pending_orders`;", 'SELECT \'Table allocation_babies does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# TRANSACTION_HISTORY
# ---------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'transaction_history');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `transaction_history` (`id`, `date`, `added_by`, `transaction_quantity`, `transaction_type`, `raw_material_id`, `customer_id`, `customer_bank_id`, `allocation_id`, `cur_raw_material_quantity`, `cur_customer_bank_quantity`, `cur_banks_babies_allocation_quantity`) 
VALUES
(1, '2024-09-11 00:00:00', 1, 200, 'raw_material_purchase', 13, 0, 0, 0, 200, 0, 0),
(2, '2024-09-12 01:01:00', 1, 10, 'to_customer_bank', 13, 9, 13, 0, 190, 10, 0),
(3, '2024-09-13 01:02:00', 1, 15, 'to_customer_bank', 13, 10, 15, 0, 175, 15, 0),
(4, '2024-09-14 01:03:00', 1, 2, 'to_customer_bank', 13, 11, 16, 0, 173, 2, 0),
(5, '2024-09-15 01:04:00', 1, 16, 'to_customer_bank', 13, 12, 17, 0, 157, 16, 0),
(6, '2024-09-16 01:05:00', 1, 10, 'raw_material_purchase', 13, 0, 0, 0, 167, 0, 0),
(7, '2024-09-17 01:06:00', 1, 15, 'to_customer_bank', 13, 10, 15, 0, 152, 30, 0),
(10, '2024-09-20 00:00:00', 1, 1000, 'raw_material_purchase', 15, 0, 0, 0, 1000, 0, 0),
(11, '2024-09-21 00:00:00', 1, 750, 'raw_material_purchase', 16, 0, 0, 0, 750, 0, 0),
(12, '2024-09-22 00:00:00', 1, 7, 'raw_material_purchase', 17, 0, 0, 0, 7, 0, 0),
(13, '2024-09-23 00:00:00', 1, 5, 'customer_bank_allocate_to_Work', 13, 9, 13, 2, -1, 5, 0),
(14, '2024-09-24 00:00:00', 1, 3, 'customer_bank_allocate_to_Work', 13, 9, 13, 3, -1, 2, 0),
(15, '2024-09-25 00:00:00', 1, 5, 'customer_bank_allocate_to_Work', 13, 9, 14, 4, -1, 15, 0),
(17, '2025-01-07 15:19:09', 1, 250, 'raw_material_purchase', 19, 0, 0, 0, 250, -1, -1),
(28, '2025-02-08 21:20:42', 1, 100, 'raw_material_purchase', 20, 0, 0, 0, 100, -1, -1),
(29, '2025-02-11 21:50:09', 1, 10, 'to_customer_bank', 20, 10, 20, 0, 90, 10, -1),
(30, '2025-02-11 21:53:41', 1, 10, 'customer_bank_allocate_to_Work', 13, 10, 15, 11, -1, 20, 0),
(31, '2025-02-11 21:55:18', 1, 10, 'customer_bank_allocate_to_Work', 13, 10, 15, 12, -1, 10, 0),
(32, '2025-02-11 21:55:47', 1, 10, 'customer_bank_allocate_to_Work', 20, 10, 20, 13, -1, 0, 0),
(33, '2025-02-16 21:07:29', 1, 168, 'to_customer_bank', 13, 11, 16, 0, 0, 170, -1),
(34, '2025-02-16 21:10:27', 1, 100, 'customer_bank_allocate_to_Work', 13, 11, 16, 14, -1, 70, 0),
(35, '2025-02-24 22:21:33', 1, 80, 'to_customer_bank', 20, 12, 21, 0, 10, 80, -1),
(36, '2025-02-24 22:24:28', 1, 10, 'customer_bank_allocate_to_Work', 20, 12, 21, 15, -1, 70, 0),
(37, '2025-02-25 12:54:37', 1, 11, 'customer_bank_allocate_to_Work', 20, 12, 21, 16, -1, 59, 0),
(38, '2025-02-25 20:11:22', 1, 400, 'to_customer_bank', 15, 13, 22, 0, 600, 400, -1),
(39, '2025-02-25 20:12:00', 1, 100, 'customer_bank_allocate_to_Work', 15, 13, 22, 17, -1, 300, 0),
(40, '2025-05-27 21:20:25', 1, 200, 'to_customer_bank', 16, 10, 23, 0, 550, 200, -1),
(41, '2025-05-27 21:20:25', 1, 200, 'to_customer_bank', 16, 10, 24, 0, 550, 200, -1),
(42, '2025-05-27 21:21:06', 1, 100, 'customer_bank_allocate_to_Work', 16, 10, 23, 18, -1, 100, 0),
(43, '2025-05-29 09:03:09', 1, 5, 'to_customer_bank', 20, 10, 20, 0, 5, 5, -1),
(44, '2025-05-29 09:03:12', 1, 5, 'to_customer_bank', 20, 10, 20, 0, 5, 5, -1),
(45, '2025-05-29 09:03:12', 1, 5, 'to_customer_bank', 20, 10, 20, 0, 5, 5, -1),
(46, '2025-06-01 09:15:56', 1, 5, 'customer_bank_allocate_to_Work', 16, 10, 23, 19, -1, 95, 0),
(47, '2025-06-01 09:15:56', 1, 5, 'customer_bank_allocate_to_Work', 16, 10, 23, 20, -1, 95, 0),
(48, '2025-06-01 09:15:56', 1, 5, 'customer_bank_allocate_to_Work', 16, 10, 23, 21, -1, 95, 0),
(49, '2025-06-01 09:20:19', 1, 0, 'customer_bank_allocate_to_Work', 16, 10, 23, 18, -1, -5, 0),
(50, '2025-06-01 09:15:56', 1, 5, 'customer_bank_allocate_to_Work', 16, 10, 23, 22, -1, 95, 0),
(51, '2025-06-01 09:25:50', 1, 500, 'raw_material_purchase', 19, 0, 0, 0, 750, -1, -1),
(52, '2025-06-01 09:25:51', 1, 150, 'to_customer_bank', 19, 12, 25, 0, 600, 150, -1),
(53, '2025-06-01 09:25:50', 1, 500, 'raw_material_purchase', 19, 0, 0, 0, 750, -1, -1),
(54, '2025-06-01 09:25:51', 1, 150, 'to_customer_bank', 19, 12, 26, 0, 600, 150, -1),
(55, '2025-06-01 09:27:21', 1, 100, 'customer_bank_allocate_to_Work', 19, 12, 25, 23, -1, 50, 0),
(57, '2025-06-01 22:33:30', 1, 3, 'customer_bank_allocate_to_Work', 17, 9, 28, 25, -1, 1, 0),
(58, '2025-06-01 22:33:42', 1, 1, 'customer_bank_allocate_to_Work', 17, 9, 28, 26, -1, 0, 0),
(59, '2025-06-04 21:56:50', 1, -28, 'customer_bank_allocate_to_Work', 16, 10, 23, 18, -1, 23, 0),
(60, '2025-06-04 21:57:00', 1, 20, 'customer_bank_allocate_to_Work', 16, 10, 23, 27, -1, 3, 0),
(63, '2025-06-05 08:38:22', 1, 500, 'raw_material_purchase', 21, 0, 0, 0, 500, -1, -1),
(64, '2025-06-05 08:38:23', 1, 100, 'to_customer_bank', 21, 10, 29, 0, 400, 100, -1),
(65, '2025-06-05 08:40:33', 1, 10, 'customer_bank_allocate_to_Work', 21, 10, 29, 28, -1, 90, 0),
(66, '2025-06-05 10:38:55', 1, 1000, 'raw_material_purchase', 22, 0, 0, 0, 1000, -1, -1),
(67, '2025-06-05 10:38:56', 1, 200, 'to_customer_bank', 22, 11, 30, 0, 800, 200, -1),
(68, '2025-06-05 10:41:04', 1, 100, 'customer_bank_allocate_to_Work', 22, 11, 30, 29, -1, 100, 0),
(69, '2025-06-05 11:59:22', 1, 1000, 'raw_material_purchase', 23, 0, 0, 0, 1000, -1, -1),
(70, '2025-06-05 12:00:06', 1, 300, 'to_customer_bank', 23, 12, 31, 0, 700, 300, -1),
(71, '2025-06-06 09:55:00', 1, 8, 'customer_bank_allocate_to_Work', 15, 13, 22, 30, -1, 292, 0),
(72, '2025-06-06 09:55:00', 1, 8, 'customer_bank_allocate_to_Work', 15, 13, 22, 31, -1, 292, 0),
(73, '2025-06-06 09:55:00', 1, 8, 'customer_bank_allocate_to_Work', 15, 13, 22, 32, -1, 292, 0),
(74, '2025-06-06 12:52:24', 1, 2350, 'raw_material_purchase', 24, 0, 0, 0, 2350, -1, -1),
(75, '2025-06-06 13:00:31', 1, 200, 'to_customer_bank', 22, 13, 33, 0, 600, 200, -1),
(76, '2025-06-06 13:02:04', 1, 100, 'customer_bank_allocate_to_Work', 22, 13, 33, 33, -1, 100, 0),
(77, '2025-06-29 19:57:15', 1, 360, 'customer_bank_allocate_to_Work', 24, 10, 34, 34, -1, 80, 0),
(78, '2025-06-29 20:03:12', 1, 560, 'to_customer_bank', 24, 10, 34, 0, 1350, 640, -1),
(79, '2025-06-29 20:11:20', 1, 400, 'customer_bank_allocate_to_Work', 24, 10, 34, 35, -1, 240, 0),
(80, '2025-06-30 08:29:41', 1, 440, 'to_customer_bank', 24, 13, 32, 0, 910, 440, -1),
(81, '2025-06-30 08:30:14', 1, 400, 'customer_bank_allocate_to_Work', 24, 13, 32, 36, -1, 40, 0),
(82, '2025-06-30 08:37:26', 1, 800, 'to_customer_bank', 24, 13, 32, 0, 110, 840, -1),
(83, '2025-07-01 17:55:24', 1, 500, 'raw_material_purchase', 25, 0, 0, 0, 500, -1, -1),
(84, '2025-07-03 20:40:59', 1, 110, 'to_customer_bank', 24, 10, 34, 0, 0, 350, -1),
(85, '2025-07-06 14:08:34', 1, -110, 'to_customer_bank', 24, 10, 34, 0, 110, 240, -1),
(86, '2025-07-08 14:53:01', 1, 2000, 'raw_material_purchase', 26, 0, 0, 0, 2000, -1, -1),
(87, '2025-07-08 14:53:36', 1, 500, 'to_customer_bank', 26, 10, 35, 0, 1500, 500, -1),
(88, '2025-07-08 14:57:27', 1, 100, 'customer_bank_allocate_to_Work', 16, 10, 24, 37, -1, 100, 0),
(89, '2025-07-08 14:57:27', 1, 100, 'customer_bank_allocate_to_Work', 16, 10, 24, 38, -1, 100, 0),
(90, '2025-07-08 15:02:28', 1, 400, 'customer_bank_allocate_to_Work', 26, 10, 35, 39, -1, 100, 0),
(91, '2025-07-08 15:04:01', 1, 0, 'customer_bank_allocate_to_Work', 26, 10, 35, 39, -1, 100, 0),
(92, '2025-07-08 15:05:51', 1, 100, 'customer_bank_allocate_to_Work', 26, 10, 35, 40, -1, 0, 0),
(93, '2025-07-15 15:49:27', 1, 704, 'to_customer_bank', 26, 14, 36, 0, 796, 704, -1),
(94, '2025-07-15 15:49:59', 1, 300, 'to_customer_bank', 25, 14, 37, 0, 200, 300, -1),
(95, '2025-07-15 15:50:50', 1, 200, 'customer_bank_allocate_to_Work', 25, 14, 37, 41, -1, 100, 0),
(96, '2025-07-15 15:50:50', 1, 200, 'customer_bank_allocate_to_Work', 25, 14, 37, 42, -1, 100, 0),
(97, '2025-07-15 15:53:10', 1, 704, 'customer_bank_allocate_to_Work', 26, 14, 36, 43, -1, 0, 0),
(98, '2025-07-18 07:04:10', 1, 5000, 'raw_material_purchase', 27, 0, 0, 0, 5000, -1, -1),
(99, '2025-07-18 07:04:30', 1, 1000, 'to_customer_bank', 27, 12, 38, 0, 4000, 1000, -1),
(100, '2025-07-18 07:05:41', 1, 1000, 'customer_bank_allocate_to_Work', 27, 12, 38, 44, -1, 0, 0),
(101, '2025-07-18 07:11:40', 1, 240, 'customer_bank_allocate_to_Work', 24, 10, 34, 34, -1, 0, 0),
(102, '2025-07-21 08:38:21', 1, 5, 'customer_bank_allocation_deleted', 16, 10, 23, 22, 0, 8, 0),
(103, '2025-07-21 08:41:23', 1, 110, 'to_customer_bank', 24, 10, 34, 0, 0, 110, -1),
(104, '2025-07-21 08:43:52', 1, 0, 'customer_bank_allocate_to_Work', 26, 10, 35, 39, -1, 0, 0),
(105, '2025-07-22 21:57:22', 1, 6000, 'raw_material_purchase', 28, 0, 0, 0, 6000, -1, -1),
(106, '2025-07-22 21:57:47', 1, 1000, 'to_customer_bank', 28, 12, 39, 0, 5000, 1000, -1),
(107, '2025-07-22 22:06:58', 1, 300, 'to_customer_bank', 23, 12, 31, 0, 400, 600, -1),
(108, '2025-07-22 22:07:57', 1, 600, 'customer_bank_allocate_to_Work', 23, 12, 31, 45, -1, 0, 0),
(109, '2025-07-22 22:10:04', 1, 400, 'customer_bank_allocate_to_Work', 28, 12, 39, 46, -1, 600, 0),
(110, '2025-07-23 19:48:24', 1, 1200, 'raw_material_purchase', 23, 0, 0, 0, 1600, -1, -1),
(111, '2025-07-23 19:49:30', 1, 10, 'customer_bank_allocation_deleted', 20, 12, 21, 15, 0, 69, 0),
(112, '2025-07-23 19:49:30', 1, 10, 'customer_bank_allocation_deleted', 20, 12, 21, 15, 0, 69, 0),
(113, '2025-07-23 19:49:30', 1, 10, 'customer_bank_allocation_deleted', 20, 12, 21, 15, 0, 69, 0)
as new_transaction_history
ON DUPLICATE KEY UPDATE
`date`=new_transaction_history.`date`, `added_by`=new_transaction_history.`added_by`, `transaction_quantity`=new_transaction_history.`transaction_quantity`, `transaction_type`=new_transaction_history.`transaction_type`, `raw_material_id`=new_transaction_history.`raw_material_id`, `customer_id`=new_transaction_history.`customer_id`, `customer_bank_id`=new_transaction_history.`customer_bank_id`, `allocation_id`=new_transaction_history.`allocation_id`, `cur_raw_material_quantity`=new_transaction_history.`cur_raw_material_quantity`, `cur_customer_bank_quantity`=new_transaction_history.`cur_customer_bank_quantity`, `cur_banks_babies_allocation_quantity`=new_transaction_history.`cur_banks_babies_allocation_quantity`;", 'SELECT \'Table transaction_history does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# WINGS
# -------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'wings');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `wings` (`id`, `name`, `knife`, `allow_shortening_babies_in_pairs`) 
VALUES
(1, 'RT65', 6.5, 0),
(2, 'RT70', 10, 0),
(3, 'RT85', 10, 0),
(5, 'תותח על', 10, 0),
(7, 'RT100', 12, 0),
(16, 'RT110', 12, 0),
(17, 'RT90', 12.5, 0),
(26, 'RT120', 12.5, 0),
(31, 'RT100 1217 T', 12.5, 1),
(35, 'RT1217 BM', 12.5, 1),
(37, 'Eli Shechter 10', 12.5, 0),
(39, 'DM 159', 9, 0),
(40, 'DM 15920250622173304', 9, 0),
(41, 'RT10020250622175355', 12, 0),
(42, 'RT9020250623005216', 12.5, 0),
(43, 'RT8520250623011331', 10, 0),
(44, 'RT7020250623225553', 10, 0),
(45, 'RT10020250623231901', 10, 0),
(46, 'RT6520250624130301', 6.5, 0)
as new_wings
ON DUPLICATE KEY UPDATE
`name`=new_wings.`name`, `knife`=new_wings.`knife`, `allow_shortening_babies_in_pairs`=new_wings.`allow_shortening_babies_in_pairs`;", 'SELECT \'Table wings does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# WINGS_BABIES
# --------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'wings_babies');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `wings_babies` (`id`, `parent_wing_id`, `position`, `length`) 
VALUES
(1, 1, 'L1', 5),
(4, 1, 'L3', 8.5),
(6, 1, 'L4', 7),
(7, 1, 'R1', 5),
(8, 1, 'R2', 6.5),
(10, 1, 'R3', 8),
(13, 1, 'TOP', 10),
(17, 1, 'L2', 7),
(18, 1, 'R4', 6.5),
(19, 1, 'L5', 8.5),
(20, 1, 'L6', 9),
(21, 1, 'R5', 5.5),
(22, 1, 'R6', 7),
(23, 1, 'R7', 9.5),
(55, 2, 'L1', 5.5),
(56, 2, 'L2', 6),
(57, 2, 'L3', 6.5),
(58, 2, 'L4', 7),
(59, 2, 'L5', 7),
(60, 2, 'L6', 7),
(61, 2, 'R1', 5.5),
(62, 2, 'R2', 6),
(63, 2, 'R3', 6.5),
(64, 2, 'R4', 7),
(65, 2, 'TOP', 7),
(66, 2, 'C1', 7),
(67, 1, 'C1', 8),
(68, 1, 'C2', 8),
(84, 3, 'L1', 5.5),
(85, 3, 'L2', 6),
(86, 3, 'L3', 6.5),
(87, 3, 'L4', 7),
(88, 3, 'L5', 7.5),
(89, 3, 'L6', 8),
(90, 3, 'R1', 5.5),
(91, 3, 'R2', 6),
(92, 3, 'R3', 6.5),
(93, 3, 'R4', 7),
(94, 3, 'R5', 7.5),
(95, 3, 'R6', 8),
(96, 3, 'TOP', 8.5),
(97, 3, 'C1', 11),
(98, 3, 'C2', 11),
(99, 5, 'L1', 10),
(100, 5, 'L2', 10),
(101, 5, 'L3', 10),
(102, 5, 'L4', 10),
(103, 5, 'L5', 10),
(104, 5, 'L6', 10),
(105, 5, 'L7', 10),
(106, 5, 'R1', 10),
(107, 5, 'R2', 10),
(108, 5, 'R3', 10),
(109, 5, 'R4', 10),
(110, 5, 'R5', 10),
(111, 5, 'TOP', 10),
(112, 5, 'C1', 10),
(113, 5, 'C2', 10),
(114, 5, 'C3', 10),
(115, 7, 'L1', 5.5),
(116, 7, 'L2', 6),
(117, 7, 'L3', 6.5),
(118, 7, 'L4', 7),
(119, 7, 'L5', 7.5),
(120, 7, 'L6', 8),
(121, 7, 'L7', 9),
(122, 7, 'R1', 5.5),
(123, 7, 'R2', 6),
(124, 7, 'R3', 6.5),
(125, 7, 'R4', 7),
(126, 7, 'R5', 8),
(127, 7, 'R6', 9),
(128, 7, 'TOP', 10),
(129, 7, 'C1', 10),
(130, 7, 'C2', 10),
(131, 7, 'C3', 10),
(132, 7, 'C4', 10),
(222, 16, 'L1', 5.5),
(223, 16, 'L2', 6),
(224, 16, 'L3', 6.5),
(225, 16, 'L4', 7),
(226, 16, 'L5', 8),
(227, 16, 'L6', 9),
(228, 16, 'L7', 10),
(229, 16, 'R1', 5.5),
(230, 16, 'R2', 6),
(231, 16, 'R3', 6.5),
(232, 16, 'R4', 7.5),
(233, 16, 'R5', 8.5),
(234, 16, 'R6', 9.5),
(235, 16, 'R7', 10.5),
(236, 16, 'TOP', 11),
(237, 16, 'C1', 10),
(238, 16, 'C2', 10),
(239, 16, 'C3', 10),
(240, 17, 'L1', 5.5),
(241, 17, 'L2', 6),
(242, 17, 'L3', 6.5),
(243, 17, 'L4', 7),
(244, 17, 'L5', 7.5),
(245, 17, 'L6', 8),
(246, 17, 'L7', 8.5),
(247, 17, 'R1', 6),
(248, 17, 'R2', 6.5),
(249, 17, 'R3', 7),
(250, 17, 'R4', 7.5),
(251, 17, 'R5', 8),
(252, 17, 'TOP', 9),
(253, 17, 'C1', 10),
(254, 17, 'C2', 10),
(255, 17, 'C3', 10),
(391, 26, 'L1', 5.5),
(392, 26, 'L2', 6),
(393, 26, 'L3', 7),
(394, 26, 'L4', 8),
(395, 26, 'L5', 9),
(396, 26, 'L6', 10),
(397, 26, 'L7', 11),
(398, 26, 'R1', 6),
(399, 26, 'R2', 7),
(400, 26, 'R3', 8),
(401, 26, 'R4', 9.5),
(402, 26, 'R5', 10.5),
(403, 26, 'R6', 11.5),
(404, 26, 'TOP', 12),
(405, 26, 'C1', 10),
(406, 26, 'C2', 10),
(407, 26, 'C3', 10),
(408, 26, 'C4', 10),
(474, 31, 'L1', 6),
(475, 31, 'L2', 6),
(476, 31, 'L3', 6.5),
(477, 31, 'L4', 6.5),
(478, 31, 'L5', 7),
(479, 31, 'L6', 7),
(480, 31, 'L7', 7.5),
(481, 31, 'L8', 7.5),
(482, 31, 'L9', 8),
(488, 31, 'R1', 5.5),
(489, 31, 'R2', 6),
(490, 31, 'R3', 6),
(491, 31, 'R4', 6.5),
(492, 31, 'R5', 6.5),
(493, 31, 'R6', 7),
(494, 31, 'R7', 7),
(495, 31, 'R8', 7.5),
(496, 31, 'R9', 7.5),
(502, 31, 'TOP', 10),
(521, 31, 'L10', 8),
(522, 31, 'L11', 8.5),
(523, 31, 'L12', 8.5),
(524, 31, 'L13', 9),
(525, 31, 'L14', 9),
(526, 31, 'L15', 9.5),
(527, 31, 'L16', 10),
(528, 31, 'R10', 8),
(529, 31, 'R11', 8.5),
(530, 31, 'R12', 9),
(531, 31, 'R13', 9.5),
(555, 31, 'C1', 10),
(556, 31, 'C2', 10),
(557, 31, 'C3', 10),
(558, 31, 'C4', 10),
(672, 35, 'TOP', 10),
(673, 35, 'C1', 10),
(674, 35, 'C2', 10),
(675, 35, 'L1', 5.5),
(676, 35, 'L2', 6),
(677, 35, 'L3', 6.5),
(678, 35, 'L4', 7),
(679, 35, 'L5', 8),
(680, 35, 'L6', 8.5),
(681, 35, 'L7', 9),
(682, 35, 'L8', 10),
(683, 35, 'R1', 5.5),
(684, 35, 'R2', 6.5),
(685, 35, 'R3', 7.5),
(686, 35, 'R4', 8.5),
(687, 35, 'R5', 9.5),
(706, 37, 'TOP', 9.5),
(707, 37, 'C1', 9),
(708, 37, 'C2', 9),
(709, 37, 'C3', 9),
(710, 37, 'C4', 9),
(711, 37, 'L1', 5.5),
(712, 37, 'L2', 6),
(713, 37, 'L3', 6.5),
(714, 37, 'L4', 7),
(715, 37, 'L5', 7.5),
(716, 37, 'L6', 8),
(717, 37, 'L7', 8.5),
(718, 37, 'L8', 9),
(719, 37, 'L9', 9),
(720, 37, 'R1', 5.5),
(721, 37, 'R2', 6),
(722, 37, 'R3', 6.5),
(723, 37, 'R4', 7),
(724, 37, 'R5', 7.5),
(725, 37, 'R6', 8),
(726, 37, 'R7', 8.5),
(761, 39, 'TOP', 10),
(762, 39, 'C1', 10),
(763, 39, 'C2', 10),
(764, 39, 'C3', 10),
(765, 39, 'C4', 10),
(766, 39, 'L1', 6),
(767, 39, 'L2', 6),
(768, 39, 'L3', 6.5),
(769, 39, 'L4', 7),
(770, 39, 'L5', 7.5),
(771, 39, 'L6', 8),
(772, 39, 'L7', 8.5),
(773, 39, 'L8', 9),
(774, 39, 'L9', 9.5),
(775, 39, 'R1', 5.5),
(776, 39, 'R2', 6),
(777, 39, 'R3', 6.5),
(778, 39, 'R4', 7),
(779, 39, 'R5', 7.5),
(780, 39, 'R6', 8),
(781, 39, 'R7', 9),
(782, 40, 'TOP', 9),
(783, 40, 'C1', 9.5),
(784, 40, 'C2', 9),
(785, 40, 'C3', 9),
(786, 40, 'C4', 9),
(787, 40, 'L1', 6),
(788, 40, 'L2', 6),
(789, 40, 'L3', 6),
(790, 40, 'L4', 6),
(791, 40, 'L5', 6.5),
(792, 40, 'L6', 7),
(793, 40, 'L7', 7.5),
(794, 40, 'L8', 8),
(795, 40, 'L9', 8.5),
(796, 40, 'R1', 5.5),
(797, 40, 'R2', 6),
(798, 40, 'R3', 6.5),
(799, 40, 'R4', 7),
(800, 40, 'R5', 7.5),
(801, 40, 'R6', 8),
(802, 40, 'R7', 8.5),
(803, 41, 'TOP', 10),
(804, 41, 'C1', 10),
(805, 41, 'C2', 10),
(806, 41, 'C3', 10),
(807, 41, 'C4', 10),
(808, 41, 'L1', 5.5),
(809, 41, 'L2', 6),
(810, 41, 'L3', 6.5),
(811, 41, 'L4', 7),
(812, 41, 'L5', 7.5),
(813, 41, 'L6', 8),
(814, 41, 'L7', 9),
(815, 41, 'R1', 5.5),
(816, 41, 'R2', 6),
(817, 41, 'R3', 6.5),
(818, 41, 'R4', 7),
(819, 41, 'R5', 8),
(820, 41, 'R6', 9),
(821, 42, 'TOP', 9),
(822, 42, 'C1', 10),
(823, 42, 'C2', 10),
(824, 42, 'C3', 10),
(825, 42, 'L1', 5.5),
(826, 42, 'L2', 6),
(827, 42, 'L3', 6.5),
(828, 42, 'L4', 7),
(829, 42, 'L5', 7.5),
(830, 42, 'L6', 8),
(831, 42, 'L7', 8.5),
(832, 42, 'R1', 6),
(833, 42, 'R2', 6.5),
(834, 42, 'R3', 7),
(835, 42, 'R4', 7.5),
(836, 42, 'R5', 8),
(837, 43, 'TOP', 8),
(838, 43, 'C1', 11),
(839, 43, 'C2', 11),
(840, 43, 'L1', 5.5),
(841, 43, 'L2', 6),
(842, 43, 'L3', 6),
(843, 43, 'L4', 6.5),
(844, 43, 'L5', 7),
(845, 43, 'L6', 7.5),
(846, 43, 'R1', 5.5),
(847, 43, 'R2', 6),
(848, 43, 'R3', 6),
(849, 43, 'R4', 6.5),
(850, 43, 'R5', 7),
(851, 43, 'R6', 7.5),
(852, 44, 'TOP', 7),
(853, 44, 'C1', 7),
(854, 44, 'L1', 5.5),
(855, 44, 'L2', 6),
(856, 44, 'L3', 6.5),
(857, 44, 'L4', 7),
(858, 44, 'L5', 7),
(859, 44, 'L6', 7),
(860, 44, 'R1', 5.5),
(861, 44, 'R2', 6),
(862, 44, 'R3', 6.5),
(863, 44, 'R4', 7),
(864, 45, 'TOP', 10),
(865, 45, 'C1', 10),
(866, 45, 'C2', 10),
(867, 45, 'C3', 10),
(868, 45, 'C4', 10),
(869, 45, 'L1', 5.5),
(870, 45, 'L2', 6),
(871, 45, 'L3', 6.5),
(872, 45, 'L4', 7),
(873, 45, 'L5', 7.5),
(874, 45, 'L6', 8),
(875, 45, 'L7', 9),
(876, 45, 'R1', 5.5),
(877, 45, 'R2', 6),
(878, 45, 'R3', 6.5),
(879, 45, 'R4', 7),
(880, 45, 'R5', 8),
(881, 45, 'R6', 9),
(882, 46, 'TOP', 10),
(883, 46, 'C1', 8),
(884, 46, 'C2', 8),
(885, 46, 'L1', 5),
(886, 46, 'L2', 7),
(887, 46, 'L3', 8.5),
(888, 46, 'L4', 7),
(889, 46, 'L5', 8.5),
(890, 46, 'L6', 9),
(891, 46, 'R1', 5),
(892, 46, 'R2', 6.5),
(893, 46, 'R3', 8),
(894, 46, 'R4', 6.5),
(895, 46, 'R5', 5.5),
(896, 46, 'R6', 7),
(897, 46, 'R7', 9.5)
as new_wings_babies
ON DUPLICATE KEY UPDATE
`parent_wing_id`=new_wings_babies.`parent_wing_id`, `position`=new_wings_babies.`position`, `length`=new_wings_babies.`length`;", 'SELECT \'Table wings_babies does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CUSTOMER_HATS
# ---------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_hats');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_hats` (`id`, `hat_material_id`, `crown_material_id`, `tails_material_id`, `wing_id`, `original_wing_name`, `customer_id`, `shorten_top_by`, `shorten_crown_by`, `wall_allocation_id`, `crown_allocation_id`, `tails_allocation_id`, `tails_overdraft`, `mayler_width`, `hr_hl_width`, `crown_visible`, `crown_length`, `order_date`) 
VALUES
(1, 16, 16, 24, 40, 'DM 159', 10, 1, 0.5, 18, 18, 34, 220, 0.17, 0, 6, 9.5, null),
(2, 15, 15, 24, 41, 'RT100', 13, 0, 0, 17, 17, 36, 0, 0.17, 0, 6.5, 10, null),
(3, 15, 15, 24, 42, 'RT90', 13, 0, 0, 17, 17, 36, 118, 0.17, 0, 6.5, 10, null),
(4, 23, 23, 28, 43, 'RT85', 12, 0.5, 0, 45, 45, 46, 176, 0.17, 0, 7.5, 11, null),
(5, 23, 23, 27, 44, 'RT70', 12, 0, 0, 45, 45, 44, 94, 0.17, 0, 3.5, 7, null),
(6, 16, 21, 26, 45, 'RT100', 10, 0, 0, 18, 28, 39, 44, 0.17, 0, 6.5, 10, null),
(7, 20, 20, 26, 46, 'RT65', 10, 0, 0, 13, 13, 40, 308, 0.17, 0, 4.5, 8, null)
as new_customer_hats
ON DUPLICATE KEY UPDATE
`hat_material_id`=new_customer_hats.`hat_material_id`, `crown_material_id`=new_customer_hats.`crown_material_id`, `tails_material_id`=new_customer_hats.`tails_material_id`, `wing_id`=new_customer_hats.`wing_id`, `original_wing_name`=new_customer_hats.`original_wing_name`, `customer_id`=new_customer_hats.`customer_id`, `shorten_top_by`=new_customer_hats.`shorten_top_by`, `shorten_crown_by`=new_customer_hats.`shorten_crown_by`, `wall_allocation_id`=new_customer_hats.`wall_allocation_id`, `crown_allocation_id`=new_customer_hats.`crown_allocation_id`, `tails_allocation_id`=new_customer_hats.`tails_allocation_id`, `tails_overdraft`=new_customer_hats.`tails_overdraft`, `mayler_width`=new_customer_hats.`mayler_width`, `hr_hl_width`=new_customer_hats.`hr_hl_width`, `crown_visible`=new_customer_hats.`crown_visible`, `crown_length`=new_customer_hats.`crown_length`, `order_date`=new_customer_hats.`order_date`;", 'SELECT \'Table customer_hats does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;



# Table hats_wings does not exist in the database!

# ORDERS
# --------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'orders');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `orders` (`id`, `customer_hat_id`, `customer_order_seq_number`, `wing_quantity`, `num_of_hats`, `kippa_size`, `ordering_customer_name`, `tails_overdraft`, `isurgent`, `white_hair`, `white_hair_notes`, `order_notes`) 
VALUES
(1, 1, 1, 44, 1, 55, 'a', 44, 0, 0, '', ''),
(2, 1, 2, 44, 1, 57, 'b', 44, 0, 0, '', ''),
(3, 1, 3, 44, 1, 56.5, 'c', 44, 0, 0, '', ''),
(4, 1, 4, 44, 1, 56, 'd', 44, 0, 0, '', ''),
(5, 1, 5, 44, 1, 55, 'e', 44, 0, 0, '', ''),
(6, 2, 1, 42, 1, 55, 'NY', 0, 0, 0, '', ''),
(7, 2, 2, 46, 1, 55, 'NY', 0, 0, 0, '', ''),
(8, 2, 3, 40, 1, 55.5, 'NY', 0, 0, 0, '', ''),
(9, 2, 4, 40, 1, 56, 'NY', 0, 0, 0, '', ''),
(10, 2, 5, 42, 1, 55, 'NY', 0, 0, 0, '', ''),
(11, 2, 6, 44, 1, 58, 'NY', 0, 0, 0, '', ''),
(12, 2, 7, 44, 1, 57, 'NY', 0, 0, 0, '', ''),
(13, 2, 8, 44, 1, 55, 'NY', 0, 0, 0, '', ''),
(14, 3, 9, 46, 1, 55, 'f', 32, 1, 0, '', ''),
(15, 3, 10, 42, 1, 56.5, 'd', 42, 1, 0, '', ''),
(16, 3, 11, 44, 1, 57, 'v', 44, 1, 0, '', ''),
(17, 4, 1, 44, 1, 55, 'x', 44, 1, 0, '', ''),
(18, 4, 2, 44, 1, 55, 'y', 44, 1, 0, '', ''),
(19, 4, 3, 44, 1, 55, 'z', 44, 1, 0, '', ''),
(20, 4, 4, 44, 1, 55, 'b', 44, 1, 0, '', ''),
(21, 5, 5, 48, 1, 55, 'L1', 48, 0, 0, '', ''),
(22, 5, 6, 46, 1, 55, 'L2', 46, 0, 0, '', ''),
(23, 6, 6, 44, 1, 55, 'LA', 44, 0, 0, '', ''),
(24, 7, 7, 44, 1, 55, '', 44, 0, 0, '', ''),
(25, 7, 8, 44, 1, 55, '', 44, 0, 0, '', ''),
(26, 7, 9, 44, 1, 55, '', 44, 0, 0, '', ''),
(27, 7, 10, 44, 1, 55, '', 44, 0, 0, '', ''),
(28, 7, 11, 44, 1, 55, '', 44, 0, 0, '', ''),
(29, 7, 12, 44, 1, 55, '', 44, 0, 0, '', ''),
(30, 7, 13, 44, 1, 55, '', 44, 0, 0, '', '')
as new_orders
ON DUPLICATE KEY UPDATE
`customer_hat_id`=new_orders.`customer_hat_id`, `customer_order_seq_number`=new_orders.`customer_order_seq_number`, `wing_quantity`=new_orders.`wing_quantity`, `num_of_hats`=new_orders.`num_of_hats`, `kippa_size`=new_orders.`kippa_size`, `ordering_customer_name`=new_orders.`ordering_customer_name`, `tails_overdraft`=new_orders.`tails_overdraft`, `isurgent`=new_orders.`isurgent`, `white_hair`=new_orders.`white_hair`, `white_hair_notes`=new_orders.`white_hair_notes`, `order_notes`=new_orders.`order_notes`;", 'SELECT \'Table orders does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ORDERS_STATUS
# ---------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'orders_status');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `orders_status` (`id`, `order_id`, `date`, `order_status`) 
VALUES
(1, 1, '2025-07-22 14:40:21', 'new'),
(2, 2, '2025-07-22 14:40:21', 'new'),
(3, 3, '2025-07-22 14:40:21', 'new'),
(4, 4, '2025-07-22 14:40:21', 'new'),
(5, 5, '2025-07-22 14:40:21', 'new'),
(6, 6, '2025-07-22 14:57:51', 'new'),
(7, 7, '2025-07-22 14:57:51', 'new'),
(8, 8, '2025-07-22 14:57:51', 'new'),
(9, 9, '2025-07-22 14:57:51', 'new'),
(10, 10, '2025-07-22 14:57:51', 'new'),
(11, 11, '2025-07-22 14:57:51', 'new'),
(12, 12, '2025-07-22 14:57:51', 'new'),
(13, 13, '2025-07-22 14:57:51', 'new'),
(14, 14, '2025-07-22 21:54:08', 'new'),
(15, 15, '2025-07-22 21:54:08', 'new'),
(16, 16, '2025-07-22 21:54:08', 'new'),
(17, 17, '2025-07-22 22:15:50', 'new'),
(18, 18, '2025-07-22 22:15:50', 'new'),
(19, 19, '2025-07-22 22:15:50', 'new'),
(20, 20, '2025-07-22 22:15:50', 'new'),
(21, 21, '2025-07-23 19:57:11', 'new'),
(22, 22, '2025-07-23 19:57:11', 'new'),
(23, 23, '2025-07-23 20:25:43', 'new'),
(24, 24, '2025-07-24 10:04:33', 'new'),
(25, 25, '2025-07-24 10:04:33', 'new'),
(26, 26, '2025-07-24 10:04:33', 'new'),
(27, 27, '2025-07-24 10:04:33', 'new'),
(28, 28, '2025-07-24 10:04:33', 'new'),
(29, 29, '2025-07-24 10:04:33', 'new'),
(30, 30, '2025-07-24 10:04:33', 'new')
as new_orders_status
ON DUPLICATE KEY UPDATE
`order_id`=new_orders_status.`order_id`, `date`=new_orders_status.`date`, `order_status`=new_orders_status.`order_status`;", 'SELECT \'Table orders_status does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# SETTINGS
# ----------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'settings');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `settings` (`key`, `value`, `default_value`, `value_type`) 
VALUES
('alert_customer_bank_kg', '1', '1', 'boolean'),
('alert_customer_bank_kg_below', '10', '10', 'number'),
('alert_customer_bank_percents', '1', '1', 'boolean'),
('alert_customer_bank_percents_below', '10', '10', 'number'),
('alert_customer_bank_units', '1', '1', 'boolean'),
('alert_customer_bank_units_below', '10', '10', 'number'),
('alert_raw_material_item_kg', '1', '1', 'boolean'),
('alert_raw_material_item_kg_below', '10', '10', 'number'),
('alert_raw_material_item_percents', '1', '1', 'boolean'),
('alert_raw_material_item_percents_below', '10', '10', 'number'),
('alert_raw_material_item_units', '1', '1', 'boolean'),
('alert_raw_material_item_units_below', '10', '10', 'number'),
('alert_raw_material_total_kg', '1', '1', 'boolean'),
('alert_raw_material_total_kg_below', '10', '10', 'number'),
('alert_raw_material_total_units', '1', '1', 'boolean'),
('alert_raw_material_total_units_below', '20', '20', 'number'),
('mark_red_customer_bank_percents', '1', '1', 'boolean'),
('mark_red_customer_bank_percents_below', '10', '10', 'number'),
('mark_red_raw_material_item_percents', '1', '1', 'boolean'),
('mark_red_raw_material_item_percents_below', '10', '10', 'number'),
('mark_yellow_customer_bank_percents', '1', '1', 'boolean'),
('mark_yellow_customer_bank_percents_below', '30', '30', 'number'),
('mark_yellow_raw_material_item_percents', '1', '1', 'boolean'),
('mark_yellow_raw_material_item_percents_below', '30', '30', 'number'),
('ui_settings_grid_page_size', '20', '20', 'number'),
('ui_settings_grid_paging', '1', '1', 'boolean')
as new_settings
ON DUPLICATE KEY UPDATE
`key`=new_settings.`key`, `value`=new_settings.`value`, `default_value`=new_settings.`default_value`, `value_type`=new_settings.`value_type`;", 'SELECT \'Table settings does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

