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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customers` (`id`, `name`, `business_name`, `email`, `phone`, `tax_id`, `customer_code`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`) 
VALUES
(9, 'Alon Rotem', 'Romtech', 'alon@mail.com', '+359 (88) 401-3532', 'Tax payer 1234', 'L', null, '2025-01-06 20:05:29', '2025-07-02 11:21:03', 1, 1),
(10, 'Avi Bar', 'Romtech', 'avi_bar@mail.com', '+359 87 985 8868', 'Tax payer 5678', 'AB', null, '2025-01-06 20:05:29', '2025-06-29 20:25:42', 1, 1),
(11, 'Guy Tal', 'Guytech', 'guy@mail.com', '+359 87 123 4567', 'Tax payer 90123', null, null, '2025-01-06 20:05:29', '2025-06-27 12:52:29', 1, 1),
(12, 'London', 'London Inc', '', '', '456456', 'L', null, '2025-02-24 22:19:45', '2025-06-27 12:52:32', 0, 0),
(13, 'NY', 'NY', 'ny@gmail.con', '878782858', '234578', 'USA', null, '2025-02-25 20:10:16', '2025-06-30 08:31:27', 0, 0)
as new_customers
ON DUPLICATE KEY UPDATE
`name`=new_customers.`name`, `business_name`=new_customers.`business_name`, `email`=new_customers.`email`, `phone`=new_customers.`phone`, `tax_id`=new_customers.`tax_id`, `customer_code`=new_customers.`customer_code`, `notes`=new_customers.`notes`, `created_at`=new_customers.`created_at`, `updated_at`=new_customers.`updated_at`, `created_by`=new_customers.`created_by`, `updated_by`=new_customers.`updated_by`;", 'SELECT \'Table customers does not exist\'');
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `raw_materials` (`id`, `name`, `purchased_at`, `purchase_quantity`, `remaining_quantity`, `quantity_units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`, `color`, `created_at`, `updated_at`, `created_by`, `updated_by`) 
VALUES
(13, 'Sable', '2024-06-08 00:00:00', 210, 0, 'units', 30, 'JJ', 'US', 30, 'USD', 'This is a test material', 'Dark brown', '2025-01-06 20:05:29', '2025-02-16 21:07:25', 1, 1),
(15, 'SM', '2024-06-08 00:00:00', 1000, 600, 'units', 112, 'KK', 'RU', 3, 'USD', 'This is a test material', 'Dark brown', '2025-01-06 20:05:29', '2025-02-25 20:11:19', 1, 1),
(16, 'BM', '2024-06-08 00:00:00', 750, 550, 'units', 135, null, 'US', 60, 'EUR', 'This is a test material', 'Light brown', '2025-01-06 20:05:29', '2025-05-27 21:20:24', 1, 1),
(17, 'Canady', '2024-06-08 00:00:00', 7, 3, 'kg', 10, 'XY', 'US', 10, 'USD', 'This is a test material', 'Light brown', '2025-01-06 20:05:29', '2025-06-01 22:33:15', 1, 1),
(18, 'Demo material 1', '2025-01-07 00:00:00', 100, 30, 'kg', 11, 'JJ', 'US', 300, 'USD', 'Demo material for calculations', 'Natural', '2025-01-07 15:18:39', '2025-01-07 15:20:15', 0, 0),
(19, 'DМ light', '2025-01-07 00:00:00', 750, 600, 'units', 2, 'KK', 'US', 25, 'USD', 'Demo material for calculations', 'Natural', '2025-01-07 15:19:09', '2025-06-01 09:25:50', 0, 0),
(20, 'DM', '2025-02-08 00:00:00', 100, 5, 'units', 80, 'dd', 'US', 20, 'USD', '', 'Black', '2025-02-08 21:20:42', '2025-05-29 09:03:13', 0, 0),
(21, 'DM Medium brown', '2025-06-05 00:00:00', 500, 400, 'units', 4, '', 'US', 25, 'USD', '', 'Dark brown', '2025-06-05 08:38:20', '2025-06-05 08:38:20', 0, 0),
(22, 'DM', '2025-06-05 00:00:00', 1000, 600, 'units', 110, '', 'US', 14, 'USD', '', 'Dark brown', '2025-06-05 10:39:38', '2025-06-06 13:00:29', 0, 0),
(23, 'BM', '2025-06-05 00:00:00', 1000, 700, 'units', 0, '', 'RU', 18, 'USD', '', 'Natural', '2025-06-05 11:59:21', '2025-06-05 12:00:03', 0, 0),
(24, 'Sable H', '2025-06-06 00:00:00', 2350, 110, 'units', 235, '', 'US', 7, 'USD', '', 'Mixed color', '2025-06-06 12:52:24', '2025-07-06 14:08:34', 0, 0),
(25, 'DM ', '2025-07-01 00:00:00', 500, 500, 'units', 0, 'London', 'US', 1.5, 'USD', 'return from dyeing on July 1st dyeing cost 2$', 'Dark brown', '2025-07-01 17:55:24', '2025-07-01 17:55:24', 0, 0)
as new_raw_materials
ON DUPLICATE KEY UPDATE
`name`=new_raw_materials.`name`, `purchased_at`=new_raw_materials.`purchased_at`, `purchase_quantity`=new_raw_materials.`purchase_quantity`, `remaining_quantity`=new_raw_materials.`remaining_quantity`, `quantity_units`=new_raw_materials.`quantity_units`, `units_per_kg`=new_raw_materials.`units_per_kg`, `vendor_name`=new_raw_materials.`vendor_name`, `origin_country`=new_raw_materials.`origin_country`, `price`=new_raw_materials.`price`, `currency`=new_raw_materials.`currency`, `notes`=new_raw_materials.`notes`, `color`=new_raw_materials.`color`, `created_at`=new_raw_materials.`created_at`, `updated_at`=new_raw_materials.`updated_at`, `created_by`=new_raw_materials.`created_by`, `updated_by`=new_raw_materials.`updated_by`;", 'SELECT \'Table raw_materials does not exist\'');
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
(18, 9, 18, 25, 1),
(19, 10, 18, 45, 45),
(20, 10, 20, 15, 5),
(21, 12, 20, 80, 59),
(22, 13, 15, 400, 292),
(23, 10, 16, 200, 3),
(24, 10, 16, 200, 200),
(25, 12, 19, 150, 50),
(26, 12, 19, 150, 150),
(28, 9, 17, 4, 0),
(29, 10, 21, 100, 90),
(30, 11, 22, 200, 100),
(31, 12, 23, 300, 300),
(32, 13, 24, 1240, 840),
(33, 13, 22, 200, 100),
(34, 10, 24, 1000, 240)
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
(7, 18, 10, 0, 'babies', 0, 0),
(9, 18, 10, 0, 'babies', 0, 0),
(10, 18, 4, 0, 'babies', 0, 0),
(11, 15, 10, 0, 'babies', 0, 0),
(12, 15, 10, 0, 'babies', 0, 0),
(13, 20, 10, 0, 'babies', 0, 0),
(14, 16, 100, 0, 'babies', 0, 0),
(15, 21, 10, 0, 'babies', 0, 0),
(16, 21, 11, 0, 'babies', 0, 0),
(17, 22, 100, 0, 'babies', 0, 0),
(18, 23, 172, 0, 'babies', 0, 0),
(22, 23, 5, 0, 'babies', 0, 0),
(23, 25, 100, 0, 'babies', 0, 0),
(25, 28, 3, 0, 'babies', 0, 0),
(26, 28, 1, 0, 'tails', 10000, 0),
(27, 23, 20, 0, 'tails', 0, 0),
(28, 29, 10, 0, 'babies', 0, 0),
(29, 30, 100, 0, 'babies', 0, 0),
(32, 22, 8, 0, 'babies', 0, 0),
(33, 33, 100, 0, 'babies', 0, 0),
(34, 34, 360, 0, 'tails', 32, 132),
(35, 34, 400, 0, 'tails', 222, 178),
(36, 32, 400, 0, 'tails', 356, 44)
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
(15, 9, 11, 100, 0),
(16, 9, 10, 100, 0),
(17, 9, 9, 110, 0),
(18, 9, 8.5, 95, 0),
(19, 9, 8, 90, 0),
(20, 9, 7, 85, 0),
(21, 9, 6.5, 80, 0),
(22, 9, 5, 100, 0),
(29, 9, 12, 1600, 0),
(38, 9, 6, 15, 0),
(39, 9, 5.5, 15, 0),
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
(53, 7, 12, 100, 0),
(54, 7, 10, 4600, 0),
(55, 7, 9.5, 200, 0),
(56, 7, 9, 100, 0),
(57, 7, 8, 100, 0),
(58, 7, 7.5, 50, 0),
(59, 7, 7, 150, 0),
(60, 7, 6, 100, 0),
(61, 7, 5.5, 100, 0),
(62, 11, 7, 10, 0),
(63, 11, 6.5, 10, 0),
(64, 11, 6, 510, 0),
(65, 11, 5.5, 10, 0),
(66, 13, 7, 3480, 520),
(67, 13, 6.5, 1480, 520),
(68, 13, 6, 1480, 520),
(69, 13, 5.5, 1637, 363),
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
(82, 13, 10, 3732, 648),
(83, 13, 8.5, 2211, 333),
(84, 13, 8, 509, 491),
(89, 13, 11, 880, 0),
(90, 15, 8, 1000, 0),
(91, 15, 7.5, 2200, 0),
(92, 15, 7, 1000, 0),
(93, 15, 6.5, 1000, 0),
(94, 15, 6, 1000, 0),
(95, 15, 5.5, 1000, 0),
(96, 16, 7.5, 1000, 0),
(97, 17, 9, 1956, 44),
(98, 17, 8.5, 4856, 44),
(99, 17, 8, 1936, 88),
(100, 17, 7.5, 1912, 88),
(101, 17, 7, 7412, 88),
(102, 17, 6.5, 5912, 88),
(103, 17, 6, 6912, 88),
(104, 17, 5.5, 3912, 88),
(105, 17, 10, 4956, 44),
(137, 10, 12, 2500, 0),
(138, 10, 11.5, 2500, 0),
(139, 10, 11, 3000, 0),
(140, 10, 10.5, 3000, 0),
(141, 10, 10, 4000, 0),
(142, 10, 9.5, 4000, 0),
(143, 10, 9, 3600, 0),
(144, 10, 8.5, 3500, 0),
(145, 10, 8, 3000, 0),
(146, 10, 7.5, 3000, 0),
(147, 10, 7, 3000, 0),
(148, 10, 6.5, 3000, 0),
(149, 10, 6, 2000, 0),
(150, 10, 5.5, 2000, 0),
(151, 10, 5, 2000, 0),
(152, 18, 10, 3380, 220),
(153, 18, 9.5, 3500, 0),
(154, 18, 9, 4612, 88),
(155, 18, 8.5, 5300, 0),
(156, 18, 8, 4612, 88),
(157, 18, 7.5, 2956, 44),
(158, 18, 7, 3912, 88),
(159, 18, 6.5, 3912, 88),
(160, 18, 6, 20915, 88),
(161, 18, 5.5, 3912, 88),
(162, 18, 5, 3000, 0),
(204, 13, 9.5, 2898, 102),
(205, 13, 9, 1825, 175),
(206, 13, 7.5, 1480, 520),
(207, 13, 5, 2858, 642),
(229, 13, 11.5, 2000, 0),
(230, 13, 10.5, 1912, 88),
(243, 11, 9, 1000, 0),
(248, 23, 11, 700, 0),
(249, 23, 10.5, 1300, 0),
(250, 23, 10, 1200, 0),
(251, 23, 9.5, 900, 0),
(252, 23, 9, 850, 0),
(253, 23, 8.5, 1200, 0),
(254, 23, 8, 1000, 0),
(255, 23, 7.5, 1000, 0),
(256, 23, 7, 800, 0),
(257, 23, 6.5, 1450, 0),
(258, 23, 6, 1300, 0),
(259, 23, 5.5, 1200, 0),
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
(281, 28, 10, 2480, 220),
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
(324, 25, 8.5, 1320, 0)
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
(16, '2025-01-07 15:18:39', 1, 100, 'raw_material_purchase', 18, 0, 0, 0, 100, -1, -1),
(17, '2025-01-07 15:19:09', 1, 250, 'raw_material_purchase', 19, 0, 0, 0, 250, -1, -1),
(18, '2025-01-07 15:20:16', 1, 25, 'to_customer_bank', 18, 9, 18, 0, 75, 25, -1),
(19, '2025-01-07 15:20:17', 1, 45, 'to_customer_bank', 18, 10, 19, 0, 30, 45, -1),
(20, '2025-01-07 16:11:52', 1, 5, 'customer_bank_allocate_to_Work', 18, 9, 18, 6, -1, 10, 0),
(21, '2025-01-07 16:15:57', 1, 15, 'customer_bank_allocation_deleted', 18, 9, 18, 6, 0, 25, 0),
(22, '2025-01-07 16:16:17', 1, 10, 'customer_bank_allocate_to_Work', 18, 9, 18, 7, -1, 15, 0),
(23, '2025-01-19 20:01:24', 1, 10, 'customer_bank_allocate_to_Work', 18, 9, 18, 8, -1, 5, 0),
(25, '2025-01-27 12:51:31', 1, 10, 'customer_bank_allocation_deleted', 18, 9, 18, 8, 0, 15, 0),
(26, '2025-01-27 12:52:43', 1, 10, 'customer_bank_allocate_to_Work', 18, 9, 18, 9, -1, 5, 0),
(27, '2025-01-29 20:46:49', 1, 4, 'customer_bank_allocate_to_Work', 18, 9, 18, 10, -1, 1, 0),
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
(85, '2025-07-06 14:08:34', 1, -110, 'to_customer_bank', 24, 10, 34, 0, 110, 240, -1)
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `wings` (`id`, `name`, `knife`, `customer_id`) 
VALUES
(1, 'RT65', 6.5, null),
(2, 'RT70', 10, null),
(3, 'RT85', 10, null),
(5, 'תותח על', 10, null),
(7, 'RT100', 12, null),
(16, 'RT110', 12, null),
(17, 'RT90', 12.5, null),
(26, 'RT120', 12.5, null),
(27, 'RT10020250529231135', 12, null),
(28, 'RT9020250529232648', 12.5, null),
(29, 'RT902025052923264820250529233014', 12.5, null),
(30, 'RT8520250530112951', 10, null),
(31, 'RT100 1217 T', 12.5, null),
(32, 'RT8520250602143430', 10, null),
(33, 'RT100 1217 T20250603223415', 12.5, null),
(34, 'RT100 1217 T20250605184924', 12.5, null),
(35, 'RT1217 BM', 12.5, null),
(36, 'RT10020250606170845', 12, null)
as new_wings
ON DUPLICATE KEY UPDATE
`name`=new_wings.`name`, `knife`=new_wings.`knife`, `customer_id`=new_wings.`customer_id`;", 'SELECT \'Table wings does not exist\'');
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
(409, 27, 'C1', 10),
(410, 27, 'C2', 10),
(411, 27, 'C3', 10),
(412, 27, 'C4', 10),
(413, 27, 'L1', 5.5),
(414, 27, 'L2', 6),
(415, 27, 'L3', 6.5),
(416, 27, 'L4', 7),
(417, 27, 'L5', 7.5),
(418, 27, 'L6', 8),
(419, 27, 'L7', 9),
(420, 27, 'R1', 5.5),
(421, 27, 'R2', 6),
(422, 27, 'R3', 6.5),
(423, 27, 'R4', 7),
(424, 27, 'R5', 8),
(425, 27, 'R6', 9),
(426, 27, 'TOP', 10),
(427, 28, 'C1', 10),
(428, 28, 'C2', 10),
(429, 28, 'C3', 10),
(430, 28, 'L1', 5),
(431, 28, 'L2', 5.5),
(432, 28, 'L3', 6),
(433, 28, 'L4', 6.5),
(434, 28, 'L5', 7),
(435, 28, 'L6', 7.5),
(436, 28, 'L7', 8),
(437, 28, 'R1', 6),
(438, 28, 'R2', 6.5),
(439, 28, 'R3', 7),
(440, 28, 'R4', 7.5),
(441, 28, 'R5', 8),
(442, 28, 'TOP', 8.5),
(443, 29, 'C1', 10),
(444, 29, 'C2', 10),
(445, 29, 'C3', 10),
(446, 29, 'L1', 5),
(447, 29, 'L2', 5.5),
(448, 29, 'L3', 6),
(449, 29, 'L4', 6.5),
(450, 29, 'L5', 7),
(451, 29, 'L6', 7.5),
(452, 29, 'L7', 8),
(453, 29, 'R1', 6),
(454, 29, 'R2', 6.5),
(455, 29, 'R3', 7),
(456, 29, 'R4', 7.5),
(457, 29, 'R5', 8),
(458, 29, 'TOP', 8.5),
(459, 30, 'C1', 10),
(460, 30, 'C2', 9),
(461, 30, 'L1', 5.5),
(462, 30, 'L2', 6),
(463, 30, 'L3', 6.5),
(464, 30, 'L4', 7),
(465, 30, 'L5', 7.5),
(466, 30, 'L6', 8),
(467, 30, 'R1', 5.5),
(468, 30, 'R2', 6),
(469, 30, 'R3', 6.5),
(470, 30, 'R4', 7),
(471, 30, 'R5', 7.5),
(472, 30, 'R6', 8),
(473, 30, 'TOP', 8.5),
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
(589, 32, 'TOP', 8.5),
(590, 32, 'C1', 10.5),
(591, 32, 'C2', 10),
(592, 32, 'L1', 5.5),
(593, 32, 'L2', 6),
(594, 32, 'L3', 6.5),
(595, 32, 'L4', 7),
(596, 32, 'L5', 7.5),
(597, 32, 'L6', 8),
(598, 32, 'R1', 5.5),
(599, 32, 'R2', 6),
(600, 32, 'R3', 6.5),
(601, 32, 'R4', 7),
(602, 32, 'R5', 7.5),
(603, 32, 'R6', 8),
(604, 33, 'TOP', 10),
(605, 33, 'C1', 10),
(606, 33, 'C2', 10),
(607, 33, 'C3', 10),
(608, 33, 'C4', 10),
(609, 33, 'L1', 6),
(610, 33, 'L2', 6),
(611, 33, 'L3', 6.5),
(612, 33, 'L4', 6.5),
(613, 33, 'L5', 7),
(614, 33, 'L6', 7),
(615, 33, 'L7', 7.5),
(616, 33, 'L8', 7.5),
(617, 33, 'L9', 8),
(618, 33, 'L10', 8),
(619, 33, 'L11', 8.5),
(620, 33, 'L12', 8.5),
(621, 33, 'L13', 9),
(622, 33, 'L14', 9),
(623, 33, 'L15', 9.5),
(624, 33, 'L16', 10),
(625, 33, 'R1', 5.5),
(626, 33, 'R2', 6),
(627, 33, 'R3', 6),
(628, 33, 'R4', 6.5),
(629, 33, 'R5', 6.5),
(630, 33, 'R6', 7),
(631, 33, 'R7', 7),
(632, 33, 'R8', 7.5),
(633, 33, 'R9', 7.5),
(634, 33, 'R10', 8),
(635, 33, 'R11', 8.5),
(636, 33, 'R12', 9),
(637, 33, 'R13', 9.5),
(638, 34, 'TOP', 9.5),
(639, 34, 'C1', 10),
(640, 34, 'C2', 10),
(641, 34, 'C3', 10),
(642, 34, 'C4', 10),
(643, 34, 'L1', 5),
(644, 34, 'L2', 5),
(645, 34, 'L3', 5),
(646, 34, 'L4', 5),
(647, 34, 'L5', 5),
(648, 34, 'L6', 5),
(649, 34, 'L7', 5),
(650, 34, 'L8', 5),
(651, 34, 'L9', 5.5),
(652, 34, 'L10', 6),
(653, 34, 'L11', 6.5),
(654, 34, 'L12', 7),
(655, 34, 'L13', 7.5),
(656, 34, 'L14', 8),
(657, 34, 'L15', 8.5),
(658, 34, 'L16', 9),
(659, 34, 'R1', 5),
(660, 34, 'R2', 5),
(661, 34, 'R3', 5),
(662, 34, 'R4', 5),
(663, 34, 'R5', 5),
(664, 34, 'R6', 5.5),
(665, 34, 'R7', 6),
(666, 34, 'R8', 6.5),
(667, 34, 'R9', 7),
(668, 34, 'R10', 7.5),
(669, 34, 'R11', 8),
(670, 34, 'R12', 8.5),
(671, 34, 'R13', 9),
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
(688, 36, 'TOP', 10),
(689, 36, 'C1', 10),
(690, 36, 'C2', 10),
(691, 36, 'C3', 10),
(692, 36, 'C4', 10),
(693, 36, 'L1', 5.5),
(694, 36, 'L2', 6),
(695, 36, 'L3', 6.5),
(696, 36, 'L4', 7),
(697, 36, 'L5', 7.5),
(698, 36, 'L6', 8),
(699, 36, 'L7', 9),
(700, 36, 'R1', 5.5),
(701, 36, 'R2', 6),
(702, 36, 'R3', 6.5),
(703, 36, 'R4', 7),
(704, 36, 'R5', 8),
(705, 36, 'R6', 9)
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_hats` (`id`, `hat_material_id`, `crown_material_id`, `tails_material_id`, `wing_id`, `original_wing_name`, `wing_quantity`, `adjusted_wings_per_hat`, `customer_id`, `shorten_top_by`, `shorten_crown_by`, `wall_allocation_id`, `crown_allocation_id`, `tails_allocation_id`, `kippa_size`, `mayler_width`, `hr_hl_width`, `crown_visible`, `crown_length`, `white_hair`, `white_hair_notes`, `order_date`, `isurgent`, `order_notes`) 
VALUES
(1, 21, 21, 24, 27, 'RT100', 44, '44', 10, 0, 0, 28, 28, 34, 55, 0.17, 0, 6.5, 10, 0, '', null, 0, ''),
(2, 20, 20, 24, 28, 'RT90', 10, '5,5,10,10', 10, 0.5, 0, 13, 13, 35, 55, 0.17, 0, 6.5, 10, 0, '', null, 0, ''),
(3, 20, 20, 24, 29, 'RT90', 10, '10,10,10', 10, 0.5, 0, 13, 13, 35, 55, 0.17, 0, 6.5, 10, 0, '', null, 0, ''),
(4, 15, 15, 24, 30, 'RT85', 44, '44', 13, 0, 1, 17, 17, 36, 55, 0.17, 0, 6.5, 10, 0, '', null, 0, ''),
(5, 20, 20, 24, 32, 'RT85', 44, '46,42', 10, 0, 0.5, 13, 13, 34, 55, 0.17, 0, 7, 10.5, 0, '', null, 0, ''),
(6, 20, 20, 24, 33, 'RT100 1217 T', 29, '30', 10, 0, 0, 13, 13, 35, 55, 0.17, 0, 6.5, 10, 1, 'place little white hair ', null, 0, ''),
(7, 20, 20, 24, 34, 'RT100 1217 T', 44, '44', 10, 0.5, 0, 13, 13, 35, 55, 0.17, 0, 6.5, 10, 0, '', null, 0, ''),
(8, 16, 16, 24, 36, 'RT100', 44, '44', 10, 0, 0, 18, 18, 35, 55, 0.17, 0, 6.5, 10, 0, '', null, 0, '')
as new_customer_hats
ON DUPLICATE KEY UPDATE
`hat_material_id`=new_customer_hats.`hat_material_id`, `crown_material_id`=new_customer_hats.`crown_material_id`, `tails_material_id`=new_customer_hats.`tails_material_id`, `wing_id`=new_customer_hats.`wing_id`, `original_wing_name`=new_customer_hats.`original_wing_name`, `wing_quantity`=new_customer_hats.`wing_quantity`, `adjusted_wings_per_hat`=new_customer_hats.`adjusted_wings_per_hat`, `customer_id`=new_customer_hats.`customer_id`, `shorten_top_by`=new_customer_hats.`shorten_top_by`, `shorten_crown_by`=new_customer_hats.`shorten_crown_by`, `wall_allocation_id`=new_customer_hats.`wall_allocation_id`, `crown_allocation_id`=new_customer_hats.`crown_allocation_id`, `tails_allocation_id`=new_customer_hats.`tails_allocation_id`, `kippa_size`=new_customer_hats.`kippa_size`, `mayler_width`=new_customer_hats.`mayler_width`, `hr_hl_width`=new_customer_hats.`hr_hl_width`, `crown_visible`=new_customer_hats.`crown_visible`, `crown_length`=new_customer_hats.`crown_length`, `white_hair`=new_customer_hats.`white_hair`, `white_hair_notes`=new_customer_hats.`white_hair_notes`, `order_date`=new_customer_hats.`order_date`, `isurgent`=new_customer_hats.`isurgent`, `order_notes`=new_customer_hats.`order_notes`;", 'SELECT \'Table customer_hats does not exist\'');
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `orders` (`id`, `customer_hat_id`, `num_of_hats`) 
VALUES
(1, 1, 1),
(2, 2, 4),
(3, 3, 3),
(4, 4, 1),
(5, 5, 2),
(6, 6, 1),
(7, 7, 1),
(8, 8, 1)
as new_orders
ON DUPLICATE KEY UPDATE
`customer_hat_id`=new_orders.`customer_hat_id`, `num_of_hats`=new_orders.`num_of_hats`;", 'SELECT \'Table orders does not exist\'');
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
(1, 1, '2025-06-29 20:21:40', 'new'),
(2, 2, '2025-06-29 20:30:14', 'new'),
(3, 3, '2025-06-29 20:32:03', 'new'),
(4, 4, '2025-06-30 08:34:33', 'new'),
(5, 5, '2025-07-02 11:41:03', 'new'),
(6, 6, '2025-07-03 20:18:01', 'new'),
(7, 7, '2025-07-05 17:07:43', 'new'),
(8, 8, '2025-07-06 14:09:51', 'new')
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

