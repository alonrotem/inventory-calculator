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
(9, 'Alon Rotem', 'Romtech', 'alon@mail.com', '+359 (88) 401-3532', 'Tax payer 1234', null, null, '2025-01-06 20:05:29', '2025-06-01 22:34:04', 1, 1),
(10, 'Avi Bar', 'Romtech', 'avi_bar@mail.com', '+359 87 985 8868', 'Tax payer 5678', null, null, '2025-01-06 20:05:29', '2025-06-01 09:20:32', 1, 1),
(11, 'Guy Tal', 'Guytech', 'guy@mail.com', '+359 87 123 4567', 'Tax payer 90123', null, null, '2025-01-06 20:05:29', '2025-02-16 21:16:09', 1, 1),
(12, 'London', 'London Inc', '', '', '456456', 'L', null, '2025-02-24 22:19:45', '2025-06-01 09:29:05', 0, 0),
(13, 'NY', 'NY', 'ny@gmail.con', '878782858', '234578', 'NY', null, '2025-02-25 20:10:16', '2025-02-25 20:16:51', 0, 0)
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `material_colors` (`color`) 
VALUES
('Black'),
('Dark brown'),
('Light brown'),
('Natural')
as new_material_colors
ON DUPLICATE KEY UPDATE
`color`=new_material_colors.`color`;", 'SELECT \'Table material_colors does not exist\'');
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
(20, 'DM', '2025-02-08 00:00:00', 100, 5, 'units', 80, 'dd', 'US', 20, 'USD', '', 'Black', '2025-02-08 21:20:42', '2025-05-29 09:03:13', 0, 0)
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
(22, 13, 15, 400, 300),
(23, 10, 16, 200, 100),
(24, 10, 16, 200, 200),
(25, 12, 19, 150, 50),
(26, 12, 19, 150, 150),
(28, 9, 17, 4, 0)
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_banks_allocations` (`id`, `customer_bank_id`, `quantity`, `remaining_quantity`, `allocation_type`) 
VALUES
(2, 13, 5, 5, 'babies'),
(3, 13, 3, 2, 'babies'),
(7, 18, 10, 0, 'babies'),
(9, 18, 10, 0, 'babies'),
(10, 18, 4, 0, 'babies'),
(11, 15, 10, 0, 'babies'),
(12, 15, 10, 0, 'babies'),
(13, 20, 10, 0, 'babies'),
(14, 16, 100, 0, 'babies'),
(15, 21, 10, 0, 'babies'),
(16, 21, 11, 0, 'babies'),
(17, 22, 100, 0, 'babies'),
(18, 23, 200, 0, 'babies'),
(22, 23, 5, 0, 'babies'),
(23, 25, 100, 0, 'babies'),
(25, 28, 3, 0, 'babies'),
(26, 28, 1, 0, 'tails')
as new_customer_banks_allocations
ON DUPLICATE KEY UPDATE
`customer_bank_id`=new_customer_banks_allocations.`customer_bank_id`, `quantity`=new_customer_banks_allocations.`quantity`, `remaining_quantity`=new_customer_banks_allocations.`remaining_quantity`, `allocation_type`=new_customer_banks_allocations.`allocation_type`;", 'SELECT \'Table customer_banks_allocations does not exist\'');
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
(40, 2, 12, 88, 0),
(41, 2, 11, 1000, 0),
(42, 2, 10.5, 1000, 0),
(43, 2, 10, 1200, 880),
(44, 2, 9.5, 1000, 0),
(45, 2, 9, 648, 352),
(46, 2, 8.5, 824, 176),
(47, 2, 8, 648, 352),
(48, 2, 7.5, 824, 176),
(49, 2, 7, 648, 352),
(50, 2, 6.5, 648, 352),
(51, 2, 6, 648, 352),
(52, 2, 5.5, 848, 352),
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
(66, 13, 7, 4000, 0),
(67, 13, 6.5, 2000, 0),
(68, 13, 6, 2000, 0),
(69, 13, 5.5, 2000, 0),
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
(80, 14, 5.5, 200, 0),
(81, 14, 5, 200, 0),
(82, 13, 10, 4380, 0),
(83, 13, 8.5, 2544, 0),
(84, 13, 8, 1000, 0),
(89, 13, 11, 880, 0),
(90, 15, 8, 1000, 0),
(91, 15, 7.5, 2200, 0),
(92, 15, 7, 1000, 0),
(93, 15, 6.5, 1000, 0),
(94, 15, 6, 1000, 0),
(95, 15, 5.5, 1000, 0),
(96, 16, 7.5, 1000, 0),
(97, 17, 9, 2000, 0),
(98, 17, 8.5, 2000, 0),
(99, 17, 8, 2000, 0),
(100, 17, 7.5, 2000, 0),
(101, 17, 7, 2000, 0),
(102, 17, 6.5, 2000, 0),
(103, 17, 6, 2000, 0),
(104, 17, 5.5, 2000, 0),
(105, 17, 10, 5000, 0),
(106, 17, 9.5, 3000, 0),
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
(152, 18, 10, 696, 2904),
(153, 18, 9.5, 1564, 1936),
(154, 18, 9, 1564, 1936),
(155, 18, 8.5, 5300, 0),
(156, 18, 8, 2764, 1936),
(157, 18, 7.5, 2032, 968),
(158, 18, 7, 2064, 1936),
(159, 18, 6.5, 2064, 1936),
(160, 18, 6, 19067, 1936),
(161, 18, 5.5, 2064, 1936),
(162, 18, 5, 3000, 0),
(204, 13, 9.5, 3000, 0),
(205, 13, 9, 2000, 0),
(206, 13, 7.5, 2000, 0),
(207, 13, 5, 3500, 0),
(229, 13, 11.5, 2000, 0),
(230, 13, 10.5, 2000, 0),
(243, 11, 9, 1000, 0),
(248, 23, 11, 436, 264),
(249, 23, 10.5, 1036, 264),
(250, 23, 10, 144, 1056),
(251, 23, 9.5, 636, 264),
(252, 23, 9, 586, 264),
(253, 23, 8.5, 936, 264),
(254, 23, 8, 736, 264),
(255, 23, 7.5, 736, 264),
(256, 23, 7, 536, 264),
(257, 23, 6.5, 922, 528),
(258, 23, 6, 772, 528),
(259, 23, 5.5, 672, 528),
(260, 25, 10, 220, 0),
(261, 25, 9, 88, 0),
(262, 25, 8, 88, 0),
(263, 25, 7.5, 44, 0),
(264, 25, 7, 88, 0),
(265, 25, 6.5, 88, 0),
(266, 25, 6, 88, 0),
(267, 25, 5.5, 88, 0)
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
(58, '2025-06-01 22:33:42', 1, 1, 'customer_bank_allocate_to_Work', 17, 9, 28, 26, -1, 0, 0)
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
(7, 'RT100', 11, null),
(14, 'RT100 H20250405132634', 11, null),
(15, 'RT10020250428002241', 11, null),
(16, 'RT110', 12, null),
(17, 'RT90', 12.5, null),
(18, 'RT11020250501122909', 12, null)
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
(171, 14, 'C1', 10),
(172, 14, 'C2', 10),
(173, 14, 'C3', 10),
(174, 14, 'C4', 10),
(175, 14, 'L1', 5.5),
(176, 14, 'L2', 6),
(177, 14, 'L3', 6.5),
(178, 14, 'L4', 7),
(179, 14, 'L5', 7.5),
(180, 14, 'L6', 8),
(181, 14, 'L7', 8.5),
(182, 14, 'L8', 9),
(183, 14, 'R1', 5.5),
(184, 14, 'R2', 6),
(185, 14, 'R3', 6.5),
(186, 14, 'R4', 7),
(187, 14, 'R5', 8),
(188, 14, 'R6', 9),
(189, 14, 'TOP', 10),
(204, 15, 'C1', 9.5),
(205, 15, 'C2', 10),
(206, 15, 'C3', 10),
(207, 15, 'C4', 9.5),
(208, 15, 'L1', 5.5),
(209, 15, 'L2', 6),
(210, 15, 'L3', 6.5),
(211, 15, 'L4', 7),
(212, 15, 'L5', 7.5),
(213, 15, 'L6', 8),
(214, 15, 'L7', 9),
(215, 15, 'R1', 5.5),
(216, 15, 'R2', 6),
(217, 15, 'R3', 6.5),
(218, 15, 'R4', 7),
(219, 15, 'R5', 8),
(220, 15, 'R6', 9),
(221, 15, 'TOP', 10),
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
(256, 18, 'C1', 10),
(257, 18, 'C2', 10),
(258, 18, 'C3', 10),
(259, 18, 'L1', 5.5),
(260, 18, 'L2', 6),
(261, 18, 'L3', 6.5),
(262, 18, 'L4', 7),
(263, 18, 'L5', 8),
(264, 18, 'L6', 9),
(265, 18, 'L7', 10),
(266, 18, 'R1', 5.5),
(267, 18, 'R2', 6),
(268, 18, 'R3', 6.5),
(269, 18, 'R4', 7.5),
(270, 18, 'R5', 8.5),
(271, 18, 'R6', 9.5),
(272, 18, 'R7', 10.5),
(273, 18, 'TOP', 11)
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_hats` (`id`, `hat_material_id`, `crown_material_id`, `tails_material_id`, `wing_id`, `wing_quantity`, `customer_id`, `shorten_top_by`, `shorten_crown_by`, `wall_allocation_id`, `crown_allocation_id`, `tails_allocation_id`) 
VALUES
(6, 13, 13, null, 14, 44, 9, 0, 0, 2, 2, null),
(7, 16, 16, null, 15, 44, 10, 0, 0, 18, 18, null),
(8, 19, 19, null, 18, 44, 12, 0, 0, 23, 23, null)
as new_customer_hats
ON DUPLICATE KEY UPDATE
`hat_material_id`=new_customer_hats.`hat_material_id`, `crown_material_id`=new_customer_hats.`crown_material_id`, `tails_material_id`=new_customer_hats.`tails_material_id`, `wing_id`=new_customer_hats.`wing_id`, `wing_quantity`=new_customer_hats.`wing_quantity`, `customer_id`=new_customer_hats.`customer_id`, `shorten_top_by`=new_customer_hats.`shorten_top_by`, `shorten_crown_by`=new_customer_hats.`shorten_crown_by`, `wall_allocation_id`=new_customer_hats.`wall_allocation_id`, `crown_allocation_id`=new_customer_hats.`crown_allocation_id`, `tails_allocation_id`=new_customer_hats.`tails_allocation_id`;", 'SELECT \'Table customer_hats does not exist\'');
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
(6, 6, 4),
(7, 7, 22),
(8, 8, 6)
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
(11, 6, '2025-05-05 13:26:45', 'new'),
(12, 7, '2025-05-27 21:25:49', 'new'),
(13, 8, '2025-06-01 09:31:18', 'new')
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
('mark_yellow_raw_material_item_percents_below', '30', '30', 'number')
as new_settings
ON DUPLICATE KEY UPDATE
`key`=new_settings.`key`, `value`=new_settings.`value`, `default_value`=new_settings.`default_value`, `value_type`=new_settings.`value_type`;", 'SELECT \'Table settings does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

