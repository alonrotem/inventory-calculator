use inventory;
SET FOREIGN_KEY_CHECKS = 0;
SET @delete_records=TRUE;

# ========== DELETES ==========

# ACCOUNT_REQUESTS
# ------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'account_requests');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `account_requests` where @delete_records=TRUE;", 'SELECT \'Table account_requests does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

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

# COUNTRIES
# -----------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'countries');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `countries` where @delete_records=TRUE;", 'SELECT \'Table countries does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CURRENCIES
# ------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'currencies');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `currencies` where @delete_records=TRUE;", 'SELECT \'Table currencies does not exist\'');
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

# LOGINS
# --------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'logins');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `logins` where @delete_records=TRUE;", 'SELECT \'Table logins does not exist\'');
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

# ROLE_PERMISSIONS
# ------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'role_permissions');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `role_permissions` where @delete_records=TRUE;", 'SELECT \'Table role_permissions does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ROLES
# -------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'roles');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `roles` where @delete_records=TRUE;", 'SELECT \'Table roles does not exist\'');
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

# USER_CUSTOMERS
# ----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'user_customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `user_customers` where @delete_records=TRUE;", 'SELECT \'Table user_customers does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# USER_ROLES
# ------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'user_roles');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `user_roles` where @delete_records=TRUE;", 'SELECT \'Table user_roles does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# USERS
# -------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `users` where @delete_records=TRUE;", 'SELECT \'Table users does not exist\'');
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

# ========== INSERTS ==========

# ACCOUNT_REQUESTS
# ------------------
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
(41, 2, 11, 1440, 176),
(42, 2, 10.5, 1000, 0),
(43, 2, 10, 1711, 369),
(44, 2, 9.5, 1000, 0),
(45, 2, 9, 877, 123),
(46, 2, 8.5, 789, 211),
(47, 2, 8, 578, 422),
(48, 2, 7.5, 500, 422),
(49, 2, 7, 1000, 422),
(50, 2, 6.5, 578, 422),
(51, 2, 6, 5700, 422),
(52, 2, 5.5, 1000, 299),
(62, 11, 7, 892, 108),
(63, 11, 6.5, 1592, 108),
(64, 11, 6, 1350, 250),
(65, 11, 5.5, 1446, 54),
(66, 13, 7, 410, 1534),
(67, 13, 6.5, 339, 1181),
(68, 13, 6, 910, 610),
(69, 13, 5.5, 647, 716),
(70, 14, 11, 500, 0),
(71, 14, 10, 600, 0),
(72, 14, 9.5, 500, 0),
(73, 14, 9, 410, 90),
(74, 14, 8.5, 410, 90),
(75, 14, 8, 40, 360),
(76, 14, 7.5, 620, 180),
(77, 14, 7, 620, 180),
(78, 14, 6.5, 520, 180),
(79, 14, 6, 20, 180),
(80, 14, 5.5, 30, 180),
(81, 14, 5, 200, 0),
(82, 13, 10, 1467, 1181),
(83, 13, 8.5, 1339, 994),
(84, 13, 8, 986, 1505),
(89, 13, 11, 1000, 0),
(96, 16, 7.5, 2198, 1002),
(152, 18, 10, 458, 3142),
(153, 18, 9.5, 1100, 2444),
(154, 18, 9, 886, 4078),
(155, 18, 8.5, 2527, 2861),
(156, 18, 8, 1987, 2801),
(157, 18, 7.5, 160, 2855),
(158, 18, 7, 541, 3547),
(159, 18, 6.5, 190, 3898),
(160, 18, 6, 14884, 6207),
(161, 18, 5.5, 389, 3699),
(162, 18, 5, 2958, 42),
(204, 13, 9.5, 1647, 455),
(205, 13, 9, 1602, 573),
(206, 13, 7.5, 1455, 565),
(207, 13, 5, 384, 1258),
(229, 13, 11.5, 500, 0),
(230, 13, 10.5, 1200, 88),
(243, 11, 9, 980, 64),
(260, 25, 10, 2112, 88),
(261, 25, 9, 792, 88),
(262, 25, 8, 1584, 176),
(263, 25, 7.5, 1584, 176),
(264, 25, 7, 1584, 176),
(265, 25, 6.5, 1584, 176),
(266, 25, 6, 1584, 176),
(267, 25, 5.5, 264, 176),
(279, 28, 11, 100, 0),
(280, 28, 10.5, 456, 44),
(281, 28, 10, 628, 1014),
(282, 28, 9.5, 1112, 88),
(283, 28, 9, 474, 726),
(284, 28, 8.5, 1973, 227),
(285, 28, 8, 685, 315),
(286, 28, 7.5, 868, 132),
(287, 28, 7, 1112, 88),
(288, 28, 6.5, 1112, 88),
(289, 28, 6, 2068, 132),
(290, 28, 5.5, 824, 176),
(291, 29, 5.5, 1010, 0),
(292, 28, 12, 100, 0),
(293, 28, 11.5, 100, 0),
(307, 33, 9, 824, 576),
(318, 33, 6, 676, 524),
(320, 33, 5, 1700, 0),
(323, 25, 9.5, 880, 0),
(324, 25, 8.5, 1232, 88),
(344, 38, 10, 80, 0),
(345, 38, 9.5, 100, 0),
(346, 38, 9, 148, 52),
(347, 38, 8.5, 222, 78),
(348, 38, 8, 230, 0),
(349, 38, 7.5, 787, 13),
(350, 38, 7, 809, 91),
(351, 38, 6.5, 761, 39),
(352, 38, 6, 1174, 26),
(353, 38, 5.5, 1000, 0),
(365, 42, 10, 300, 0),
(366, 42, 9.5, 556, 44),
(367, 42, 9, 724, 176),
(368, 42, 8.5, 762, 88),
(369, 42, 8, 712, 88),
(370, 42, 7.5, 812, 88),
(371, 42, 7, 648, 352),
(372, 42, 6.5, 1224, 176),
(373, 42, 6, 992, 308),
(374, 42, 5.5, 1068, 132),
(375, 42, 5, 1000, 0),
(392, 11, 8, 480, 108),
(393, 11, 7.5, 980, 152),
(394, 11, 5, 1500, 0),
(395, 16, 11, 500, 0),
(396, 16, 10.5, 700, 0),
(397, 16, 10, 629, 371),
(398, 16, 9.5, 806, 44),
(399, 16, 9, 638, 715),
(400, 16, 8.5, 455, 545),
(401, 16, 8, 580, 1420),
(402, 16, 7, 1298, 1302),
(403, 16, 6.5, 1398, 1102),
(404, 16, 6, 1266, 1234),
(405, 16, 5.5, 1942, 1058),
(406, 16, 5, 2000, 0),
(451, 33, 11, 920, 80),
(452, 33, 10.5, 1000, 0),
(453, 33, 10, 1060, 540),
(454, 33, 9.5, 1412, 88),
(455, 33, 8.5, 812, 188),
(456, 33, 8, 684, 316),
(457, 33, 7.5, 644, 356),
(458, 33, 7, 744, 356),
(459, 33, 6.5, 744, 456),
(460, 33, 5.5, 1132, 368),
(477, 48, 10, 314, 86),
(478, 48, 9.5, 378, 122),
(479, 48, 9, 320, 280),
(480, 48, 8.5, 420, 230),
(481, 48, 8, 356, 244),
(482, 48, 7.5, 342, 158),
(483, 48, 7, 156, 244),
(484, 48, 6.5, 142, 158),
(485, 48, 6, 156, 244),
(486, 48, 5.5, 342, 158),
(487, 48, 5, 426, 0),
(498, 50, 10, 370, 180),
(499, 50, 9.5, 380, 120),
(500, 50, 9, 540, 60),
(501, 50, 8.5, 530, 120),
(502, 50, 8, 740, 60),
(503, 50, 7.5, 630, 120),
(504, 50, 7, 540, 60),
(505, 50, 6.5, 480, 120),
(506, 50, 6, 640, 60),
(507, 50, 5.5, 740, 60),
(523, 54, 12, 50, 0),
(524, 54, 11.5, 100, 0),
(525, 54, 11, 100, 0),
(526, 54, 10.5, 200, 0),
(527, 54, 10, 300, 0),
(528, 54, 9.5, 560, 40),
(529, 54, 9, 600, 160),
(530, 54, 8.5, 620, 80),
(531, 54, 8, 620, 80),
(532, 54, 7.5, 860, 40),
(533, 54, 7, 720, 80),
(534, 54, 6.5, 620, 80),
(535, 54, 6, 520, 80),
(536, 54, 5.5, 420, 80),
(537, 54, 5, 400, 0),
(553, 28, 5, 956, 44),
(557, 18, 12, 156, 34),
(558, 38, 12, 156, 0),
(559, 55, 12, 400, 0),
(560, 55, 11.5, 500, 0),
(561, 55, 11, 800, 0),
(562, 55, 10.5, 700, 0),
(563, 55, 10, 710, 90),
(564, 55, 9.5, 540, 60),
(565, 55, 9, 510, 90),
(566, 55, 8.5, 870, 30),
(567, 55, 8, 840, 60),
(568, 55, 7.5, 770, 30),
(569, 55, 7, 640, 60),
(570, 55, 6.5, 670, 30),
(571, 55, 6, 540, 60),
(572, 55, 5.5, 470, 30),
(573, 55, 5, 500, 0),
(589, 60, 13, 222, 0),
(590, 60, 12.5, 74, 0),
(591, 64, 9, 354, 0),
(592, 64, 8.5, 81, 0),
(593, 64, 8, 65, 0),
(594, 64, 7.5, 84, 0),
(595, 64, 6.5, 88, 0),
(596, 64, 6, 215, 0),
(597, 64, 5.5, 81, 0),
(598, 64, 5, 426, 0),
(599, 2, 5, 1000, 0),
(613, 12, 6.5, 40, 0),
(614, 12, 6, 30, 0),
(615, 12, 5.5, 20, 0),
(616, 12, 5, 10, 0),
(617, 11, 10.5, 990, 10),
(618, 11, 10, 980, 20),
(619, 11, 9.5, 970, 30),
(620, 11, 8.5, 990, 10)
as new_allocation_babies
ON DUPLICATE KEY UPDATE
`allocation_id`=new_allocation_babies.`allocation_id`, `length`=new_allocation_babies.`length`, `quantity`=new_allocation_babies.`quantity`, `quantity_in_pending_orders`=new_allocation_babies.`quantity_in_pending_orders`;", 'SELECT \'Table allocation_babies does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# COUNTRIES
# -----------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'countries');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `countries` (`code`, `name`, `order`) 
VALUES
('AD', 'Andorra', 999),
('AE', 'United Arab Emirates', 999),
('AF', 'Afghanistan', 999),
('AG', 'Antigua and Barbuda', 999),
('AI', 'Anguilla', 999),
('AL', 'Albania', 999),
('AM', 'Armenia', 999),
('AO', 'Angola', 999),
('AQ', 'Antarctica', 999),
('AR', 'Argentina', 999),
('AS', 'American Samoa', 999),
('AT', 'Austria', 999),
('AU', 'Australia', 999),
('AW', 'Aruba', 999),
('AZ', 'Azerbaijan', 999),
('BA', 'Bosnia and Herzegovina', 999),
('BB', 'Barbados', 999),
('BD', 'Bangladesh', 999),
('BE', 'Belgium', 999),
('BF', 'Burkina Faso', 999),
('BG', 'Bulgaria', 999),
('BH', 'Bahrain', 999),
('BI', 'Burundi', 999),
('BJ', 'Benin', 999),
('BL', 'St. Barthelemy', 999),
('BM', 'Bermuda', 999),
('BN', 'Brunei Darussalam', 999),
('BO', 'Bolivia', 999),
('BQ', 'Bonaire', 999),
('BR', 'Brazil', 999),
('BS', 'Bahamas', 999),
('BT', 'Bhutan', 999),
('BV', 'Bouvet Island', 999),
('BW', 'Botswana', 999),
('BY', 'Belarus', 999),
('BZ', 'Belize', 999),
('CA', 'Canada', 999),
('CC', 'Cocos Islands', 999),
('CD', 'Congo', 999),
('CF', 'Central African Republic', 999),
('CG', 'Congo', 999),
('CH', 'Switzerland', 999),
('CI', 'Côte d''Ivoire', 999),
('CK', 'Cook Islands', 999),
('CL', 'Chile', 999),
('CM', 'Cameroon', 999),
('CN', 'China', 999),
('CO', 'Colombia', 999),
('CR', 'Costa Rica', 999),
('CU', 'Cuba', 999),
('CV', 'Cabo Verde', 999),
('CW', 'Curaçao', 999),
('CX', 'Christmas Island', 999),
('CY', 'Cyprus', 999),
('CZ', 'Czechia', 999),
('DE', 'Germany', 999),
('DJ', 'Djibouti', 999),
('DK', 'Denmark', 999),
('DM', 'Dominica', 999),
('DO', 'Dominican Republic', 999),
('DZ', 'Algeria', 999),
('EC', 'Ecuador', 999),
('EE', 'Estonia', 999),
('EG', 'Egypt', 999),
('EH', 'Western Sahara', 999),
('ER', 'Eritrea', 999),
('ES', 'Spain', 999),
('ET', 'Ethiopia', 999),
('FI', 'Finland', 999),
('FJ', 'Fiji', 999),
('FK', 'Falkland Islands', 999),
('FM', 'Micronesia', 999),
('FO', 'Faroe Islands', 999),
('FR', 'France', 999),
('GA', 'Gabon', 999),
('GB', 'United Kingdom', 999),
('GD', 'Grenada', 999),
('GE', 'Georgia', 999),
('GF', 'French Guiana', 999),
('GG', 'Guernsey', 999),
('GH', 'Ghana', 999),
('GI', 'Gibraltar', 999),
('GL', 'Greenland', 999),
('GM', 'Gambia', 999),
('GN', 'Guinea', 999),
('GP', 'Guadeloupe', 999),
('GQ', 'Equatorial Guinea', 999),
('GR', 'Greece', 999),
('GT', 'Guatemala', 999),
('GU', 'Guam', 999),
('GW', 'Guinea-Bissau', 999),
('GY', 'Guyana', 999),
('HK', 'Hong Kong', 999),
('HN', 'Honduras', 999),
('HR', 'Croatia', 999),
('HT', 'Haiti', 999),
('HU', 'Hungary', 999),
('ID', 'Indonesia', 999),
('IE', 'Ireland', 999),
('IL', 'Israel', 999),
('IM', 'Isle of Man', 999),
('IN', 'India', 999),
('IO', 'British Indian Ocean Territory', 999),
('IQ', 'Iraq', 999),
('IR', 'Iran', 999),
('IS', 'Iceland', 999),
('IT', 'Italy', 999),
('JE', 'Jersey', 999),
('JM', 'Jamaica', 999),
('JO', 'Jordan', 999),
('JP', 'Japan', 999),
('KE', 'Kenya', 999),
('KG', 'Kyrgyzstan', 999),
('KH', 'Cambodia', 999),
('KI', 'Kiribati', 999),
('KM', 'Comoros', 999),
('KN', 'St. Kitts and Nevis', 999),
('KP', 'North Korea', 999),
('KR', 'South Korea', 999),
('KW', 'Kuwait', 999),
('KY', 'Cayman Islands', 999),
('KZ', 'Kazakhstan', 999),
('LA', 'Laos', 999),
('LB', 'Lebanon', 999),
('LC', 'St. Lucia', 999),
('LI', 'Liechtenstein', 999),
('LK', 'Sri Lanka', 999),
('LR', 'Liberia', 999),
('LS', 'Lesotho', 999),
('LT', 'Lithuania', 999),
('LU', 'Luxembourg', 999),
('LV', 'Latvia', 999),
('LY', 'Libya', 999),
('MA', 'Morocco', 999),
('MC', 'Monaco', 999),
('MD', 'Moldova', 999),
('ME', 'Montenegro', 999),
('MF', 'St. Martin', 999),
('MG', 'Madagascar', 999),
('MH', 'Marshall Islands', 999),
('MK', 'Macedonia', 999),
('ML', 'Mali', 999),
('MM', 'Myanmar', 999),
('MN', 'Mongolia', 999),
('MO', 'Macao', 999),
('MP', 'Northern Mariana Islands', 999),
('MQ', 'Martinique', 999),
('MR', 'Mauritania', 999),
('MS', 'Montserrat', 999),
('MT', 'Malta', 999),
('MU', 'Mauritius', 999),
('MV', 'Maldives', 999),
('MW', 'Malawi', 999),
('MX', 'Mexico', 999),
('MY', 'Malaysia', 999),
('MZ', 'Mozambique', 999),
('NA', 'Namibia', 999),
('NC', 'New Caledonia', 999),
('NE', 'Niger', 999),
('NF', 'Norfolk Island', 999),
('NG', 'Nigeria', 999),
('NI', 'Nicaragua', 999),
('NL', 'Netherlands', 999),
('NO', 'Norway', 999),
('NP', 'Nepal', 999),
('NR', 'Nauru', 999),
('NU', 'Niue', 999),
('NZ', 'New Zealand', 999),
('OM', 'Oman', 999),
('PA', 'Panama', 999),
('PE', 'Peru', 999),
('PF', 'French Polynesia', 999),
('PG', 'Papua New Guinea', 999),
('PH', 'Philippines', 999),
('PK', 'Pakistan', 999),
('PL', 'Poland', 999),
('PM', 'St. Pierre and Miquelon', 999),
('PN', 'Pitcairn', 999),
('PR', 'Puerto Rico', 999),
('PS', 'Palestine, State of', 999),
('PT', 'Portugal', 999),
('PW', 'Palau', 999),
('PY', 'Paraguay', 999),
('QA', 'Qatar', 999),
('RE', 'Reunion', 999),
('RO', 'Romania', 999),
('RS', 'Serbia', 999),
('RU', 'Russia', 2),
('RW', 'Rwanda', 999),
('SA', 'Saudi Arabia', 999),
('SB', 'Solomon Islands', 999),
('SC', 'Seychelles', 999),
('SD', 'Sudan', 999),
('SE', 'Sweden', 999),
('SG', 'Singapore', 999),
('SH', 'St. Helena', 999),
('SI', 'Slovenia', 999),
('SJ', 'Svalbard and Jan Mayen', 999),
('SK', 'Slovakia', 999),
('SL', 'Sierra Leone', 999),
('SM', 'San Marino', 999),
('SN', 'Senegal', 999),
('SO', 'Somalia', 999),
('SR', 'Suriname', 999),
('SS', 'South Sudan', 999),
('ST', 'Sao Tome and Principe', 999),
('SV', 'El Salvador', 999),
('SX', 'Sint Maarten', 999),
('SY', 'Syrian Arab Republic', 999),
('SZ', 'Eswatini', 999),
('TC', 'Turks and Caicos Islands', 999),
('TD', 'Chad', 999),
('TG', 'Togo', 999),
('TH', 'Thailand', 999),
('TJ', 'Tajikistan', 999),
('TK', 'Tokelau', 999),
('TL', 'Timor-Leste', 999),
('TM', 'Turkmenistan', 999),
('TN', 'Tunisia', 999),
('TO', 'Tonga', 999),
('TR', 'Turkey', 999),
('TT', 'Trinidad and Tobago', 999),
('TV', 'Tuvalu', 999),
('TW', 'Taiwan', 999),
('TZ', 'Tanzania, United Republic of', 999),
('UA', 'Ukraine', 999),
('UG', 'Uganda', 999),
('US', 'United States', 1),
('UY', 'Uruguay', 999),
('UZ', 'Uzbekistan', 999),
('VA', 'Holy See', 999),
('VC', 'St. Vincent and the Grenadines', 999),
('VE', 'Venezuela', 999),
('VG', 'Virgin Islands (British)', 999),
('VI', 'Virgin Islands (US)', 999),
('VN', 'Vietnam', 999),
('VU', 'Vanuatu', 999),
('WF', 'Wallis and Futuna', 999),
('WS', 'Samoa', 999),
('YE', 'Yemen', 999),
('YT', 'Mayotte', 999),
('ZA', 'South Africa', 999),
('ZM', 'Zambia', 999),
('ZW', 'Zimbabwe', 999)
as new_countries
ON DUPLICATE KEY UPDATE
`code`=new_countries.`code`, `name`=new_countries.`name`, `order`=new_countries.`order`;", 'SELECT \'Table countries does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CURRENCIES
# ------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'currencies');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `currencies` (`code`, `name`, `symbol`, `order`) 
VALUES
('EUR', 'EURO', '€', 20),
('RUB', 'Ruble', '₽', 30),
('USD', 'US', '$', 10)
as new_currencies
ON DUPLICATE KEY UPDATE
`code`=new_currencies.`code`, `name`=new_currencies.`name`, `symbol`=new_currencies.`symbol`, `order`=new_currencies.`order`;", 'SELECT \'Table currencies does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CUSTOMER_BANKS
# ----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_banks');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_banks` (`id`, `customer_id`, `raw_material_id`, `quantity`, `remaining_quantity`, `quantity_units`, `quantity_in_kg`) 
VALUES
(13, 9, 13, 14838, 1000, 'units', 0),
(15, 10, 13, 12316, 1000, 'units', 0),
(16, 11, 13, 6470, 1000, 'units', 0),
(20, 10, 20, 16272, 1000, 'units', 0),
(21, 12, 20, 16410, 1000, 'units', 0),
(23, 10, 16, 31599, 1000, 'units', 0),
(24, 10, 16, 7766, 1000, 'units', 0),
(28, 9, 17, 25989, 1000, 'units', 259.89),
(29, 10, 21, 15124, 1000, 'units', 0),
(30, 11, 22, 3010, 1000, 'units', 0),
(32, 13, 24, 2000, 1000, 'units', 0),
(33, 13, 22, 14352, 1000, 'units', 0),
(34, 10, 24, 3140, 1000, 'units', 0),
(35, 10, 26, 3061, 1000, 'units', 0),
(36, 14, 26, 2000, 1000, 'units', 0),
(37, 14, 25, 10798, 1000, 'units', 0),
(38, 12, 27, 2000, 1000, 'units', 0),
(39, 12, 28, 2000, 1000, 'units', 0),
(41, 13, 29, 7590, 1000, 'units', 0),
(42, 12, 29, 6326, 1000, 'units', 0),
(46, 9, 29, 8690, 1000, 'units', 0),
(48, 12, 31, 302, 302, 'units', 0),
(49, 9, 28, 2000, 1000, 'units', 0),
(50, 15, 28, 2000, 1000, 'units', 0),
(51, 15, 21, 11460, 1000, 'units', 0),
(53, 10, 17, 750, 750, 'units', 7.5),
(54, 10, 33, 230, 30, 'units', 1),
(55, 12, 34, 4000, 0, 'units', 2000),
(56, 10, 34, 1000, 1000, 'units', 0),
(57, 16, 34, 8000, 1384, 'units', 5000),
(58, 10, 35, 10, 4, 'units', 0)
as new_customer_banks
ON DUPLICATE KEY UPDATE
`customer_id`=new_customer_banks.`customer_id`, `raw_material_id`=new_customer_banks.`raw_material_id`, `quantity`=new_customer_banks.`quantity`, `remaining_quantity`=new_customer_banks.`remaining_quantity`, `quantity_units`=new_customer_banks.`quantity_units`, `quantity_in_kg`=new_customer_banks.`quantity_in_kg`;", 'SELECT \'Table customer_banks does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CUSTOMER_BANKS_ALLOCATIONS
# ----------------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_banks_allocations');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_banks_allocations` (`id`, `customer_bank_id`, `quantity`, `remaining_quantity`, `allocation_type`, `tails_quantity`, `tails_in_orders`) 
VALUES
(2, 13, 12696, 1000, 'babies', 0, 0),
(3, 13, 1142, 1000, 'babies', 0, 0),
(11, 15, 10316, 1000, 'babies', 0, 0),
(12, 15, 1000, 1000, 'babies', 0, 0),
(13, 20, 15272, 986, 'babies', 0, 0),
(14, 16, 5470, 1000, 'babies', 0, 0),
(16, 21, 15410, 1000, 'babies', 0, 0),
(18, 23, 29599, 1000, 'babies', 0, 0),
(25, 28, 14200, 1000, 'babies', 0, 0),
(26, 28, 10789, 1000, 'tails', 9789, 211),
(27, 23, 1000, 1000, 'tails', 0, 0),
(28, 29, 14124, 1000, 'babies', 0, 0),
(29, 30, 2010, 1000, 'babies', 0, 0),
(33, 33, 13352, 1000, 'babies', 0, 0),
(34, 34, 1000, 1000, 'tails', 0, 164),
(35, 34, 1140, 1140, 'tails', 91, 309),
(36, 32, 1000, 1000, 'tails', 0, 400),
(38, 24, 6766, 1000, 'babies', 0, 0),
(39, 35, 1061, 1061, 'tails', 16, 84),
(40, 35, 1000, 1000, 'tails', 0, 0),
(42, 37, 9798, 1000, 'babies', 0, 0),
(43, 36, 1000, 1000, 'tails', 0, 0),
(44, 38, 1000, 1000, 'tails', 0, 0),
(46, 39, 1000, 1000, 'tails', 0, 0),
(47, 42, 1000, 1000, 'tails', 0, 0),
(48, 42, 4326, 974, 'babies', 0, 0),
(50, 41, 6590, 1000, 'babies', 0, 0),
(52, 49, 1000, 1000, 'tails', 0, 0),
(54, 46, 7690, 1000, 'babies', 0, 0),
(55, 51, 10460, 1000, 'babies', 0, 0),
(56, 50, 1000, 1000, 'tails', 0, 0),
(60, 55, 1000, 1000, 'babies', 0, 0),
(62, 55, 1000, 1000, 'babies', 0, 0),
(63, 55, 2000, 0, 'babies', 0, 0),
(64, 57, 3000, 1606, 'babies', 0, 0),
(65, 57, 3616, 0, 'babies', 0, 0),
(66, 58, 6, 0, 'tails', 0, 0),
(67, 54, 200, 0, 'tails', 0, 0)
as new_customer_banks_allocations
ON DUPLICATE KEY UPDATE
`customer_bank_id`=new_customer_banks_allocations.`customer_bank_id`, `quantity`=new_customer_banks_allocations.`quantity`, `remaining_quantity`=new_customer_banks_allocations.`remaining_quantity`, `allocation_type`=new_customer_banks_allocations.`allocation_type`, `tails_quantity`=new_customer_banks_allocations.`tails_quantity`, `tails_in_orders`=new_customer_banks_allocations.`tails_in_orders`;", 'SELECT \'Table customer_banks_allocations does not exist\'');
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
(6, 16, 21, 26, 45, 'RT100', 10, 0, 0, 18, 28, 39, 44, 0.17, 0, 6.5, 10, null),
(7, 20, 20, 26, 46, 'RT65', 10, 0, 0, 13, 13, 40, 308, 0.17, 0, 4.5, 8, null),
(8, 20, 20, 28, 47, 'RT85', 12, 0, 1, 16, 16, 46, 371, 0.17, 0, 6.5, 10, null),
(9, 25, 25, 26, 48, 'RT70', 14, 0, 0, 42, 42, 43, 44, 0.17, 0, 3.5, 7, null),
(10, 16, 21, 24, 49, 'RT110', 10, 1, 0, 18, 28, 35, 0, 0.17, 0, 6.5, 10, null),
(13, 29, 29, 29, 54, 'RT95 BM', 13, 0, 0, 50, 50, 0, 60, 0.17, 0, 10, 10, null),
(14, 13, 13, 17, 55, 'RT85', 9, 0, 0, 2, 2, 26, 0, 0.17, 0, 7.5, 11, null),
(16, 13, 13, 17, 57, 'RT90', 9, 0, 0, 2, 2, 26, 0, 0.17, 0, 6.5, 10, null),
(17, 20, 20, 28, 58, 'RT70', 12, 0, 0, 16, 16, 46, 50, 0.17, 0, 3.5, 7, null),
(18, 20, 20, 28, 59, 'DM 159', 12, 1, 0.5, 16, 16, 46, 44, 0.17, 0, 6, 9.5, null),
(19, 16, 21, 26, 60, 'RT95', 10, 0, 0, 18, 28, 39, 90, 0.17, 0, 5.5, 9, null),
(20, 16, 16, 24, 62, 'RT85', 10, 0, 1, 18, 18, 34, 90, 0.17, 0, 6.5, 10, null),
(21, 20, 20, 28, 64, 'Adiel', 12, 0, 0, 16, 16, 0, 86, 0.17, 0, 8, 8, '2025-08-18 00:00:00'),
(22, 22, 22, 24, 65, 'DM 159', 13, 0, 0, 33, 33, 0, 88, 0.17, 0, 10, 10, null),
(23, 22, 22, 24, 66, 'Emerals', 13, 0, 0, 33, 33, 0, 100, 0.17, 0, 9, 9, null),
(24, 22, 22, 24, 67, 'RT8520250623011331', 13, 0, 0, 33, 33, 36, 40, 0.17, 0, 7.5, 11, null),
(25, 17, 17, 13, 68, 'RT85', 9, 0, 1, 25, 25, 0, 44, 0.17, 0, 10, 10, null),
(26, 17, 17, 28, 69, 'RT85', 9, 0, 1, 25, 25, 51, 44, 0.17, 0, 6.5, 10, null),
(27, 29, 29, 28, 70, 'RT100', 9, 1, 0.5, 54, 54, 52, 40, 0.17, 0, 6, 9.5, null),
(28, 21, 21, 26, 72, '105166', 10, 0, 0, 28, 28, 0, 44, 0.17, 0, 10, 10, null),
(30, 16, 16, 13, 74, 'RT100 1217 T', 10, 0, 0, 18, 18, 0, 34, 0.17, 0, 6, 6, null),
(31, 16, 16, 26, 75, '105166', 10, 0.5, 0, 18, 18, 0, 42, 0.17, 0, 9.5, 9.5, null),
(32, 16, 21, 26, 76, 'RT1217 BM', 10, 0.5, 0, 18, 28, 0, 98, 0.17, 0, 10, 10, null),
(33, 16, 16, 26, 78, 'RT95', 10, 0, 0, 18, 18, 0, 38, 0.17, 0, 9, 9, null),
(34, 21, 21, 28, 80, 'C9', 15, 0, 0, 55, 55, 56, 30, 0.17, 0, 6.5, 10, null),
(35, 16, 16, 26, 81, 'RT95', 10, 0, 0, 18, 18, 39, 0, 0.17, 0, 5.5, 9, null),
(36, 16, 16, 24, 82, 'RT110', 10, 1, 0.5, 18, 18, 34, 45, 0.17, 0, 6, 9.5, null),
(37, 16, 16, 26, 83, 'RT100', 10, 0, 0, 18, 18, 0, 36, 0.17, 0, 9.5, 9.5, null),
(38, 29, 29, 28, 84, 'RT95', 12, 0, 0, 48, 48, 46, 36, 0.17, 0, 5, 8.5, null),
(39, 13, 13, 13, 85, 'Adiel', 11, 0, 0, 14, 14, 0, 45, 0.17, 0, 8, 8, null),
(40, 13, 13, 13, 86, 'Adiel', 11, 0, 0, 14, 14, 0, 45, 0.17, 0, 8, 8, null),
(41, 20, 20, 26, 87, 'C9', 10, 0, 0, 13, 13, 39, 0, 0.17, 0, 6.5, 10, null),
(42, 16, 21, 24, 88, 'RT95', 10, 0, 0, 18, 28, 34, 90, 0.17, 0, 4.5, 8, '2025-11-25 00:00:00'),
(43, 16, 21, 24, 89, 'RT95', 10, 0, 0, 18, 28, 35, 0, 0.17, 0, 4.5, 8, '2025-11-25 00:00:00'),
(44, 16, 16, 35, 97, 'RT 115-155 (C7.5)', 10, 0, 1, 38, 38, 66, 13, 0.17, 0, 5.5, 9, null),
(45, 13, 13, 33, 98, 'DM 159', 10, 0, 0, 11, 11, 67, 10, 0.17, 0, 7, 10.5, null)
as new_customer_hats
ON DUPLICATE KEY UPDATE
`hat_material_id`=new_customer_hats.`hat_material_id`, `crown_material_id`=new_customer_hats.`crown_material_id`, `tails_material_id`=new_customer_hats.`tails_material_id`, `wing_id`=new_customer_hats.`wing_id`, `original_wing_name`=new_customer_hats.`original_wing_name`, `customer_id`=new_customer_hats.`customer_id`, `shorten_top_by`=new_customer_hats.`shorten_top_by`, `shorten_crown_by`=new_customer_hats.`shorten_crown_by`, `wall_allocation_id`=new_customer_hats.`wall_allocation_id`, `crown_allocation_id`=new_customer_hats.`crown_allocation_id`, `tails_allocation_id`=new_customer_hats.`tails_allocation_id`, `tails_overdraft`=new_customer_hats.`tails_overdraft`, `mayler_width`=new_customer_hats.`mayler_width`, `hr_hl_width`=new_customer_hats.`hr_hl_width`, `crown_visible`=new_customer_hats.`crown_visible`, `crown_length`=new_customer_hats.`crown_length`, `order_date`=new_customer_hats.`order_date`;", 'SELECT \'Table customer_hats does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CUSTOMERS
# -----------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customers` (`id`, `name`, `business_name`, `email`, `phone`, `tax_id`, `customer_code`, `notes`, `allow_calculation_advisor`, `created_at`, `updated_at`, `created_by`, `updated_by`, `order_seq_number`) 
VALUES
(9, 'Alon Rotem', 'Romtech', 'alon@mail.com', '+359 (88) 401-3532', 'Tax payer 1234', 'L', null, 0, '2025-01-06 20:05:29', '2026-02-16 14:41:21', 1, 1, 9),
(10, 'Avi Bar', 'Romtech', 'avi_bar@mail.com', '+359 87 985 8868', 'Tax payer 5678', 'AB', null, 1, '2025-01-06 20:05:29', '2026-02-21 12:41:26', 1, 1, 35),
(11, 'Guy Tal', 'Guytech', 'guy@mail.com', '+359 87 123 4567', 'Tax payer 90123', null, null, 0, '2025-01-06 20:05:29', '2025-10-24 07:46:11', 1, 1, 3),
(12, 'London', 'London Inc', '', '', '456456', 'L', null, 0, '2025-02-24 22:19:45', '2026-01-27 06:43:54', 0, 0, 28),
(13, 'NY', 'NY', 'ny@gmail.con', '878782858', '234578', 'USA', null, 0, '2025-02-25 20:10:16', '2025-08-21 08:40:12', 0, 0, 20),
(14, 'VK BKLYN', 'K Shtreimel ', '', '7184568578', '369632', 'VК', null, 0, '2025-07-15 15:48:13', '2025-07-24 17:44:40', 0, 0, 2),
(15, 'Alo ', 'ISR', 'romtechltd@gmail.com', '0879858868', '123212', 'BBE', null, 0, '2025-09-07 20:26:37', '2025-09-11 04:26:50', 0, 0, 2),
(16, 'USA London', 'Tif', '', '', '', 'USAL', null, 0, '2026-01-27 06:50:10', '2026-01-27 07:01:48', 0, 0, 1)
as new_customers
ON DUPLICATE KEY UPDATE
`name`=new_customers.`name`, `business_name`=new_customers.`business_name`, `email`=new_customers.`email`, `phone`=new_customers.`phone`, `tax_id`=new_customers.`tax_id`, `customer_code`=new_customers.`customer_code`, `notes`=new_customers.`notes`, `allow_calculation_advisor`=new_customers.`allow_calculation_advisor`, `created_at`=new_customers.`created_at`, `updated_at`=new_customers.`updated_at`, `created_by`=new_customers.`created_by`, `updated_by`=new_customers.`updated_by`, `order_seq_number`=new_customers.`order_seq_number`;", 'SELECT \'Table customers does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# LOGINS
# --------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'logins');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `logins` (`id`, `user_id`, `origin_ip_address`, `logged_in_at`, `last_refresh_token_time`, `refresh_token_expiration`, `refresh_token`, `origin_geolocation`, `origin_city`, `origin_country`, `origin_os`, `origin_browser`) 
VALUES
(3, 2, '88.203.194.4', '2026-02-16 12:54:40', '2026-02-16 12:54:40', '2026-03-18 12:54:40', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzEyNDY0ODAsImV4cCI6MTc3MzgzODQ4MH0.MTO2usudELMc2QmxvMka5zK8I6liSoIItaDZ2_U7aXI', null, null, null, null, null),
(6, 2, '95.42.140.220', '2026-02-16 14:39:13', '2026-02-16 15:01:52', '2026-03-18 14:39:10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzEyNTQxMTIsImV4cCI6MTc3Mzg0NDc0OX0.vKV-wrGxg-nNApgfa6SVg2vjvfP8sjV53D2DOgoOyM8', '', '', '', 'Windows', 'Edge'),
(15, 1, '90.154.140.233', '2026-02-22 20:58:32', '2026-02-22 21:06:58', '2026-03-24 20:58:32', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzE3OTQ0MTgsImV4cCI6MTc3NDM4NTkxMX0.KzPYu-whGPYsWL4oKfg3qRiepxJuUUiBCh0r-uj9lOg', '', '', '', 'Windows', 'Edge'),
(17, 1, '88.203.194.4', '2026-03-01 18:17:42', '2026-03-01 18:17:42', '2026-03-02 18:17:42', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzIzODkwNjIsImV4cCI6MTc3MjQ3NTQ2Mn0.dn_IVY1xBdHWLWw3OHVnk1YuhLIS-woEQ41r4Iw-gj0', '', '', '', 'Windows', 'Edge')
as new_logins
ON DUPLICATE KEY UPDATE
`user_id`=new_logins.`user_id`, `origin_ip_address`=new_logins.`origin_ip_address`, `logged_in_at`=new_logins.`logged_in_at`, `last_refresh_token_time`=new_logins.`last_refresh_token_time`, `refresh_token_expiration`=new_logins.`refresh_token_expiration`, `refresh_token`=new_logins.`refresh_token`, `origin_geolocation`=new_logins.`origin_geolocation`, `origin_city`=new_logins.`origin_city`, `origin_country`=new_logins.`origin_country`, `origin_os`=new_logins.`origin_os`, `origin_browser`=new_logins.`origin_browser`;", 'SELECT \'Table logins does not exist\'');
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

# ORDERS
# --------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'orders');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `orders` (`id`, `customer_hat_id`, `customer_order_seq_number`, `wing_quantity`, `num_of_hats`, `kippa_size`, `diameter_inches`, `ordering_customer_name`, `tails_overdraft`, `isurgent`, `white_hair`, `white_hair_notes`, `order_notes`) 
VALUES
(1, 1, 1, 44, 1, 55, 12.5, 'a', 44, 0, 0, '', ''),
(2, 1, 2, 44, 1, 57, 12.5, 'b', 44, 0, 0, '', ''),
(3, 1, 3, 44, 1, 56.5, 12.5, 'c', 44, 0, 0, '', ''),
(4, 1, 4, 44, 1, 56, 12.5, 'd', 44, 0, 0, '', ''),
(5, 1, 5, 44, 1, 55, 12.5, 'e', 44, 0, 0, '', ''),
(23, 6, 6, 44, 1, 55, 12.5, 'LA', 44, 0, 0, '', ''),
(24, 7, 7, 44, 1, 55, 12.5, '', 44, 0, 0, '', ''),
(25, 7, 8, 44, 1, 55, 12.5, '', 44, 0, 0, '', ''),
(26, 7, 9, 44, 1, 55, 12.5, '', 44, 0, 1, '', ''),
(27, 7, 10, 44, 1, 55, 12.5, '', 44, 1, 0, '', ''),
(28, 7, 11, 44, 1, 55, 12.5, '', 44, 0, 1, '', ''),
(29, 7, 12, 44, 1, 55, 12.5, '', 44, 0, 0, '', ''),
(30, 7, 13, 44, 1, 55, 12.5, '', 44, 0, 0, '', ''),
(31, 8, 7, 50, 1, 55, 12.5, 'LA', 50, 0, 0, '', ''),
(32, 8, 8, 49, 1, 55.5, 12.5, 'LA', 49, 0, 0, '', ''),
(33, 8, 9, 48, 1, 56, 12.5, 'LA', 48, 0, 1, 'few', ''),
(34, 8, 10, 47, 1, 57, 12.5, 'LA', 47, 0, 0, '', ''),
(35, 8, 11, 46, 1, 57.5, 12.5, 'LA', 46, 0, 0, '', ''),
(36, 8, 12, 45, 1, 58, 12.5, 'LA', 45, 0, 1, 'little', ''),
(37, 8, 13, 44, 1, 59, 12.5, 'LA', 44, 0, 0, '', ''),
(38, 8, 14, 42, 1, 59.5, 12.5, 'LA', 42, 1, 1, '', ''),
(39, 9, 1, 44, 1, 55, 12.5, 'no', 44, 0, 0, '', ''),
(40, 10, 14, 40, 1, 55, 12.5, 'S', 0, 0, 0, '', ''),
(41, 10, 15, 42, 1, 55, 12.5, 'S', 0, 1, 1, 'little', ''),
(46, 13, 12, 30, 1, 55, 12.5, 'ab', 30, 0, 0, '', ''),
(47, 13, 13, 30, 1, 55, 12.5, 'ab', 30, 1, 1, 'on 5 wings', ''),
(48, 14, 1, 44, 1, 55, 12.5, 'AR', 0, 0, 0, '', ''),
(49, 14, 2, 44, 1, 56.5, 12.5, 'AR', 0, 1, 1, 'few wings', ''),
(51, 16, 3, 40, 1, 55, 12.5, 'm', 0, 0, 0, '', ''),
(52, 16, 4, 41, 1, 55.5, 12.5, 'm', 0, 0, 0, '', ''),
(53, 16, 5, 42, 1, 55, 12.5, 'm', 0, 0, 0, '', ''),
(54, 17, 19, 10, 1, 55, 12.5, 'v', 10, 0, 0, '', ''),
(55, 17, 20, 10, 1, 55.5, 12.5, 'v', 10, 0, 0, '', ''),
(56, 17, 21, 10, 1, 56, 12.5, 'v', 10, 0, 0, '', ''),
(57, 17, 22, 10, 1, 56.5, 12.5, 'v', 10, 0, 0, '', ''),
(58, 17, 23, 10, 1, 57, 12.5, 'v', 10, 0, 0, '', ''),
(59, 18, 24, 44, 1, 55, 12.5, '', 44, 1, 1, '', ''),
(60, 19, 16, 46, 1, 58, 12.5, 'Michael', 46, 0, 0, '', ''),
(61, 19, 17, 44, 1, 59, 12.5, 'Michael', 44, 1, 1, '', ''),
(62, 20, 18, 46, 1, 55, 12.5, 'Adiel', 46, 0, 0, '', ''),
(63, 20, 19, 44, 1, 57, 12.5, 'Adiel', 44, 0, 1, 'slight', ''),
(64, 21, 25, 42, 1, 56, 12.5, 'Gold', 42, 0, 0, '', ''),
(65, 21, 26, 44, 1, 56, 12.5, 'Da', 44, 1, 1, 'bgfhgjg', ''),
(66, 22, 14, 46, 1, 55, 12.5, 'Am', 46, 0, 0, '', ''),
(67, 22, 15, 42, 1, 55, 12.5, 'Jac', 42, 1, 1, '', 'fdsgvsdvg'),
(68, 23, 16, 50, 1, 55, 12.5, 'z', 50, 0, 0, '', ''),
(69, 23, 17, 50, 1, 57, 12.5, 'z', 50, 0, 0, '', 'zsdfgzdfbv'),
(70, 24, 18, 20, 1, 55, 12.5, 'TT', 20, 0, 0, '', ''),
(71, 24, 19, 20, 1, 56.5, 12.5, 'TT', 20, 0, 0, '', ''),
(72, 25, 6, 44, 1, 55, 12.5, '', 44, 0, 0, '', ''),
(73, 26, 7, 44, 1, 55, 12.5, '', 44, 0, 0, '', ''),
(74, 27, 8, 40, 1, 55, 12.5, 'ML', 40, 0, 0, '', ''),
(75, 28, 20, 44, 1, 56.5, 12.5, 'A', 44, 0, 0, '', ''),
(76, 30, 21, 34, 1, 55, 13, 'Alon', 34, 0, 0, '', ''),
(77, 31, 22, 42, 1, 55, 16, '', 42, 0, 0, '', ''),
(78, 32, 23, 49, 1, 56.5, 12.5, 'monroe', 49, 0, 1, 'dgszgdafh', 'dfmhvgkjhkkjlkk'),
(79, 32, 24, 49, 1, 58, 12.5, 'london', 49, 0, 1, 'dgszgdafh', 'dfmhvgkjhkkjlkk'),
(80, 33, 25, 38, 1, 57, 14.5, 'av', 38, 0, 0, '', ''),
(81, 34, 1, 30, 1, 51, 11.5, 'oo7', 30, 0, 0, '', ''),
(82, 35, 26, 39, 1, 56.5, 15, 'Y', 0, 1, 1, '', ''),
(83, 36, 27, 45, 1, 56.5, 11.5, 'h', 45, 1, 0, '', ''),
(84, 37, 28, 36, 1, 51, 11.5, 'LL', 36, 0, 0, '', ''),
(85, 38, 27, 36, 1, 51, 11.5, '', 36, 0, 0, '', ''),
(86, 39, 1, 45, 1, 55, 11.5, '', 45, 0, 0, '', ''),
(87, 40, 2, 45, 1, 55, 11.5, 'L', 45, 0, 0, '', ''),
(88, 41, 29, 45, 1, 56, 11.5, 'AAA', 0, 0, 0, '', ''),
(89, 42, 30, 45, 1, 55.5, 14.25, 'AS', 45, 1, 1, 'spread', ''),
(90, 42, 31, 45, 1, 56, 14.25, 'SA', 45, 1, 1, 'spread', ''),
(91, 43, 32, 49, 1, 56, 14.25, 'uv', 0, 1, 1, 'spread', ''),
(92, 44, 33, 13, 1, 51, 11.5, '', 13, 0, 0, '', ''),
(93, 45, 34, 10, 1, 56, 11.5, '', 10, 0, 0, '', '')
as new_orders
ON DUPLICATE KEY UPDATE
`customer_hat_id`=new_orders.`customer_hat_id`, `customer_order_seq_number`=new_orders.`customer_order_seq_number`, `wing_quantity`=new_orders.`wing_quantity`, `num_of_hats`=new_orders.`num_of_hats`, `kippa_size`=new_orders.`kippa_size`, `diameter_inches`=new_orders.`diameter_inches`, `ordering_customer_name`=new_orders.`ordering_customer_name`, `tails_overdraft`=new_orders.`tails_overdraft`, `isurgent`=new_orders.`isurgent`, `white_hair`=new_orders.`white_hair`, `white_hair_notes`=new_orders.`white_hair_notes`, `order_notes`=new_orders.`order_notes`;", 'SELECT \'Table orders does not exist\'');
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
(23, 23, '2025-07-23 20:25:43', 'new'),
(24, 24, '2025-07-24 10:04:33', 'new'),
(25, 25, '2025-07-24 10:04:33', 'new'),
(26, 26, '2025-07-24 10:04:33', 'new'),
(27, 27, '2025-07-24 10:04:33', 'new'),
(28, 28, '2025-07-24 10:04:33', 'new'),
(29, 29, '2025-07-24 10:04:33', 'new'),
(30, 30, '2025-07-24 10:04:33', 'new'),
(31, 31, '2025-07-24 17:39:03', 'new'),
(32, 32, '2025-07-24 17:39:03', 'new'),
(33, 33, '2025-07-24 17:39:03', 'new'),
(34, 34, '2025-07-24 17:39:03', 'new'),
(35, 35, '2025-07-24 17:39:03', 'new'),
(36, 36, '2025-07-24 17:39:03', 'new'),
(37, 37, '2025-07-24 17:39:03', 'new'),
(38, 38, '2025-07-24 17:39:03', 'new'),
(39, 39, '2025-07-24 17:44:41', 'new'),
(40, 40, '2025-07-26 20:15:23', 'new'),
(41, 41, '2025-07-26 20:15:23', 'new'),
(46, 46, '2025-08-01 12:58:58', 'new'),
(47, 47, '2025-08-01 12:58:58', 'new'),
(48, 48, '2025-08-02 15:27:48', 'new'),
(49, 49, '2025-08-02 15:27:48', 'new'),
(51, 51, '2025-08-03 20:30:13', 'new'),
(52, 52, '2025-08-03 20:30:13', 'new'),
(53, 53, '2025-08-03 20:30:13', 'new'),
(54, 54, '2025-08-03 20:46:28', 'new'),
(55, 55, '2025-08-03 20:46:28', 'new'),
(56, 56, '2025-08-03 20:46:28', 'new'),
(57, 57, '2025-08-03 20:46:28', 'new'),
(58, 58, '2025-08-03 20:46:28', 'new'),
(59, 59, '2025-08-06 17:55:40', 'new'),
(60, 60, '2025-08-09 20:09:12', 'new'),
(61, 61, '2025-08-09 20:09:12', 'new'),
(62, 62, '2025-08-09 22:28:16', 'new'),
(63, 63, '2025-08-09 22:28:16', 'new'),
(64, 64, '2025-08-09 22:45:37', 'new'),
(65, 65, '2025-08-09 22:45:37', 'new'),
(66, 66, '2025-08-15 15:09:34', 'new'),
(67, 67, '2025-08-15 15:09:34', 'new'),
(68, 68, '2025-08-15 15:14:46', 'new'),
(69, 69, '2025-08-15 15:14:46', 'new'),
(70, 70, '2025-08-21 08:40:13', 'new'),
(71, 71, '2025-08-21 08:40:13', 'new'),
(72, 72, '2025-08-24 12:51:11', 'new'),
(73, 73, '2025-08-24 12:56:18', 'new'),
(74, 74, '2025-08-24 13:12:58', 'new'),
(75, 75, '2025-08-25 12:11:41', 'new'),
(76, 76, '2025-08-27 15:08:39', 'new'),
(77, 77, '2025-08-28 14:43:10', 'new'),
(78, 78, '2025-08-29 09:58:53', 'new'),
(79, 79, '2025-08-29 09:58:53', 'new'),
(80, 80, '2025-08-30 20:51:35', 'new'),
(81, 81, '2025-09-11 04:26:50', 'new'),
(82, 82, '2025-09-15 19:55:51', 'new'),
(83, 83, '2025-09-24 07:00:35', 'new'),
(84, 84, '2025-10-10 08:15:21', 'new'),
(85, 85, '2025-10-14 10:18:28', 'new'),
(86, 86, '2025-10-22 11:34:44', 'new'),
(87, 87, '2025-10-24 07:46:12', 'new'),
(88, 88, '2025-11-18 10:05:22', 'new'),
(89, 89, '2025-11-18 10:21:51', 'new'),
(90, 90, '2025-11-18 10:21:51', 'new'),
(91, 91, '2025-11-18 10:28:34', 'new'),
(92, 92, '2026-02-16 14:55:46', 'new'),
(93, 93, '2026-02-21 12:41:27', 'new')
as new_orders_status
ON DUPLICATE KEY UPDATE
`order_id`=new_orders_status.`order_id`, `date`=new_orders_status.`date`, `order_status`=new_orders_status.`order_status`;", 'SELECT \'Table orders_status does not exist\'');
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
(13, 'Sable', '2024-06-08 00:00:00', 34624, 1000, 'units', null, 'JJ', 'US', 30, 'USD', 'This is a test material', 'Dark brown', '2025-01-06 20:05:29', '2025-11-05 18:36:58', 1, 1, 0),
(16, 'BM', '2024-06-08 00:00:00', 40365, 1000, 'units', null, null, 'US', 60, 'EUR', 'This is a test material', 'Light brown', '2025-01-06 20:05:29', '2025-11-05 18:36:58', 1, 1, 0),
(17, 'Canady', '2024-06-08 00:00:00', 269.89, 2.5, 'kg', 100, 'XY', 'US', 4, 'USD', 'This is a test material', 'Light brown', '2025-01-06 20:05:29', '2025-11-15 13:57:28', 1, 1, 0),
(20, 'DM', '2025-02-08 00:00:00', 33682, 1000, 'units', null, 'dd', 'US', 20, 'USD', '', 'Black', '2025-02-08 21:20:42', '2025-11-05 18:36:58', 0, 0, 1),
(21, 'DM Medium brown', '2025-06-05 00:00:00', 27584, 1000, 'units', null, '', 'US', 25, 'USD', '', 'Dark brown', '2025-06-05 08:38:20', '2025-11-05 18:36:58', 0, 0, 0),
(22, 'DM', '2025-06-05 00:00:00', 18362, 1000, 'units', null, '', 'US', 14, 'USD', '', 'Dark brown', '2025-06-05 10:39:38', '2025-11-05 18:36:58', 0, 0, 0),
(24, 'Sable H', '2025-06-06 00:00:00', 6140, 1000, 'units', null, '', 'US', 7, 'USD', '', 'Mixed color', '2025-06-06 12:52:24', '2025-11-05 18:36:58', 0, 0, 0),
(25, 'DM ', '2025-07-01 00:00:00', 11798, 1000, 'units', null, 'London', 'US', 1.5, 'USD', 'return from dyeing on July 1st dyeing cost 2$', 'Dark brown', '2025-07-01 17:55:24', '2025-11-05 18:36:58', 0, 0, 0),
(26, 'Sable ', '2025-07-08 00:00:00', 6061, 1000, 'units', null, '', 'US', 0, 'USD', '', 'Natural', '2025-07-08 14:53:01', '2025-11-05 18:36:58', 0, 0, 0),
(27, 'Demo H materials', '2025-07-18 00:00:00', 3000, 1000, 'units', null, '', 'US', 3, 'USD', '', 'Natural', '2025-07-18 07:04:10', '2025-11-05 18:36:58', 0, 0, 0),
(28, 'Stable ', '2025-07-23 00:00:00', 7000, 1000, 'units', null, '', 'US', 6, 'USD', '', 'Natural', '2025-07-22 21:57:22', '2025-11-05 18:36:58', 0, 0, 0),
(29, 'BM', '2025-07-30 00:00:00', 23606, 1000, 'units', null, '', 'US', 6, 'USD', '', 'Natural', '2025-07-29 21:05:31', '2025-11-05 18:36:58', 0, 0, 0),
(30, 'BM', '2025-08-10 00:00:00', 1000, 1000, 'units', null, 'greece', 'US', 10, 'USD', '', 'Dark brown', '2025-08-09 22:19:55', '2025-11-05 18:36:58', 0, 0, 0),
(31, 'DM', '2025-08-12 00:00:00', 1302, 1000, 'units', null, '', 'US', 0, 'USD', '', 'Brown', '2025-08-12 14:16:01', '2025-11-05 18:36:58', 0, 0, 1),
(32, 'sable', '2025-11-15 00:00:00', 4600, 4600, 'units', 0, '', 'US', 3, 'USD', '', 'Natural', '2025-11-15 13:26:30', '2025-11-15 13:26:30', 0, 0, 0),
(33, 'sable', '2025-11-15 00:00:00', 5, 4, 'kg', 230, '', 'US', 3, 'USD', '', 'Mixed color', '2025-11-15 13:59:44', '2025-11-15 14:00:37', 0, 0, 0),
(34, 'DM Light', '2026-01-27 00:00:00', 15000, 2000, 'units', 0, '', 'US', 0, 'USD', '', 'Light brown', '2026-01-27 06:29:20', '2026-01-27 06:58:41', 0, 0, 0),
(35, 'Fisher', '2026-02-16 00:00:00', 100, 90, 'units', 0, '', 'US', 0, 'USD', '', 'Natural', '2026-02-16 14:45:41', '2026-02-16 14:46:10', 0, 0, 0)
as new_raw_materials
ON DUPLICATE KEY UPDATE
`name`=new_raw_materials.`name`, `purchased_at`=new_raw_materials.`purchased_at`, `purchase_quantity`=new_raw_materials.`purchase_quantity`, `remaining_quantity`=new_raw_materials.`remaining_quantity`, `quantity_units`=new_raw_materials.`quantity_units`, `units_per_kg`=new_raw_materials.`units_per_kg`, `vendor_name`=new_raw_materials.`vendor_name`, `origin_country`=new_raw_materials.`origin_country`, `price`=new_raw_materials.`price`, `currency`=new_raw_materials.`currency`, `notes`=new_raw_materials.`notes`, `color`=new_raw_materials.`color`, `created_at`=new_raw_materials.`created_at`, `updated_at`=new_raw_materials.`updated_at`, `created_by`=new_raw_materials.`created_by`, `updated_by`=new_raw_materials.`updated_by`, `allow_shortening_babies_in_pairs`=new_raw_materials.`allow_shortening_babies_in_pairs`;", 'SELECT \'Table raw_materials does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ROLE_PERMISSIONS
# ------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'role_permissions');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `role_permissions` (`id`, `role_id`, `area`, `permissions`) 
VALUES
(1, '1', 'dashboard', 'CRUD'),
(2, '1', 'raw_materials', 'CRUD'),
(3, '1', 'bank_baby_management', 'CRUD'),
(4, '1', 'customers', 'CRUD'),
(5, '1', 'customers_advanced_features', 'RU'),
(6, '1', 'orders', 'CRUD'),
(7, '1', 'wings', 'CRUD'),
(8, '1', 'wings_through_orders', ''),
(9, '1', 'system_settings', 'CRUD'),
(10, '1', 'backup', 'CRUD'),
(11, '1', 'system_logs', 'CRUD'),
(12, '1', 'user_management', 'CRUD'),
(13, '1', 'customer_resources_by_customer_id', ''),
(14, '1', 'orders_resources_by_customer_id', ''),
(15, '2', 'dashboard', 'R'),
(16, '2', 'raw_materials', ''),
(17, '2', 'bank_baby_management', ''),
(18, '2', 'customers', ''),
(19, '2', 'customers_advanced_features', ''),
(20, '2', 'orders', ''),
(21, '2', 'wings', ''),
(22, '2', 'wings_through_orders', 'CR'),
(23, '2', 'system_settings', ''),
(24, '2', 'backup', ''),
(25, '2', 'system_logs', ''),
(26, '2', 'user_management', ''),
(27, '2', 'customer_resources_by_customer_id', 'RU'),
(28, '2', 'orders_resources_by_customer_id', 'CRUD'),
(29, '3', 'dashboard', 'R'),
(30, '3', 'raw_materials', 'R'),
(31, '3', 'bank_baby_management', 'CRUD'),
(32, '3', 'customers', 'R'),
(33, '2', 'customers_advanced_features', ''),
(34, '3', 'orders', 'RUD'),
(35, '3', 'wings', 'R'),
(36, '3', 'wings_through_orders', ''),
(37, '3', 'system_settings', ''),
(38, '3', 'backup', ''),
(39, '3', 'user_management', ''),
(40, '3', 'system_logs', ''),
(41, '3', 'customer_resources_by_customer_id', ''),
(42, '3', 'orders_resources_by_customer_id', ''),
(43, '4', 'dashboard', 'R'),
(44, '4', 'raw_materials', ''),
(45, '4', 'bank_baby_management', ''),
(46, '4', 'customers', ''),
(47, '4', 'customers_advanced_features', ''),
(48, '4', 'orders', ''),
(49, '4', 'wings', ''),
(50, '4', 'wings_through_orders', ''),
(51, '4', 'system_settings', ''),
(52, '4', 'user_management', ''),
(53, '4', 'backup', ''),
(54, '4', 'system_logs', ''),
(55, '4', 'customer_resources_by_customer_id', ''),
(56, '4', 'orders_resources_by_customer_id', '')
as new_role_permissions
ON DUPLICATE KEY UPDATE
`role_id`=new_role_permissions.`role_id`, `area`=new_role_permissions.`area`, `permissions`=new_role_permissions.`permissions`;", 'SELECT \'Table role_permissions does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ROLES
# -------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'roles');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `roles` (`id`, `name`) 
VALUES
(1, 'administrator'),
(2, 'customer'),
(3, 'employee'),
(4, 'guest')
as new_roles
ON DUPLICATE KEY UPDATE
`name`=new_roles.`name`;", 'SELECT \'Table roles does not exist\'');
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
('alert_raw_material_item_percents_below', '20', '10', 'number'),
('alert_raw_material_item_units', '1', '1', 'boolean'),
('alert_raw_material_item_units_below', '300', '10', 'number'),
('alert_raw_material_total_kg', '1', '1', 'boolean'),
('alert_raw_material_total_kg_below', '7', '10', 'number'),
('alert_raw_material_total_units', '1', '1', 'boolean'),
('alert_raw_material_total_units_below', '200', '20', 'number'),
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
(11, '2024-09-21 00:00:00', 1, 750, 'raw_material_purchase', 16, 0, 0, 0, 750, 0, 0),
(12, '2024-09-22 00:00:00', 1, 7, 'raw_material_purchase', 17, 0, 0, 0, 7, 0, 0),
(13, '2024-09-23 00:00:00', 1, 5, 'customer_bank_allocate_to_Work', 13, 9, 13, 2, -1, 5, 0),
(14, '2024-09-24 00:00:00', 1, 3, 'customer_bank_allocate_to_Work', 13, 9, 13, 3, -1, 2, 0),
(15, '2024-09-25 00:00:00', 1, 5, 'customer_bank_allocate_to_Work', 13, 9, 14, 4, -1, 15, 0),
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
(109, '2025-07-22 22:10:04', 1, 400, 'customer_bank_allocate_to_Work', 28, 12, 39, 46, -1, 600, 0),
(111, '2025-07-23 19:49:30', 1, 10, 'customer_bank_allocation_deleted', 20, 12, 21, 15, 0, 69, 0),
(112, '2025-07-23 19:49:30', 1, 10, 'customer_bank_allocation_deleted', 20, 12, 21, 15, 0, 69, 0),
(113, '2025-07-23 19:49:30', 1, 10, 'customer_bank_allocation_deleted', 20, 12, 21, 15, 0, 69, 0),
(119, '2025-07-29 21:05:36', 1, 2200, 'raw_material_purchase', 29, 0, 0, 0, 2200, -1, -1),
(120, '2025-07-29 21:06:04', 1, 500, 'to_customer_bank', 29, 13, 41, 0, 1700, 500, -1),
(121, '2025-07-29 21:07:01', 1, 1000, 'to_customer_bank', 29, 12, 42, 0, 700, 1000, -1),
(122, '2025-07-29 21:09:29', 1, 600, 'customer_bank_allocate_to_Work', 29, 12, 42, 47, -1, 400, 0),
(123, '2025-07-30 07:38:13', 1, 500, 'to_customer_bank', 29, 9, 43, 0, 200, 500, -1),
(124, '2025-07-30 07:38:05', 1, 500, 'to_customer_bank', 29, 9, 46, 0, 200, 500, -1),
(125, '2025-07-30 19:53:10', 1, 100, 'to_customer_bank', 29, 12, 42, 0, 100, 500, -1),
(126, '2025-07-30 19:53:05', 1, 100, 'to_customer_bank', 29, 12, 42, 0, 100, 500, -1),
(127, '2025-07-30 19:57:32', 1, 100, 'customer_bank_allocate_to_Work', 29, 12, 42, 48, -1, 400, 0),
(128, '2025-08-01 12:55:27', 1, 300, 'customer_bank_allocate_to_Work', 29, 13, 41, 49, -1, 200, 0),
(129, '2025-08-01 12:55:27', 1, 300, 'customer_bank_allocate_to_Work', 29, 13, 41, 50, -1, 200, 0),
(130, '2025-08-09 22:19:47', 1, 100, 'raw_material_purchase', 30, 0, 0, 0, 100, -1, -1),
(131, '2025-08-09 22:51:58', 1, 30, 'to_customer_bank', 30, 12, 47, 0, 70, 30, -1),
(132, '2025-08-10 21:19:47', 1, 5, 'to_customer_bank', 20, 10, 20, 0, 0, 10, -1),
(133, '2025-08-12 14:16:01', 1, 302, 'raw_material_purchase', 31, 0, 0, 0, 302, -1, -1),
(134, '2025-08-12 14:17:52', 1, 302, 'to_customer_bank', 31, 12, 48, 0, 0, 302, -1),
(135, '2025-08-24 12:54:57', 1, 200, 'to_customer_bank', 28, 9, 49, 0, 4800, 200, -1),
(136, '2025-08-24 12:55:47', 1, 120, 'customer_bank_allocate_to_Work', 28, 9, 49, 51, -1, 80, 0),
(137, '2025-08-24 12:55:47', 1, 120, 'customer_bank_allocate_to_Work', 28, 9, 49, 52, -1, 80, 0),
(138, '2025-08-24 13:08:25', 1, 300, 'customer_bank_allocate_to_Work', 29, 9, 46, 53, -1, 200, 0),
(139, '2025-08-24 13:08:25', 1, 300, 'customer_bank_allocate_to_Work', 29, 9, 46, 54, -1, 200, 0),
(140, '2025-09-08 17:04:52', 1, 700, 'to_customer_bank', 28, 15, 50, 0, 4100, 700, -1),
(141, '2025-09-08 17:06:38', 1, 200, 'to_customer_bank', 21, 15, 51, 0, 200, 200, -1),
(142, '2025-09-08 17:07:24', 1, 100, 'customer_bank_allocate_to_Work', 21, 15, 51, 55, -1, 100, 0),
(143, '2025-09-08 17:09:03', 1, 500, 'customer_bank_allocate_to_Work', 28, 15, 50, 56, -1, 200, 0),
(144, '2025-10-29 08:52:44', 1, 500, 'raw_material_purchase', 21, 0, 0, 0, 700, -1, -1),
(148, '2025-11-15 13:26:30', 1, 4600, 'raw_material_purchase', 32, 0, 0, 0, 4600, -1, -1),
(149, '2025-11-15 13:59:44', 1, 5, 'raw_material_purchase', 33, 0, 0, 0, 5, -1, -1),
(150, '2025-11-15 14:00:38', 1, 1, 'to_customer_bank', 33, 10, 54, 0, 4, 230, -1),
(151, '2026-01-27 06:26:36', 1, 302, 'customer_bank_allocate_to_Work', 31, 12, 48, 59, -1, 0, 0),
(152, '2026-01-27 06:29:26', 1, 100, 'raw_material_purchase', 34, 0, 0, 0, 100, -1, -1),
(153, '2026-01-27 06:29:27', 1, 100, 'to_customer_bank', 34, 12, 55, 0, 0, 100, -1),
(154, '2026-01-27 06:35:18', 1, 1000, 'customer_bank_allocate_to_Work', 34, 12, 55, 60, -1, 1000, 0),
(155, '2026-01-27 06:38:37', 1, 1000, 'customer_bank_allocate_to_Work', 34, 12, 55, 61, -1, 0, 0),
(156, '2026-01-27 06:40:01', 1, 302, 'customer_bank_allocation_deleted', 31, 12, 48, 59, 0, 302, 0),
(157, '2026-01-27 06:38:37', 1, 1000, 'customer_bank_allocate_to_Work', 34, 12, 55, 62, -1, 0, 0),
(158, '2026-01-27 06:41:19', 1, 3000, 'raw_material_purchase', 34, 0, 0, 0, 3000, -1, -1),
(159, '2026-01-27 06:41:20', 1, 2000, 'to_customer_bank', 34, 12, 55, 0, 1000, 2000, -1),
(160, '2026-01-27 06:43:46', 1, 2000, 'customer_bank_allocate_to_Work', 34, 12, 55, 63, -1, 0, 0),
(161, '2026-01-27 06:45:03', 1, 1000, 'to_customer_bank', 34, 10, 56, 0, 0, 1000, -1),
(162, '2026-01-27 06:51:34', 1, 10000, 'raw_material_purchase', 34, 0, 0, 0, 10000, -1, -1),
(163, '2026-01-27 06:51:37', 1, 3000, 'to_customer_bank', 34, 16, 57, 0, 7000, 3000, -1),
(164, '2026-01-27 06:52:30', 1, 3000, 'customer_bank_allocate_to_Work', 34, 16, 57, 64, -1, 0, 0),
(165, '2026-01-27 06:58:44', 1, 5000, 'to_customer_bank', 34, 16, 57, 0, 2000, 5000, -1),
(166, '2026-01-27 07:01:08', 1, 3616, 'customer_bank_allocate_to_Work', 34, 16, 57, 65, -1, 1384, 0),
(167, '2026-02-16 14:45:44', 1, 100, 'raw_material_purchase', 35, 0, 0, 0, 100, -1, -1),
(168, '2026-02-16 14:47:27', 1, 6, 'customer_bank_allocate_to_Work', 35, 10, 58, 66, -1, 4, 0),
(169, '2026-02-21 12:40:18', 1, 200, 'customer_bank_allocate_to_Work', 33, 10, 54, 67, -1, 30, 0)
as new_transaction_history
ON DUPLICATE KEY UPDATE
`date`=new_transaction_history.`date`, `added_by`=new_transaction_history.`added_by`, `transaction_quantity`=new_transaction_history.`transaction_quantity`, `transaction_type`=new_transaction_history.`transaction_type`, `raw_material_id`=new_transaction_history.`raw_material_id`, `customer_id`=new_transaction_history.`customer_id`, `customer_bank_id`=new_transaction_history.`customer_bank_id`, `allocation_id`=new_transaction_history.`allocation_id`, `cur_raw_material_quantity`=new_transaction_history.`cur_raw_material_quantity`, `cur_customer_bank_quantity`=new_transaction_history.`cur_customer_bank_quantity`, `cur_banks_babies_allocation_quantity`=new_transaction_history.`cur_banks_babies_allocation_quantity`;", 'SELECT \'Table transaction_history does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# USER_CUSTOMERS
# ----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'user_customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `user_customers` (`user_id`, `customer_id`) 
VALUES
(3, 9),
(3, 10)
as new_user_customers
ON DUPLICATE KEY UPDATE
`user_id`=new_user_customers.`user_id`, `customer_id`=new_user_customers.`customer_id`;", 'SELECT \'Table user_customers does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# USER_ROLES
# ------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'user_roles');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `user_roles` (`user_id`, `role_id`) 
VALUES
(1, 1),
(2, 1),
(3, 2)
as new_user_roles
ON DUPLICATE KEY UPDATE
`user_id`=new_user_roles.`user_id`, `role_id`=new_user_roles.`role_id`;", 'SELECT \'Table user_roles does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# USERS
# -------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `email`, `password`, `is_verified`, `is_disabled`, `pending_verfication_code`, `verification_code_expiration`, `pending_new_email`, `pending_new_email_code`, `photo_url`, `phone`, `created_at`) 
VALUES
(1, 'Alon', 'Rotem', 'alrotem', 'alrotem@gmail.com', '$2b$10$VZrjHgOhn3JEWO/DQTv.n.9jnZGVnQKPXWskKpmMHRWBJ3bGyRAmq', 1, 0, '8DKLMLL9JY', null, null, null, '/uploads/images/users/1771246565523-profile.png', '', '2026-02-16 12:48:15'),
(2, 'Avi', 'Bar', 'avibar', 'aviouslybar@gmail.com', '$2b$10$biw0c4d384VDXHnMl7cIFu.aLiLm.89ZMcvs7yCbiNJq6j.yrHAMW', 1, 0, '', null, null, null, null, null, '2026-02-16 12:51:11'),
(3, 'Alon', 'Rotem', 'alrotem2', 'alrotem@walla.co.il', '$2b$10$hBmbDuLRlXCAVTgRXgQRCOtQpPqp3F9j1sos3SXK8.V.77CwS4yXu', 1, 0, '', null, null, null, null, null, '2026-02-18 22:10:45')
as new_users
ON DUPLICATE KEY UPDATE
`firstname`=new_users.`firstname`, `lastname`=new_users.`lastname`, `username`=new_users.`username`, `email`=new_users.`email`, `password`=new_users.`password`, `is_verified`=new_users.`is_verified`, `is_disabled`=new_users.`is_disabled`, `pending_verfication_code`=new_users.`pending_verfication_code`, `verification_code_expiration`=new_users.`verification_code_expiration`, `pending_new_email`=new_users.`pending_new_email`, `pending_new_email_code`=new_users.`pending_new_email_code`, `photo_url`=new_users.`photo_url`, `phone`=new_users.`phone`, `created_at`=new_users.`created_at`;", 'SELECT \'Table users does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# WINGS
# -------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'wings');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `wings` (`id`, `name`, `knife`, `crown_width`, `split_l1`, `allow_shortening_babies_in_pairs`) 
VALUES
(39, 'DM 159', 9, 2, 1, 0),
(40, 'DM 15920250622173304', 9, 2, 1, 0),
(45, 'RT10020250623231901', 10, 2, 1, 0),
(46, 'RT6520250624130301', 6.5, 2, 1, 0),
(47, 'RT8520250624203715', 10, 2, 1, 0),
(48, 'RT7020250624204219', 10, 2, 1, 0),
(49, 'RT11020250626231306', 12, 2, 1, 0),
(54, 'RT95 BM20250701155505', 12, 2, 1, 0),
(55, 'RT8520250702182642', 10, 2, 1, 0),
(57, 'RT9020250703232909', 12.5, 2, 1, 0),
(58, 'RT7020250703234426', 10, 2, 1, 0),
(59, 'DM 15920250705112745', 9, 2, 1, 0),
(60, 'RT9520250709230442', 10, 2, 1, 0),
(62, 'RT8520250710012430', 10, 2, 1, 0),
(64, 'Adiel20250710013901', 7, 2, 1, 0),
(65, 'DM 15920250715180835', 9, 2, 1, 0),
(66, 'Emerals20250715181318', 10, 2, 1, 0),
(67, 'RT852025062301133120250721113812', 10, 2, 1, 0),
(68, 'RT8520250724154846', 10, 2, 1, 0),
(69, 'RT8520250724155508', 10, 2, 1, 0),
(70, 'RT10020250724160801', 12, 2, 1, 0),
(72, '10516620250725150944', 12, 2, 1, 0),
(74, 'RT100 1217 T20250727180311', 12.5, 2, 3, 1),
(75, '10516620250728010821', 12, 3, 3, 0),
(76, 'RT1217 BM20250729125337', 12.5, 2, 1, 1),
(78, 'RT9520250729171157', 12.5, 3, 1, 0),
(80, 'C920250808200705', 10, 3, 1, 0),
(81, 'RT9520250815225337', 12.5, 3, 1, 0),
(82, 'RT11020250824095702', 12, 2, 1, 0),
(83, 'RT10020250910111445', 12, 2.5, 1, 0),
(84, 'RT9520250914131638', 12.5, 2.5, 1, 0),
(85, 'Adiel20250922143327', 7, 2, 1, 0),
(86, 'Adiel2025092214332720250922143444', 7, 2, 1, 0),
(87, 'C920251015160109', 10, 2, 1, 0),
(88, 'RT9520251018121217', 12.5, 2.5, 1, 0),
(89, 'RT952025101812121720251018122153', 12.5, 2.3, 1, 0),
(90, 'RT159', 9, 2, 1, 0),
(91, 'RT 115-155 (C7.5)', 11.5, 2.5, 2, 0),
(92, 'RT 7130 C9', 7, 2, 2, 0),
(93, 'RT 8130', 0, 2, 1, 0),
(94, 'O-10135', 0, 2, 1, 0),
(95, 'RT 115-155 (C10)', 11.5, 2.5, 1, 0),
(96, 'RT 115-155 (C9)', 11.5, 2.5, 1, 0),
(97, 'RT 115-155 (C7.5)20260116165354', 11.5, 2.5, 2, 0),
(98, 'DM 15920260121140651', 9, 2, 1, 0)
as new_wings
ON DUPLICATE KEY UPDATE
`name`=new_wings.`name`, `knife`=new_wings.`knife`, `crown_width`=new_wings.`crown_width`, `split_l1`=new_wings.`split_l1`, `allow_shortening_babies_in_pairs`=new_wings.`allow_shortening_babies_in_pairs`;", 'SELECT \'Table wings does not exist\'');
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
(761, 39, 'TOP', 10),
(762, 39, 'C1', 10.5),
(763, 39, 'C2', 9.5),
(764, 39, 'C3', 10),
(765, 39, 'C4', 9.5),
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
(897, 46, 'R7', 9.5),
(898, 47, 'TOP', 8.5),
(899, 47, 'C1', 10),
(900, 47, 'C2', 9),
(901, 47, 'L1', 5.5),
(902, 47, 'L2', 6),
(903, 47, 'L3', 6.5),
(904, 47, 'L4', 7),
(905, 47, 'L5', 7.5),
(906, 47, 'L6', 8),
(907, 47, 'R1', 5.5),
(908, 47, 'R2', 6),
(909, 47, 'R3', 6.5),
(910, 47, 'R4', 7),
(911, 47, 'R5', 7.5),
(912, 47, 'R6', 8),
(913, 48, 'TOP', 7),
(914, 48, 'C1', 7),
(915, 48, 'L1', 5.5),
(916, 48, 'L2', 6),
(917, 48, 'L3', 6.5),
(918, 48, 'L4', 7),
(919, 48, 'L5', 7),
(920, 48, 'L6', 7),
(921, 48, 'R1', 5.5),
(922, 48, 'R2', 6),
(923, 48, 'R3', 6.5),
(924, 48, 'R4', 7),
(925, 49, 'TOP', 10),
(926, 49, 'C1', 10),
(927, 49, 'C2', 10),
(928, 49, 'C3', 10),
(929, 49, 'L1', 5.5),
(930, 49, 'L2', 6),
(931, 49, 'L3', 7),
(932, 49, 'L4', 7),
(933, 49, 'L5', 8),
(934, 49, 'L6', 9),
(935, 49, 'L7', 9.5),
(936, 49, 'R1', 5.5),
(937, 49, 'R2', 6),
(938, 49, 'R3', 6.5),
(939, 49, 'R4', 7.5),
(940, 49, 'R5', 8.5),
(941, 49, 'R6', 9),
(942, 49, 'R7', 9.5),
(1016, 54, 'TOP', 9.5),
(1017, 54, 'C1', 10),
(1018, 54, 'C2', 10),
(1019, 54, 'C3', 10),
(1020, 54, 'L1', 6),
(1021, 54, 'L2', 6.5),
(1022, 54, 'L3', 7),
(1023, 54, 'L4', 7.5),
(1024, 54, 'L5', 8),
(1025, 54, 'L6', 8.5),
(1026, 54, 'L7', 9.5),
(1027, 54, 'R1', 5.5),
(1028, 54, 'R2', 6.5),
(1029, 54, 'R3', 7.5),
(1030, 54, 'R4', 8.5),
(1031, 54, 'R5', 9),
(1032, 55, 'TOP', 8.5),
(1033, 55, 'C1', 11),
(1034, 55, 'C2', 11),
(1035, 55, 'L1', 5.5),
(1036, 55, 'L2', 6),
(1037, 55, 'L3', 6.5),
(1038, 55, 'L4', 7),
(1039, 55, 'L5', 7.5),
(1040, 55, 'L6', 8),
(1041, 55, 'R1', 5.5),
(1042, 55, 'R2', 6),
(1043, 55, 'R3', 6.5),
(1044, 55, 'R4', 7),
(1045, 55, 'R5', 7.5),
(1046, 55, 'R6', 8),
(1063, 57, 'TOP', 9),
(1064, 57, 'C1', 10),
(1065, 57, 'C2', 10),
(1066, 57, 'C3', 10),
(1067, 57, 'L1', 5.5),
(1068, 57, 'L2', 6),
(1069, 57, 'L3', 6.5),
(1070, 57, 'L4', 7),
(1071, 57, 'L5', 7.5),
(1072, 57, 'L6', 8),
(1073, 57, 'L7', 8.5),
(1074, 57, 'R1', 6),
(1075, 57, 'R2', 6.5),
(1076, 57, 'R3', 7),
(1077, 57, 'R4', 7.5),
(1078, 57, 'R5', 8),
(1079, 58, 'TOP', 7),
(1080, 58, 'C1', 7),
(1081, 58, 'L1', 5.5),
(1082, 58, 'L2', 6),
(1083, 58, 'L3', 6.5),
(1084, 58, 'L4', 7),
(1085, 58, 'L5', 7),
(1086, 58, 'L6', 7),
(1087, 58, 'R1', 5.5),
(1088, 58, 'R2', 6),
(1089, 58, 'R3', 6.5),
(1090, 58, 'R4', 7),
(1091, 59, 'TOP', 9),
(1092, 59, 'C1', 9.5),
(1093, 59, 'C2', 9),
(1094, 59, 'C3', 9),
(1095, 59, 'C4', 9),
(1096, 59, 'L1', 6),
(1097, 59, 'L2', 6),
(1098, 59, 'L3', 6),
(1099, 59, 'L4', 6),
(1100, 59, 'L5', 6.5),
(1101, 59, 'L6', 7),
(1102, 59, 'L7', 7.5),
(1103, 59, 'L8', 8),
(1104, 59, 'L9', 8.5),
(1105, 59, 'R1', 5.5),
(1106, 59, 'R2', 6),
(1107, 59, 'R3', 6.5),
(1108, 59, 'R4', 7),
(1109, 59, 'R5', 7.5),
(1110, 59, 'R6', 8),
(1111, 59, 'R7', 8.5),
(1112, 60, 'TOP', 9.5),
(1113, 60, 'C1', 9),
(1114, 60, 'C2', 9),
(1115, 60, 'C3', 9),
(1116, 60, 'C4', 9),
(1117, 60, 'L1', 5.5),
(1118, 60, 'L2', 6),
(1119, 60, 'L3', 6.5),
(1120, 60, 'L4', 7),
(1121, 60, 'L5', 7.5),
(1122, 60, 'L6', 8),
(1123, 60, 'L7', 8.5),
(1124, 60, 'L8', 9),
(1125, 60, 'L9', 9),
(1126, 60, 'R1', 5.5),
(1127, 60, 'R2', 6),
(1128, 60, 'R3', 6.5),
(1129, 60, 'R4', 7),
(1130, 60, 'R5', 7.5),
(1131, 60, 'R6', 8),
(1132, 60, 'R7', 8.5),
(1147, 62, 'TOP', 8.5),
(1148, 62, 'C1', 10),
(1149, 62, 'C2', 9),
(1150, 62, 'L1', 5.5),
(1151, 62, 'L2', 6),
(1152, 62, 'L3', 6.5),
(1153, 62, 'L4', 7),
(1154, 62, 'L5', 7.5),
(1155, 62, 'L6', 8),
(1156, 62, 'R1', 5.5),
(1157, 62, 'R2', 6),
(1158, 62, 'R3', 6.5),
(1159, 62, 'R4', 7),
(1160, 62, 'R5', 7.5),
(1161, 62, 'R6', 8),
(1178, 64, 'TOP', 9),
(1179, 64, 'C1', 8),
(1180, 64, 'C2', 8),
(1181, 64, 'C3', 8),
(1182, 64, 'L1', 5.5),
(1183, 64, 'L2', 6),
(1184, 64, 'L3', 6.5),
(1185, 64, 'L4', 7),
(1186, 64, 'L5', 7.5),
(1187, 64, 'L6', 8),
(1188, 64, 'L7', 8.5),
(1189, 64, 'R1', 5.5),
(1190, 64, 'R2', 6),
(1191, 64, 'R3', 6.5),
(1192, 64, 'R4', 7),
(1193, 64, 'R5', 7.5),
(1194, 65, 'TOP', 10),
(1195, 65, 'C1', 10),
(1196, 65, 'C2', 10),
(1197, 65, 'C3', 10),
(1198, 65, 'C4', 10),
(1199, 65, 'L1', 6),
(1200, 65, 'L2', 6),
(1201, 65, 'L3', 6.5),
(1202, 65, 'L4', 7),
(1203, 65, 'L5', 7.5),
(1204, 65, 'L6', 8),
(1205, 65, 'L7', 8.5),
(1206, 65, 'L8', 9),
(1207, 65, 'L9', 9.5),
(1208, 65, 'R1', 5.5),
(1209, 65, 'R2', 6),
(1210, 65, 'R3', 6.5),
(1211, 65, 'R4', 7),
(1212, 65, 'R5', 7.5),
(1213, 65, 'R6', 8),
(1214, 65, 'R7', 9),
(1215, 66, 'TOP', 10),
(1216, 66, 'C1', 9),
(1217, 66, 'C2', 9),
(1218, 66, 'C3', 9),
(1219, 66, 'L1', 5.5),
(1220, 66, 'L2', 6),
(1221, 66, 'L3', 6.5),
(1222, 66, 'L4', 7),
(1223, 66, 'L5', 8),
(1224, 66, 'L6', 9),
(1225, 66, 'R1', 5.5),
(1226, 66, 'R2', 6.5),
(1227, 66, 'R3', 7.5),
(1228, 66, 'R4', 8.5),
(1229, 67, 'TOP', 8),
(1230, 67, 'C1', 11),
(1231, 67, 'C2', 11),
(1232, 67, 'L1', 5.5),
(1233, 67, 'L2', 6),
(1234, 67, 'L3', 6),
(1235, 67, 'L4', 6.5),
(1236, 67, 'L5', 7),
(1237, 67, 'L6', 7.5),
(1238, 67, 'R1', 5.5),
(1239, 67, 'R2', 6),
(1240, 67, 'R3', 6),
(1241, 67, 'R4', 6.5),
(1242, 67, 'R5', 7),
(1243, 67, 'R6', 7.5),
(1244, 68, 'TOP', 8.5),
(1245, 68, 'C1', 10),
(1246, 68, 'C2', 9),
(1247, 68, 'L1', 5.5),
(1248, 68, 'L2', 6),
(1249, 68, 'L3', 6.5),
(1250, 68, 'L4', 7),
(1251, 68, 'L5', 7.5),
(1252, 68, 'L6', 8),
(1253, 68, 'R1', 5.5),
(1254, 68, 'R2', 6),
(1255, 68, 'R3', 6.5),
(1256, 68, 'R4', 7),
(1257, 68, 'R5', 7.5),
(1258, 68, 'R6', 8),
(1259, 69, 'TOP', 8.5),
(1260, 69, 'C1', 10),
(1261, 69, 'C2', 9),
(1262, 69, 'L1', 5.5),
(1263, 69, 'L2', 6),
(1264, 69, 'L3', 6.5),
(1265, 69, 'L4', 7),
(1266, 69, 'L5', 7.5),
(1267, 69, 'L6', 8),
(1268, 69, 'R1', 5.5),
(1269, 69, 'R2', 6),
(1270, 69, 'R3', 6.5),
(1271, 69, 'R4', 7),
(1272, 69, 'R5', 7.5),
(1273, 69, 'R6', 8),
(1274, 70, 'TOP', 9),
(1275, 70, 'C1', 9.5),
(1276, 70, 'C2', 9),
(1277, 70, 'C3', 9),
(1278, 70, 'C4', 9),
(1279, 70, 'L1', 5.5),
(1280, 70, 'L2', 6),
(1281, 70, 'L3', 6.5),
(1282, 70, 'L4', 7),
(1283, 70, 'L5', 7.5),
(1284, 70, 'L6', 8),
(1285, 70, 'L7', 8.5),
(1286, 70, 'R1', 5.5),
(1287, 70, 'R2', 6),
(1288, 70, 'R3', 6.5),
(1289, 70, 'R4', 7),
(1290, 70, 'R5', 8),
(1291, 70, 'R6', 8.5),
(1326, 72, 'TOP', 10.5),
(1327, 72, 'C1', 10),
(1328, 72, 'C2', 10),
(1329, 72, 'C3', 10),
(1330, 72, 'C4', 10),
(1331, 72, 'L1', 5.5),
(1332, 72, 'L2', 7.5),
(1333, 72, 'L3', 7.5),
(1334, 72, 'L4', 8),
(1335, 72, 'L5', 8.5),
(1336, 72, 'L6', 9.5),
(1337, 72, 'R1', 5),
(1338, 72, 'R2', 5.5),
(1339, 72, 'R3', 6),
(1340, 72, 'R4', 8),
(1341, 72, 'R5', 8.5),
(1342, 72, 'R6', 9.5),
(1479, 74, 'C1', 6),
(1480, 74, 'C2', 8),
(1481, 74, 'C3', 12),
(1482, 74, 'L1', 6),
(1483, 74, 'L10', 8),
(1484, 74, 'L11', 8.5),
(1485, 74, 'L12', 8.5),
(1486, 74, 'L13', 9),
(1487, 74, 'L14', 9),
(1488, 74, 'L15', 9.5),
(1489, 74, 'L16', 10),
(1490, 74, 'L2', 6),
(1491, 74, 'L3', 6.5),
(1492, 74, 'L4', 6.5),
(1493, 74, 'L5', 7),
(1494, 74, 'L6', 7),
(1495, 74, 'L7', 7.5),
(1496, 74, 'L8', 7.5),
(1497, 74, 'L9', 8),
(1498, 74, 'R1', 5.5),
(1499, 74, 'R10', 8),
(1500, 74, 'R11', 8.5),
(1501, 74, 'R12', 9),
(1502, 74, 'R13', 9.5),
(1503, 74, 'R2', 6),
(1504, 74, 'R3', 6),
(1505, 74, 'R4', 6.5),
(1506, 74, 'R5', 6.5),
(1507, 74, 'R6', 7),
(1508, 74, 'R7', 7),
(1509, 74, 'R8', 7.5),
(1510, 74, 'R9', 7.5),
(1511, 74, 'TOP', 10),
(1512, 75, 'C1', 9.5),
(1513, 75, 'C2', 10),
(1514, 75, 'C3', 10),
(1515, 75, 'C4', 9),
(1516, 75, 'L1', 5.5),
(1517, 75, 'L2', 7),
(1518, 75, 'L3', 7.5),
(1519, 75, 'L4', 8),
(1520, 75, 'L5', 8.5),
(1521, 75, 'L6', 9.5),
(1522, 75, 'R1', 5),
(1523, 75, 'R2', 5.5),
(1524, 75, 'R3', 6),
(1525, 75, 'R4', 8),
(1526, 75, 'R5', 8.5),
(1527, 75, 'R6', 9.5),
(1528, 75, 'TOP', 10),
(1529, 76, 'C1', 10),
(1530, 76, 'C2', 10),
(1531, 76, 'L1', 5.5),
(1532, 76, 'L2', 6),
(1533, 76, 'L3', 6.5),
(1534, 76, 'L4', 7),
(1535, 76, 'L5', 7.5),
(1536, 76, 'L6', 8),
(1537, 76, 'L7', 8.5),
(1538, 76, 'L8', 9),
(1539, 76, 'R1', 5.5),
(1540, 76, 'R2', 6.5),
(1541, 76, 'R3', 7.5),
(1542, 76, 'R4', 8.5),
(1543, 76, 'R5', 9),
(1544, 76, 'TOP', 9.5),
(1562, 78, 'C1', 9),
(1563, 78, 'C2', 9),
(1564, 78, 'C3', 9),
(1565, 78, 'C4', 9),
(1566, 78, 'L1', 5.5),
(1567, 78, 'L2', 6),
(1568, 78, 'L3', 6.5),
(1569, 78, 'L4', 7),
(1570, 78, 'L5', 7.5),
(1571, 78, 'L6', 8),
(1572, 78, 'L7', 8.5),
(1573, 78, 'L8', 9),
(1574, 78, 'L9', 9),
(1575, 78, 'R1', 5.5),
(1576, 78, 'R2', 6),
(1577, 78, 'R3', 6.5),
(1578, 78, 'R4', 7),
(1579, 78, 'R5', 7.5),
(1580, 78, 'R6', 8),
(1581, 78, 'R7', 8.5),
(1582, 78, 'TOP', 9.5),
(1596, 80, 'L1', 6),
(1597, 80, 'L2', 6.5),
(1598, 80, 'L3', 7),
(1599, 80, 'L4', 7.5),
(1600, 80, 'L5', 8),
(1601, 80, 'L6', 8.5),
(1602, 80, 'L7', 9),
(1603, 80, 'L8', 9.5),
(1604, 80, 'R1', 5.5),
(1605, 80, 'R2', 6),
(1606, 80, 'R3', 7),
(1607, 80, 'R4', 8),
(1608, 80, 'R5', 9),
(1609, 80, 'TOP', 10),
(1610, 80, 'C4', 9.5),
(1611, 80, 'C1', 9),
(1612, 80, 'C2', 10),
(1613, 80, 'C3', 10),
(1614, 81, 'C1', 9),
(1615, 81, 'C2', 9),
(1616, 81, 'C3', 9),
(1617, 81, 'C4', 9),
(1618, 81, 'L1', 5.5),
(1619, 81, 'L2', 6),
(1620, 81, 'L3', 6.5),
(1621, 81, 'L4', 7),
(1622, 81, 'L5', 7.5),
(1623, 81, 'L6', 8),
(1624, 81, 'L7', 8.5),
(1625, 81, 'L8', 9),
(1626, 81, 'L9', 9),
(1627, 81, 'R1', 5.5),
(1628, 81, 'R2', 6),
(1629, 81, 'R3', 6.5),
(1630, 81, 'R4', 7),
(1631, 81, 'R5', 7.5),
(1632, 81, 'R6', 8),
(1633, 81, 'R7', 8.5),
(1634, 81, 'TOP', 9.5),
(1635, 82, 'L1', 5.5),
(1636, 82, 'L2', 6),
(1637, 82, 'L3', 7),
(1638, 82, 'L4', 7),
(1639, 82, 'L5', 8),
(1640, 82, 'L6', 9),
(1641, 82, 'L7', 9.5),
(1642, 82, 'R1', 5.5),
(1643, 82, 'R2', 6),
(1644, 82, 'R3', 6.5),
(1645, 82, 'R4', 7.5),
(1646, 82, 'R5', 8.5),
(1647, 82, 'R6', 9),
(1648, 82, 'R7', 9.5),
(1649, 82, 'TOP', 10),
(1650, 82, 'C1', 9.5),
(1651, 82, 'C2', 10),
(1652, 82, 'C3', 9.5),
(1653, 83, 'C1', 9.5),
(1654, 83, 'C2', 10),
(1655, 83, 'C3', 10),
(1656, 83, 'C4', 9.5),
(1657, 83, 'L1', 5.5),
(1658, 83, 'L2', 6),
(1659, 83, 'L3', 6.5),
(1660, 83, 'L4', 7),
(1661, 83, 'L5', 7.5),
(1662, 83, 'L6', 8),
(1663, 83, 'L7', 9),
(1664, 83, 'R1', 5.5),
(1665, 83, 'R2', 6),
(1666, 83, 'R3', 6.5),
(1667, 83, 'R4', 7),
(1668, 83, 'R5', 8),
(1669, 83, 'R6', 9),
(1670, 83, 'TOP', 10),
(1671, 84, 'L1', 5.5),
(1672, 84, 'L2', 6),
(1673, 84, 'L3', 6.5),
(1674, 84, 'L4', 7),
(1675, 84, 'L5', 7.5),
(1676, 84, 'L6', 8),
(1677, 84, 'L7', 8.5),
(1678, 84, 'L8', 9),
(1679, 84, 'L9', 9),
(1680, 84, 'R1', 5.5),
(1681, 84, 'R2', 6),
(1682, 84, 'R3', 6.5),
(1683, 84, 'R4', 7),
(1684, 84, 'R5', 7.5),
(1685, 84, 'R6', 8),
(1686, 84, 'R7', 8.5),
(1687, 84, 'TOP', 9.5),
(1688, 84, 'C1', 8.5),
(1689, 84, 'C2', 9),
(1690, 84, 'C3', 8.5),
(1691, 85, 'C1', 8),
(1692, 85, 'C2', 8),
(1693, 85, 'C3', 8),
(1694, 85, 'L1', 5.5),
(1695, 85, 'L2', 6),
(1696, 85, 'L3', 6.5),
(1697, 85, 'L4', 7),
(1698, 85, 'L5', 7.5),
(1699, 85, 'L6', 8),
(1700, 85, 'L7', 8.5),
(1701, 85, 'R1', 5.5),
(1702, 85, 'R2', 6),
(1703, 85, 'R3', 6.5),
(1704, 85, 'R4', 7),
(1705, 85, 'R5', 7.5),
(1706, 85, 'TOP', 9),
(1707, 86, 'C1', 8),
(1708, 86, 'C2', 8),
(1709, 86, 'C3', 8),
(1710, 86, 'L1', 5.5),
(1711, 86, 'L2', 6),
(1712, 86, 'L3', 6.5),
(1713, 86, 'L4', 7),
(1714, 86, 'L5', 7.5),
(1715, 86, 'L6', 8),
(1716, 86, 'L7', 8.5),
(1717, 86, 'R1', 5.5),
(1718, 86, 'R2', 6),
(1719, 86, 'R3', 6.5),
(1720, 86, 'R4', 7),
(1721, 86, 'R5', 7.5),
(1722, 86, 'TOP', 9),
(1723, 87, 'C1', 10),
(1724, 87, 'C2', 10),
(1725, 87, 'C3', 10),
(1726, 87, 'C4', 10),
(1727, 87, 'L1', 6),
(1728, 87, 'L2', 6.5),
(1729, 87, 'L3', 7),
(1730, 87, 'L4', 7.5),
(1731, 87, 'L5', 8),
(1732, 87, 'L6', 8.5),
(1733, 87, 'L7', 9),
(1734, 87, 'L8', 9.5),
(1735, 87, 'R1', 5.5),
(1736, 87, 'R2', 6),
(1737, 87, 'R3', 7),
(1738, 87, 'R4', 8),
(1739, 87, 'R5', 9),
(1740, 87, 'TOP', 10),
(1741, 88, 'L1', 6),
(1742, 88, 'L2', 6),
(1743, 88, 'L3', 6.5),
(1744, 88, 'L4', 7),
(1745, 88, 'L5', 8),
(1746, 88, 'L6', 8),
(1747, 88, 'L7', 8.5),
(1748, 88, 'L8', 9),
(1749, 88, 'L9', 9),
(1750, 88, 'R1', 5.5),
(1751, 88, 'R2', 6),
(1752, 88, 'R3', 6),
(1753, 88, 'R4', 7),
(1754, 88, 'R5', 7.5),
(1755, 88, 'R6', 8),
(1756, 88, 'R7', 8.5),
(1757, 88, 'TOP', 9.5),
(1758, 88, 'C4', 8.5),
(1759, 88, 'C1', 8),
(1760, 88, 'C2', 9),
(1761, 88, 'C3', 9),
(1762, 89, 'L1', 6),
(1763, 89, 'L2', 6),
(1764, 89, 'L3', 6.5),
(1765, 89, 'L4', 7),
(1766, 89, 'L5', 8),
(1767, 89, 'L6', 8),
(1768, 89, 'L7', 8.5),
(1769, 89, 'L8', 9),
(1770, 89, 'L9', 9),
(1771, 89, 'R1', 5.5),
(1772, 89, 'R2', 6),
(1773, 89, 'R3', 6),
(1774, 89, 'R4', 7),
(1775, 89, 'R5', 7.5),
(1776, 89, 'R6', 8),
(1777, 89, 'R7', 8.5),
(1778, 89, 'TOP', 9.5),
(1779, 89, 'C4', 8.5),
(1780, 89, 'C1', 8),
(1781, 89, 'C2', 9),
(1782, 89, 'C3', 9),
(1783, 92, 'TOP', 9),
(1784, 92, 'L1', 6),
(1785, 92, 'L2', 6.5),
(1786, 92, 'L3', 7),
(1787, 92, 'L4', 7.5),
(1788, 92, 'L5', 8),
(1789, 92, 'L6', 8.5),
(1790, 92, 'L7', 8.5),
(1791, 92, 'R1', 5.5),
(1792, 92, 'R2', 6.5),
(1793, 92, 'R3', 7),
(1794, 92, 'R4', 7.5),
(1795, 92, 'R5', 8),
(1796, 92, 'R6', 8.5),
(1797, 92, 'C1', 10),
(1798, 92, 'C2', 10),
(1799, 91, 'L1', 6.5),
(1800, 91, 'L2', 8.5),
(1801, 91, 'L3', 8.5),
(1802, 91, 'L4', 8.5),
(1803, 91, 'L5', 8.5),
(1804, 91, 'L6', 8.5),
(1805, 91, 'L7', 8.5),
(1806, 91, 'R1', 6),
(1807, 91, 'R2', 6),
(1808, 91, 'R3', 6.5),
(1809, 91, 'R4', 6.5),
(1810, 91, 'R5', 7),
(1811, 91, 'R6', 7),
(1812, 91, 'TOP', 7.5),
(1813, 91, 'L8', 7),
(1814, 91, 'L9', 7),
(1815, 91, 'L10', 7),
(1816, 91, 'L11', 7),
(1817, 91, 'L12', 7),
(1818, 91, 'C1', 10),
(1819, 91, 'C2', 10),
(1820, 91, 'C3', 10),
(1821, 91, 'C4', 10),
(1822, 96, 'L1', 6.5),
(1823, 96, 'L2', 6.5),
(1824, 96, 'L3', 6.5),
(1825, 96, 'L4', 7.5),
(1826, 96, 'L5', 7.5),
(1827, 96, 'L6', 7.5),
(1828, 96, 'L7', 7.5),
(1829, 96, 'L8', 7.5),
(1830, 96, 'L9', 7.5),
(1831, 96, 'R1', 5),
(1832, 96, 'R2', 5),
(1833, 96, 'R3', 6),
(1834, 96, 'R4', 6),
(1835, 96, 'R5', 8),
(1836, 96, 'R6', 8),
(1837, 96, 'R7', 8.5),
(1838, 96, 'R8', 8.5),
(1839, 96, 'R9', 8.5),
(1840, 96, 'TOP', 9),
(1841, 96, 'C1', 10),
(1842, 96, 'C2', 10),
(1843, 96, 'C3', 10),
(1844, 96, 'C4', 10),
(1845, 96, 'L10', 8),
(1846, 96, 'L11', 8),
(1847, 96, 'L12', 8),
(1848, 96, 'L13', 8.5),
(1849, 96, 'L14', 8.5),
(1850, 96, 'L15', 8.5),
(1874, 95, 'L1', 6.5),
(1875, 95, 'L2', 6.5),
(1876, 95, 'L3', 6.5),
(1877, 95, 'L4', 6.5),
(1878, 95, 'L5', 7.5),
(1879, 95, 'L6', 7.5),
(1880, 95, 'L7', 7.5),
(1881, 95, 'L8', 7.5),
(1882, 95, 'L9', 7.5),
(1883, 95, 'L10', 7.5),
(1884, 95, 'L11', 8),
(1885, 95, 'L12', 8),
(1886, 95, 'L13', 8),
(1887, 95, 'L14', 9),
(1888, 95, 'L15', 9),
(1889, 95, 'L16', 9),
(1890, 95, 'TOP', 10),
(1891, 95, 'R1', 5),
(1892, 95, 'R2', 5),
(1893, 95, 'R3', 6),
(1894, 95, 'R4', 6),
(1895, 95, 'R5', 8),
(1896, 95, 'R6', 8),
(1897, 95, 'R7', 8),
(1898, 95, 'R8', 9),
(1899, 95, 'R9', 9),
(1900, 95, 'R10', 9),
(1901, 95, 'C1', 10),
(1902, 95, 'C2', 10),
(1903, 95, 'C3', 10),
(1904, 95, 'C4', 10),
(1905, 97, 'C1', 9),
(1906, 97, 'C2', 9),
(1907, 97, 'C3', 9),
(1908, 97, 'C4', 9),
(1909, 97, 'L1', 6.5),
(1910, 97, 'L10', 7),
(1911, 97, 'L11', 7),
(1912, 97, 'L12', 7),
(1913, 97, 'L2', 8.5),
(1914, 97, 'L3', 8.5),
(1915, 97, 'L4', 8.5),
(1916, 97, 'L5', 8.5),
(1917, 97, 'L6', 8.5),
(1918, 97, 'L7', 8.5),
(1919, 97, 'L8', 7),
(1920, 97, 'L9', 7),
(1921, 97, 'R1', 6),
(1922, 97, 'R2', 6),
(1923, 97, 'R3', 6.5),
(1924, 97, 'R4', 6.5),
(1925, 97, 'R5', 7),
(1926, 97, 'R6', 7),
(1927, 97, 'TOP', 7.5),
(1928, 98, 'C1', 10.5),
(1929, 98, 'C2', 9.5),
(1930, 98, 'C3', 10),
(1931, 98, 'C4', 9.5),
(1932, 98, 'L1', 6),
(1933, 98, 'L2', 6),
(1934, 98, 'L3', 6.5),
(1935, 98, 'L4', 7),
(1936, 98, 'L5', 7.5),
(1937, 98, 'L6', 8),
(1938, 98, 'L7', 8.5),
(1939, 98, 'L8', 9),
(1940, 98, 'L9', 9.5),
(1941, 98, 'R1', 5.5),
(1942, 98, 'R2', 6),
(1943, 98, 'R3', 6.5),
(1944, 98, 'R4', 7),
(1945, 98, 'R5', 7.5),
(1946, 98, 'R6', 8),
(1947, 98, 'R7', 9),
(1948, 98, 'TOP', 10),
(1949, 90, 'L1', 6),
(1950, 90, 'L2', 6.5),
(1951, 90, 'L3', 7),
(1952, 90, 'L4', 7.5),
(1953, 90, 'L5', 8),
(1954, 90, 'L6', 8.5),
(1955, 90, 'L7', 9),
(1956, 90, 'L8', 9.5),
(1957, 90, 'R1', 5.5),
(1958, 90, 'R2', 6),
(1959, 90, 'R3', 6.5),
(1960, 90, 'R4', 7),
(1961, 90, 'R5', 7.5),
(1962, 90, 'R6', 8),
(1963, 90, 'R7', 8.5),
(1964, 90, 'TOP', 10),
(1965, 90, 'C1', 11),
(1966, 90, 'C2', 11),
(1967, 90, 'C3', 11)
as new_wings_babies
ON DUPLICATE KEY UPDATE
`parent_wing_id`=new_wings_babies.`parent_wing_id`, `position`=new_wings_babies.`position`, `length`=new_wings_babies.`length`;", 'SELECT \'Table wings_babies does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;


SET FOREIGN_KEY_CHECKS = 1;
