use inventory;
SET FOREIGN_KEY_CHECKS = 0;
SET @delete_records=TRUE;

# ========== DELETES ==========

# ACCOUNT_INVITES
# -----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'account_invites');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `account_invites` where @delete_records=TRUE;", 'SELECT \'Table account_invites does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ACCOUNT_INVITES_CUSTOMERS
# ---------------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'account_invites_customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `account_invites_customers` where @delete_records=TRUE;", 'SELECT \'Table account_invites_customers does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

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

# CUSTOMER_KNIVES
# -----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_knives');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `customer_knives` where @delete_records=TRUE;", 'SELECT \'Table customer_knives does not exist\'');
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

# WINGS_CUSTOMERS
# -----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'wings_customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "DELETE FROM `wings_customers` where @delete_records=TRUE;", 'SELECT \'Table wings_customers does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ========== INSERTS ==========

# ACCOUNT_INVITES
# -----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'account_invites');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `account_invites` (`id`, `firstname`, `lastname`, `email`, `inviter_user_id`, `created_account_user_id`, `account_creation_code`, `account_role_id`, `invite_status`, `is_demo_customer`, `create_new_customer`, `sent_date`, `last_update`) 
VALUES
(5, 'Alon', 'Rotem', 'alrotem@walla.co.il', 1, null, 'OJ75S190IX', 2, 'cancelled', 0, 0, '2026-04-20 13:37:23', '2026-04-20 13:39:26')
as new_account_invites
ON DUPLICATE KEY UPDATE
`firstname`=new_account_invites.`firstname`, `lastname`=new_account_invites.`lastname`, `email`=new_account_invites.`email`, `inviter_user_id`=new_account_invites.`inviter_user_id`, `created_account_user_id`=new_account_invites.`created_account_user_id`, `account_creation_code`=new_account_invites.`account_creation_code`, `account_role_id`=new_account_invites.`account_role_id`, `invite_status`=new_account_invites.`invite_status`, `is_demo_customer`=new_account_invites.`is_demo_customer`, `create_new_customer`=new_account_invites.`create_new_customer`, `sent_date`=new_account_invites.`sent_date`, `last_update`=new_account_invites.`last_update`;", 'SELECT \'Table account_invites does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ACCOUNT_INVITES_CUSTOMERS
# ---------------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'account_invites_customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `account_invites_customers` (`account_invite_id`, `customer_id`) 
VALUES
(5, 12)
as new_account_invites_customers
ON DUPLICATE KEY UPDATE
`account_invite_id`=new_account_invites_customers.`account_invite_id`, `customer_id`=new_account_invites_customers.`customer_id`;", 'SELECT \'Table account_invites_customers does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ACCOUNT_REQUESTS
# ------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'account_requests');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `account_requests` (`id`, `firstname`, `lastname`, `email`, `phone`, `details`, `request_date`, `last_update`, `approver_user_id`, `approved_account_user_id`, `is_demo_customer`, `account_role_id`, `request_status`, `address`, `business_name`) 
VALUES
(6, 'John', 'Smith', 'alrotem@walla.co.il', '0123456789', 'Please give me access', '2026-04-20 13:34:40', '2026-04-20 13:36:12', 0, null, 0, 0, 'declined', 'bul. Vitosha', 'Shkembe Inc.'),
(7, 'Moshik', 'Tzabary', 'moshik.tzabary@gmail.com', '0503333788', '', '2026-07-20 16:33:58', '2026-07-20 16:53:28', 1, 8, 0, 2, 'approved', '10 Derech HaMelech', 'אולפני קורל בע""מ')
as new_account_requests
ON DUPLICATE KEY UPDATE
`firstname`=new_account_requests.`firstname`, `lastname`=new_account_requests.`lastname`, `email`=new_account_requests.`email`, `phone`=new_account_requests.`phone`, `details`=new_account_requests.`details`, `request_date`=new_account_requests.`request_date`, `last_update`=new_account_requests.`last_update`, `approver_user_id`=new_account_requests.`approver_user_id`, `approved_account_user_id`=new_account_requests.`approved_account_user_id`, `is_demo_customer`=new_account_requests.`is_demo_customer`, `account_role_id`=new_account_requests.`account_role_id`, `request_status`=new_account_requests.`request_status`, `address`=new_account_requests.`address`, `business_name`=new_account_requests.`business_name`;", 'SELECT \'Table account_requests does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# ALLOCATION_BABIES
# -------------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'allocation_babies');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `allocation_babies` (`id`, `allocation_id`, `length`, `quantity`, `quantity_in_pending_orders`) 
VALUES
(27, 9, 12, 1300, 0),
(28, 9, 11.5, 1400, 0),
(29, 9, 11, 1800, 0),
(30, 9, 10.5, 1600, 0),
(31, 9, 10, 1500, 0),
(32, 9, 9.5, 2000, 0),
(33, 9, 9, 2000, 0),
(34, 9, 8.5, 2000, 0),
(35, 9, 8, 2000, 0),
(36, 9, 7.5, 2000, 0),
(37, 9, 7, 2000, 0),
(38, 9, 6.5, 1400, 0),
(39, 9, 6, 1200, 0),
(40, 9, 5.5, 1000, 0),
(41, 5, 11.5, 1000, 0),
(42, 5, 11, 80, 920),
(43, 5, 10.5, 1135, 365),
(44, 5, 10, 775, 725),
(45, 5, 9.5, 770, 730),
(46, 5, 9, 905, 595),
(47, 5, 8.5, 905, 595),
(48, 5, 8, 224, 1906),
(49, 5, 7.5, 124, 1906),
(50, 5, 7, 118, 1612),
(51, 5, 6.5, 412, 1088),
(52, 5, 6, 412, 1403),
(53, 5, 5.5, 1000, 0)
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
('CI', 'C??te d''Ivoire', 999),
('CK', 'Cook Islands', 999),
('CL', 'Chile', 999),
('CM', 'Cameroon', 999),
('CN', 'China', 999),
('CO', 'Colombia', 999),
('CR', 'Costa Rica', 999),
('CU', 'Cuba', 999),
('CV', 'Cabo Verde', 999),
('CW', 'Cura??ao', 999),
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
('EUR', 'EURO', '???', 20),
('RUB', 'Ruble', '???', 30),
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
(1, 12, 1, 270, 70, 'units', 0),
(2, 12, 2, 985, 495, 'units', 495),
(4, 17, 3, 1000, 500, 'units', 0),
(7, 21, 1, 1000000, 1000000, 'units', 0),
(8, 21, 1, 1000000, 1000000, 'units', 0),
(10, 10, 3, 500, 269, 'units', 0),
(12, 17, 2, 500, 0, 'units', 500),
(13, 17, 4, 200, 0, 'units', 0),
(14, 17, 5, 800, 800, 'units', 0)
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
(2, 1, 200, 0, 'babies', 0, 0),
(3, 2, 490, 0, 'tails', 0, 0),
(5, 4, 500, 500, 'babies', 0, 0),
(9, 10, 200, 200, 'babies', 0, 0),
(12, 12, 500, 500, 'tails', 0, 0),
(14, 13, 200, 200, 'tails', 0, 0),
(15, 10, 31, 31, 'tails', 0, 0)
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_hats` (`id`, `hat_material_id`, `crown_material_id`, `tails_material_id_r`, `wing_id`, `original_wing_name`, `customer_id`, `shorten_top_by`, `shorten_crown_by`, `wall_allocation_id`, `crown_allocation_id`, `tails_allocation_id_r`, `tails_overdraft_r`, `mayler_width`, `hr_width`, `crown_visible`, `crown_length`, `order_date`, `tails_material_id_l`, `tails_allocation_id_l`, `tails_overdraft_l`, `hl_width`) 
VALUES
(2, 3, 3, 2, 99, 'H&M T10.5 C11', 17, 0, 0, 5, 5, 0, 23, 0.17, 0.17, 11, 11, null, 2, 0, 23, 0.17),
(3, 3, 3, 2, 100, 'H&M T10.5 C11', 17, 0, 0, 5, 5, 12, 92, 0.15, 0.17, 7.5, 11, null, 2, 12, 92, 0.17),
(4, 3, 3, 2, 102, 'DM 159 2', 17, 0, 0, 5, 5, 12, 45, 0.17, 0.17, 7, 10.5, null, 2, 12, 45, 0.17),
(5, 3, 3, 2, 103, 'DM 159 1', 17, 0, 0, 5, 5, 12, 22.5, 0.17, 0.17, 7, 10.5, null, 2, 12, 22.5, 0.17),
(6, 3, 3, 4, 105, 'HM-3 95135 ', 17, 0, 0, 5, 5, 0, 147, 0.15, 0.17, 8, 8, null, 4, 0, 147, 0.17)
as new_customer_hats
ON DUPLICATE KEY UPDATE
`hat_material_id`=new_customer_hats.`hat_material_id`, `crown_material_id`=new_customer_hats.`crown_material_id`, `tails_material_id_r`=new_customer_hats.`tails_material_id_r`, `wing_id`=new_customer_hats.`wing_id`, `original_wing_name`=new_customer_hats.`original_wing_name`, `customer_id`=new_customer_hats.`customer_id`, `shorten_top_by`=new_customer_hats.`shorten_top_by`, `shorten_crown_by`=new_customer_hats.`shorten_crown_by`, `wall_allocation_id`=new_customer_hats.`wall_allocation_id`, `crown_allocation_id`=new_customer_hats.`crown_allocation_id`, `tails_allocation_id_r`=new_customer_hats.`tails_allocation_id_r`, `tails_overdraft_r`=new_customer_hats.`tails_overdraft_r`, `mayler_width`=new_customer_hats.`mayler_width`, `hr_width`=new_customer_hats.`hr_width`, `crown_visible`=new_customer_hats.`crown_visible`, `crown_length`=new_customer_hats.`crown_length`, `order_date`=new_customer_hats.`order_date`, `tails_material_id_l`=new_customer_hats.`tails_material_id_l`, `tails_allocation_id_l`=new_customer_hats.`tails_allocation_id_l`, `tails_overdraft_l`=new_customer_hats.`tails_overdraft_l`, `hl_width`=new_customer_hats.`hl_width`;", 'SELECT \'Table customer_hats does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CUSTOMER_KNIVES
# -----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_knives');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_knives` (`customer_id`, `knife`) 
VALUES
(10, 5),
(10, 7),
(10, 9),
(10, 12),
(10, 5),
(10, 7),
(10, 9),
(10, 12),
(10, 5),
(10, 7),
(10, 9),
(10, 12),
(10, 5),
(10, 7),
(10, 9),
(10, 12)
as new_customer_knives
ON DUPLICATE KEY UPDATE
`customer_id`=new_customer_knives.`customer_id`, `knife`=new_customer_knives.`knife`;", 'SELECT \'Table customer_knives does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CUSTOMERS
# -----------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customers` (`id`, `name`, `business_name`, `email`, `phone`, `tax_id`, `customer_code`, `notes`, `allow_calculation_advisor`, `is_demo_customer`, `address`, `created_at`, `updated_at`, `created_by`, `updated_by`, `order_seq_number`) 
VALUES
(10, 'Avi Bar', 'Rom Tech Ltd ', 'avi_bar@mail.com', '+359 87 985 8868', 'Tax payer 5678', 'AB', null, 1, 0, null, '2025-01-06 20:05:29', '2026-07-03 10:44:02', 1, 1, 35),
(12, 'London', 'Tiferes Inc', 'tiferes.adler@gmail.com', '1-845-558-0778', '456456', 'L', null, 1, 0, null, '2025-02-24 22:19:45', '2026-03-27 10:16:39', 0, 0, 28),
(17, 'H&M', 'Shaniners Sachar Ltd', 's0548523233@gmail.com', '+972 54-852-3233', '517087078', 'H&M', null, 0, 0, null, '2026-03-11 15:55:25', '2026-06-23 08:36:35', 0, 0, 16),
(18, 'MT', 'King', 'Meir2400@gmail.com', '+972 50-907-5900', '39425566', 'K', null, 0, 0, null, '2026-03-11 16:06:02', '2026-03-11 16:06:02', 0, 0, 1),
(21, 'לקוח דמי', 'DEMO LTD', 'avi@mail.com', null, null, null, null, 0, 1, null, '2026-04-17 11:45:25', '2026-04-29 12:46:53', 1, 1, 1)
as new_customers
ON DUPLICATE KEY UPDATE
`name`=new_customers.`name`, `business_name`=new_customers.`business_name`, `email`=new_customers.`email`, `phone`=new_customers.`phone`, `tax_id`=new_customers.`tax_id`, `customer_code`=new_customers.`customer_code`, `notes`=new_customers.`notes`, `allow_calculation_advisor`=new_customers.`allow_calculation_advisor`, `is_demo_customer`=new_customers.`is_demo_customer`, `address`=new_customers.`address`, `created_at`=new_customers.`created_at`, `updated_at`=new_customers.`updated_at`, `created_by`=new_customers.`created_by`, `updated_by`=new_customers.`updated_by`, `order_seq_number`=new_customers.`order_seq_number`;", 'SELECT \'Table customers does not exist\'');
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `orders` (`id`, `customer_hat_id`, `customer_order_seq_number`, `wing_quantity`, `num_of_hats`, `kippa_size`, `diameter_inches`, `ordering_customer_name`, `tails_overdraft_r`, `isurgent`, `white_hair`, `white_hair_notes`, `order_notes`, `tails_overdraft_l`, `is_tentative`) 
VALUES
(14, 2, 1, 46, 1, 56, 11.5, 'HM', 23, 0, 0, '', '', 23, 0),
(15, 3, 2, 46, 1, 56.5, 11.5, 'HM', 23, 0, 0, '', '', 23, 0),
(16, 3, 3, 46, 1, 56.5, 11.5, 'HM', 23, 0, 0, '', '', 23, 0),
(17, 3, 4, 46, 1, 56.5, 11.5, 'HM', 23, 0, 0, '', '', 23, 0),
(18, 3, 5, 46, 1, 56.5, 11.5, 'HM', 23, 0, 0, '', '', 23, 0),
(19, 4, 6, 45, 1, 56, 11.5, 'H', 22.5, 0, 0, '', '', 22.5, 0),
(20, 4, 7, 45, 1, 56, 11.5, 'H', 22.5, 0, 0, '', '', 22.5, 0),
(21, 5, 8, 45, 1, 56, 11.5, 'hh', 22.5, 0, 0, '', '', 22.5, 0),
(22, 6, 9, 42, 1, 56, 11.5, 'H&M', 21, 0, 0, '', '', 21, 0),
(23, 6, 10, 42, 1, 56, 11.5, 'H&M', 21, 0, 0, '', '', 21, 0),
(24, 6, 11, 42, 1, 56, 11.5, 'H&M', 21, 0, 0, '', '', 21, 0),
(25, 6, 12, 42, 1, 56, 11.5, 'H&M', 21, 0, 0, '', '', 21, 0),
(26, 6, 13, 42, 1, 56, 11.5, 'H&M', 21, 0, 0, '', '', 21, 0),
(27, 6, 14, 42, 1, 56, 11.5, 'H&M', 21, 0, 0, '', '', 21, 0),
(28, 6, 15, 42, 1, 56, 11.5, 'H&M', 21, 0, 0, '', '', 21, 0)
as new_orders
ON DUPLICATE KEY UPDATE
`customer_hat_id`=new_orders.`customer_hat_id`, `customer_order_seq_number`=new_orders.`customer_order_seq_number`, `wing_quantity`=new_orders.`wing_quantity`, `num_of_hats`=new_orders.`num_of_hats`, `kippa_size`=new_orders.`kippa_size`, `diameter_inches`=new_orders.`diameter_inches`, `ordering_customer_name`=new_orders.`ordering_customer_name`, `tails_overdraft_r`=new_orders.`tails_overdraft_r`, `isurgent`=new_orders.`isurgent`, `white_hair`=new_orders.`white_hair`, `white_hair_notes`=new_orders.`white_hair_notes`, `order_notes`=new_orders.`order_notes`, `tails_overdraft_l`=new_orders.`tails_overdraft_l`, `is_tentative`=new_orders.`is_tentative`;", 'SELECT \'Table orders does not exist\'');
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
(14, 14, '2026-05-13 11:50:33', 'new'),
(15, 15, '2026-05-13 11:53:56', 'new'),
(16, 16, '2026-05-13 11:53:56', 'new'),
(17, 17, '2026-05-13 11:53:56', 'new'),
(18, 18, '2026-05-13 11:53:56', 'new'),
(19, 19, '2026-05-14 15:07:00', 'new'),
(20, 20, '2026-05-14 15:07:00', 'new'),
(21, 21, '2026-05-14 15:12:03', 'new'),
(22, 22, '2026-06-19 09:07:57', 'new'),
(23, 23, '2026-06-19 09:07:57', 'new'),
(24, 24, '2026-06-19 09:07:57', 'new'),
(25, 25, '2026-06-19 09:07:57', 'new'),
(26, 26, '2026-06-19 09:07:57', 'new'),
(27, 27, '2026-06-19 09:07:57', 'new'),
(28, 28, '2026-06-19 09:07:57', 'new')
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `raw_materials` (`id`, `name`, `purchased_at`, `purchase_quantity`, `remaining_quantity`, `quantity_units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`, `color`, `created_at`, `updated_at`, `created_by`, `updated_by`, `allow_shortening_babies_in_pairs`, `is_usable_for_h_material`) 
VALUES
(1, 'DM ', '2026-03-08 00:00:00', 270, 0, 'units', 0, 'Tif', 'US', 0, 'USD', '49 jambo', 'Dark brown', '2026-03-08 14:47:36', '2026-03-08 14:52:29', 0, 0, 0, 1),
(2, 'Sable', '2026-03-12 00:00:00', 1680, 195, 'units', 0, '', 'GR', 0, 'USD', 'Tails', 'Light brown', '2026-03-12 10:16:26', '2026-05-13 11:51:34', 0, 0, 0, 1),
(3, 'DM', '2026-04-17 00:00:00', 2000, 500, 'units', 0, '', 'US', 5, 'USD', '', 'Natural', '2026-04-17 11:25:43', '2026-04-29 13:14:34', 0, 0, 0, 1),
(4, 'Fisher', '2026-06-19 00:00:00', 300, 100, 'units', 0, '', 'US', 3, 'USD', '', 'Natural', '2026-06-19 08:58:24', '2026-06-19 08:58:48', 0, 0, 0, 1),
(5, 'BM H', '2026-06-19 00:00:00', 1000, 200, 'units', 0, 'Leon', 'US', 0, 'USD', '', 'Natural', '2026-06-19 09:11:50', '2026-06-19 09:11:50', 0, 0, 0, 1)
as new_raw_materials
ON DUPLICATE KEY UPDATE
`name`=new_raw_materials.`name`, `purchased_at`=new_raw_materials.`purchased_at`, `purchase_quantity`=new_raw_materials.`purchase_quantity`, `remaining_quantity`=new_raw_materials.`remaining_quantity`, `quantity_units`=new_raw_materials.`quantity_units`, `units_per_kg`=new_raw_materials.`units_per_kg`, `vendor_name`=new_raw_materials.`vendor_name`, `origin_country`=new_raw_materials.`origin_country`, `price`=new_raw_materials.`price`, `currency`=new_raw_materials.`currency`, `notes`=new_raw_materials.`notes`, `color`=new_raw_materials.`color`, `created_at`=new_raw_materials.`created_at`, `updated_at`=new_raw_materials.`updated_at`, `created_by`=new_raw_materials.`created_by`, `updated_by`=new_raw_materials.`updated_by`, `allow_shortening_babies_in_pairs`=new_raw_materials.`allow_shortening_babies_in_pairs`, `is_usable_for_h_material`=new_raw_materials.`is_usable_for_h_material`;", 'SELECT \'Table raw_materials does not exist\'');
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
(56, '4', 'orders_resources_by_customer_id', ''),
(113, '1', 'dashboard', 'CRUD'),
(114, '1', 'raw_materials', 'CRUD'),
(115, '1', 'bank_baby_management', 'CRUD'),
(116, '1', 'customers', 'CRUD'),
(117, '1', 'customers_advanced_features', 'RU'),
(118, '1', 'orders', 'CRUD'),
(119, '1', 'wings', 'CRUD'),
(120, '1', 'wings_through_orders', ''),
(121, '1', 'system_settings', 'CRUD'),
(122, '1', 'backup', 'CRUD'),
(123, '1', 'system_logs', 'CRUD'),
(124, '1', 'user_management', 'CRUD'),
(125, '1', 'customer_resources_by_customer_id', ''),
(126, '1', 'orders_resources_by_customer_id', ''),
(127, '2', 'dashboard', 'R'),
(128, '2', 'raw_materials', ''),
(129, '2', 'bank_baby_management', ''),
(130, '2', 'customers', ''),
(131, '2', 'customers_advanced_features', ''),
(132, '2', 'orders', ''),
(133, '2', 'wings', ''),
(134, '2', 'wings_through_orders', 'CRUD'),
(135, '2', 'system_settings', ''),
(136, '2', 'backup', ''),
(137, '2', 'system_logs', ''),
(138, '2', 'user_management', ''),
(139, '2', 'customer_resources_by_customer_id', 'RU'),
(140, '2', 'orders_resources_by_customer_id', 'CRUD'),
(141, '3', 'dashboard', 'R'),
(142, '3', 'raw_materials', 'R'),
(143, '3', 'bank_baby_management', 'CRUD'),
(144, '3', 'customers', 'R'),
(145, '2', 'customers_advanced_features', ''),
(146, '3', 'orders', 'RUD'),
(147, '3', 'wings', 'R'),
(148, '3', 'wings_through_orders', ''),
(149, '3', 'system_settings', ''),
(150, '3', 'backup', ''),
(151, '3', 'user_management', ''),
(152, '3', 'system_logs', ''),
(153, '3', 'customer_resources_by_customer_id', ''),
(154, '3', 'orders_resources_by_customer_id', ''),
(155, '4', 'dashboard', 'R'),
(156, '4', 'raw_materials', ''),
(157, '4', 'bank_baby_management', ''),
(158, '4', 'customers', ''),
(159, '4', 'customers_advanced_features', ''),
(160, '4', 'orders', ''),
(161, '4', 'wings', ''),
(162, '4', 'wings_through_orders', ''),
(163, '4', 'system_settings', ''),
(164, '4', 'user_management', ''),
(165, '4', 'backup', ''),
(166, '4', 'system_logs', ''),
(167, '4', 'customer_resources_by_customer_id', ''),
(168, '4', 'orders_resources_by_customer_id', ''),
(169, '1', 'dashboard', 'CRUD'),
(170, '1', 'raw_materials', 'CRUD'),
(171, '1', 'bank_baby_management', 'CRUD'),
(172, '1', 'customers', 'CRUD'),
(173, '1', 'customers_advanced_features', 'RU'),
(174, '1', 'orders', 'CRUD'),
(175, '1', 'wings', 'CRUD'),
(176, '1', 'wings_through_orders', ''),
(177, '1', 'system_settings', 'CRUD'),
(178, '1', 'backup', 'CRUD'),
(179, '1', 'system_logs', 'CRUD'),
(180, '1', 'user_management', 'CRUD'),
(181, '1', 'customer_resources_by_customer_id', ''),
(182, '1', 'orders_resources_by_customer_id', ''),
(183, '2', 'dashboard', 'R'),
(184, '2', 'raw_materials', ''),
(185, '2', 'bank_baby_management', ''),
(186, '2', 'customers', ''),
(187, '2', 'customers_advanced_features', ''),
(188, '2', 'orders', ''),
(189, '2', 'wings', ''),
(190, '2', 'wings_through_orders', 'CRUD'),
(191, '2', 'system_settings', ''),
(192, '2', 'backup', ''),
(193, '2', 'system_logs', ''),
(194, '2', 'user_management', ''),
(195, '2', 'customer_resources_by_customer_id', 'RU'),
(196, '2', 'orders_resources_by_customer_id', 'CRUD'),
(197, '3', 'dashboard', 'R'),
(198, '3', 'raw_materials', 'R'),
(199, '3', 'bank_baby_management', 'CRUD'),
(200, '3', 'customers', 'R'),
(201, '2', 'customers_advanced_features', ''),
(202, '3', 'orders', 'RUD'),
(203, '3', 'wings', 'R'),
(204, '3', 'wings_through_orders', ''),
(205, '3', 'system_settings', ''),
(206, '3', 'backup', ''),
(207, '3', 'user_management', ''),
(208, '3', 'system_logs', ''),
(209, '3', 'customer_resources_by_customer_id', ''),
(210, '3', 'orders_resources_by_customer_id', ''),
(211, '4', 'dashboard', 'R'),
(212, '4', 'raw_materials', ''),
(213, '4', 'bank_baby_management', ''),
(214, '4', 'customers', ''),
(215, '4', 'customers_advanced_features', ''),
(216, '4', 'orders', ''),
(217, '4', 'wings', ''),
(218, '4', 'wings_through_orders', ''),
(219, '4', 'system_settings', ''),
(220, '4', 'user_management', ''),
(221, '4', 'backup', ''),
(222, '4', 'system_logs', ''),
(223, '4', 'customer_resources_by_customer_id', ''),
(224, '4', 'orders_resources_by_customer_id', ''),
(225, '1', 'dashboard', 'CRUD'),
(226, '1', 'raw_materials', 'CRUD'),
(227, '1', 'bank_baby_management', 'CRUD'),
(228, '1', 'customers', 'CRUD'),
(229, '1', 'customers_advanced_features', 'RU'),
(230, '1', 'orders', 'CRUD'),
(231, '1', 'wings', 'CRUD'),
(232, '1', 'wings_through_orders', ''),
(233, '1', 'system_settings', 'CRUD'),
(234, '1', 'backup', 'CRUD'),
(235, '1', 'system_logs', 'CRUD'),
(236, '1', 'user_management', 'CRUD'),
(237, '1', 'customer_resources_by_customer_id', ''),
(238, '1', 'orders_resources_by_customer_id', ''),
(239, '2', 'dashboard', 'R'),
(240, '2', 'raw_materials', ''),
(241, '2', 'bank_baby_management', ''),
(242, '2', 'customers', ''),
(243, '2', 'customers_advanced_features', ''),
(244, '2', 'orders', ''),
(245, '2', 'wings', ''),
(246, '2', 'wings_through_orders', 'CRUD'),
(247, '2', 'system_settings', ''),
(248, '2', 'backup', ''),
(249, '2', 'system_logs', ''),
(250, '2', 'user_management', ''),
(251, '2', 'customer_resources_by_customer_id', 'RU'),
(252, '2', 'orders_resources_by_customer_id', 'CRUD'),
(253, '3', 'dashboard', 'R'),
(254, '3', 'raw_materials', 'R'),
(255, '3', 'bank_baby_management', 'CRUD'),
(256, '3', 'customers', 'R'),
(257, '2', 'customers_advanced_features', ''),
(258, '3', 'orders', 'RUD'),
(259, '3', 'wings', 'R'),
(260, '3', 'wings_through_orders', ''),
(261, '3', 'system_settings', ''),
(262, '3', 'backup', ''),
(263, '3', 'user_management', ''),
(264, '3', 'system_logs', ''),
(265, '3', 'customer_resources_by_customer_id', ''),
(266, '3', 'orders_resources_by_customer_id', ''),
(267, '4', 'dashboard', 'R'),
(268, '4', 'raw_materials', ''),
(269, '4', 'bank_baby_management', ''),
(270, '4', 'customers', ''),
(271, '4', 'customers_advanced_features', ''),
(272, '4', 'orders', ''),
(273, '4', 'wings', ''),
(274, '4', 'wings_through_orders', ''),
(275, '4', 'system_settings', ''),
(276, '4', 'user_management', ''),
(277, '4', 'backup', ''),
(278, '4', 'system_logs', ''),
(279, '4', 'customer_resources_by_customer_id', ''),
(280, '4', 'orders_resources_by_customer_id', ''),
(281, '1', 'dashboard', 'CRUD'),
(282, '1', 'raw_materials', 'CRUD'),
(283, '1', 'bank_baby_management', 'CRUD'),
(284, '1', 'customers', 'CRUD'),
(285, '1', 'customers_advanced_features', 'RU'),
(286, '1', 'orders', 'CRUD'),
(287, '1', 'wings', 'CRUD'),
(288, '1', 'wings_through_orders', ''),
(289, '1', 'system_settings', 'CRUD'),
(290, '1', 'backup', 'CRUD'),
(291, '1', 'system_logs', 'CRUD'),
(292, '1', 'user_management', 'CRUD'),
(293, '1', 'customer_resources_by_customer_id', ''),
(294, '1', 'orders_resources_by_customer_id', ''),
(295, '2', 'dashboard', 'R'),
(296, '2', 'raw_materials', ''),
(297, '2', 'bank_baby_management', ''),
(298, '2', 'customers', ''),
(299, '2', 'customers_advanced_features', ''),
(300, '2', 'orders', ''),
(301, '2', 'wings', ''),
(302, '2', 'wings_through_orders', 'CRUD'),
(303, '2', 'system_settings', ''),
(304, '2', 'backup', ''),
(305, '2', 'system_logs', ''),
(306, '2', 'user_management', ''),
(307, '2', 'customer_resources_by_customer_id', 'RU'),
(308, '2', 'orders_resources_by_customer_id', 'CRUD'),
(309, '3', 'dashboard', 'R'),
(310, '3', 'raw_materials', 'R'),
(311, '3', 'bank_baby_management', 'CRUD'),
(312, '3', 'customers', 'R'),
(313, '2', 'customers_advanced_features', ''),
(314, '3', 'orders', 'RUD'),
(315, '3', 'wings', 'R'),
(316, '3', 'wings_through_orders', ''),
(317, '3', 'system_settings', ''),
(318, '3', 'backup', ''),
(319, '3', 'user_management', ''),
(320, '3', 'system_logs', ''),
(321, '3', 'customer_resources_by_customer_id', ''),
(322, '3', 'orders_resources_by_customer_id', ''),
(323, '4', 'dashboard', 'R'),
(324, '4', 'raw_materials', ''),
(325, '4', 'bank_baby_management', ''),
(326, '4', 'customers', ''),
(327, '4', 'customers_advanced_features', ''),
(328, '4', 'orders', ''),
(329, '4', 'wings', ''),
(330, '4', 'wings_through_orders', ''),
(331, '4', 'system_settings', ''),
(332, '4', 'user_management', ''),
(333, '4', 'backup', ''),
(334, '4', 'system_logs', ''),
(335, '4', 'customer_resources_by_customer_id', ''),
(336, '4', 'orders_resources_by_customer_id', ''),
(337, '1', 'dashboard', 'CRUD'),
(338, '1', 'raw_materials', 'CRUD'),
(339, '1', 'bank_baby_management', 'CRUD'),
(340, '1', 'customers', 'CRUD'),
(341, '1', 'customers_advanced_features', 'RU'),
(342, '1', 'orders', 'CRUD'),
(343, '1', 'wings', 'CRUD'),
(344, '1', 'wings_through_orders', ''),
(345, '1', 'system_settings', 'CRUD'),
(346, '1', 'backup', 'CRUD'),
(347, '1', 'system_logs', 'CRUD'),
(348, '1', 'user_management', 'CRUD'),
(349, '1', 'customer_resources_by_customer_id', ''),
(350, '1', 'orders_resources_by_customer_id', ''),
(351, '2', 'dashboard', 'R'),
(352, '2', 'raw_materials', ''),
(353, '2', 'bank_baby_management', ''),
(354, '2', 'customers', ''),
(355, '2', 'customers_advanced_features', ''),
(356, '2', 'orders', ''),
(357, '2', 'wings', ''),
(358, '2', 'wings_through_orders', 'CRUD'),
(359, '2', 'system_settings', ''),
(360, '2', 'backup', ''),
(361, '2', 'system_logs', ''),
(362, '2', 'user_management', ''),
(363, '2', 'customer_resources_by_customer_id', 'RU'),
(364, '2', 'orders_resources_by_customer_id', 'CRUD'),
(365, '3', 'dashboard', 'R'),
(366, '3', 'raw_materials', 'R'),
(367, '3', 'bank_baby_management', 'CRUD'),
(368, '3', 'customers', 'R'),
(369, '2', 'customers_advanced_features', ''),
(370, '3', 'orders', 'RUD'),
(371, '3', 'wings', 'R'),
(372, '3', 'wings_through_orders', ''),
(373, '3', 'system_settings', ''),
(374, '3', 'backup', ''),
(375, '3', 'user_management', ''),
(376, '3', 'system_logs', ''),
(377, '3', 'customer_resources_by_customer_id', ''),
(378, '3', 'orders_resources_by_customer_id', ''),
(379, '4', 'dashboard', 'R'),
(380, '4', 'raw_materials', ''),
(381, '4', 'bank_baby_management', ''),
(382, '4', 'customers', ''),
(383, '4', 'customers_advanced_features', ''),
(384, '4', 'orders', ''),
(385, '4', 'wings', ''),
(386, '4', 'wings_through_orders', ''),
(387, '4', 'system_settings', ''),
(388, '4', 'user_management', ''),
(389, '4', 'backup', ''),
(390, '4', 'system_logs', ''),
(391, '4', 'customer_resources_by_customer_id', ''),
(392, '4', 'orders_resources_by_customer_id', ''),
(393, '1', 'dashboard', 'CRUD'),
(394, '1', 'raw_materials', 'CRUD'),
(395, '1', 'bank_baby_management', 'CRUD'),
(396, '1', 'customers', 'CRUD'),
(397, '1', 'customers_advanced_features', 'RU'),
(398, '1', 'orders', 'CRUD'),
(399, '1', 'wings', 'CRUD'),
(400, '1', 'wings_through_orders', ''),
(401, '1', 'system_settings', 'CRUD'),
(402, '1', 'backup', 'CRUD'),
(403, '1', 'system_logs', 'CRUD'),
(404, '1', 'user_management', 'CRUD'),
(405, '1', 'customer_resources_by_customer_id', ''),
(406, '1', 'orders_resources_by_customer_id', ''),
(407, '2', 'dashboard', 'R'),
(408, '2', 'raw_materials', ''),
(409, '2', 'bank_baby_management', ''),
(410, '2', 'customers', ''),
(411, '2', 'customers_advanced_features', ''),
(412, '2', 'orders', ''),
(413, '2', 'wings', ''),
(414, '2', 'wings_through_orders', 'CRUD'),
(415, '2', 'system_settings', ''),
(416, '2', 'backup', ''),
(417, '2', 'system_logs', ''),
(418, '2', 'user_management', ''),
(419, '2', 'customer_resources_by_customer_id', 'RU'),
(420, '2', 'orders_resources_by_customer_id', 'CRUD'),
(421, '3', 'dashboard', 'R'),
(422, '3', 'raw_materials', 'R'),
(423, '3', 'bank_baby_management', 'CRUD'),
(424, '3', 'customers', 'R'),
(425, '2', 'customers_advanced_features', ''),
(426, '3', 'orders', 'RUD'),
(427, '3', 'wings', 'R'),
(428, '3', 'wings_through_orders', ''),
(429, '3', 'system_settings', ''),
(430, '3', 'backup', ''),
(431, '3', 'user_management', ''),
(432, '3', 'system_logs', ''),
(433, '3', 'customer_resources_by_customer_id', ''),
(434, '3', 'orders_resources_by_customer_id', ''),
(435, '4', 'dashboard', 'R'),
(436, '4', 'raw_materials', ''),
(437, '4', 'bank_baby_management', ''),
(438, '4', 'customers', ''),
(439, '4', 'customers_advanced_features', ''),
(440, '4', 'orders', ''),
(441, '4', 'wings', ''),
(442, '4', 'wings_through_orders', ''),
(443, '4', 'system_settings', ''),
(444, '4', 'user_management', ''),
(445, '4', 'backup', ''),
(446, '4', 'system_logs', ''),
(447, '4', 'customer_resources_by_customer_id', ''),
(448, '4', 'orders_resources_by_customer_id', ''),
(449, '1', 'dashboard', 'CRUD'),
(450, '1', 'raw_materials', 'CRUD'),
(451, '1', 'bank_baby_management', 'CRUD'),
(452, '1', 'customers', 'CRUD'),
(453, '1', 'customers_advanced_features', 'RU'),
(454, '1', 'orders', 'CRUD'),
(455, '1', 'wings', 'CRUD'),
(456, '1', 'wings_through_orders', ''),
(457, '1', 'system_settings', 'CRUD'),
(458, '1', 'backup', 'CRUD'),
(459, '1', 'system_logs', 'CRUD'),
(460, '1', 'user_management', 'CRUD'),
(461, '1', 'customer_resources_by_customer_id', ''),
(462, '1', 'orders_resources_by_customer_id', ''),
(463, '2', 'dashboard', 'R'),
(464, '2', 'raw_materials', ''),
(465, '2', 'bank_baby_management', ''),
(466, '2', 'customers', ''),
(467, '2', 'customers_advanced_features', ''),
(468, '2', 'orders', ''),
(469, '2', 'wings', ''),
(470, '2', 'wings_through_orders', 'CRUD'),
(471, '2', 'system_settings', ''),
(472, '2', 'backup', ''),
(473, '2', 'system_logs', ''),
(474, '2', 'user_management', ''),
(475, '2', 'customer_resources_by_customer_id', 'RU'),
(476, '2', 'orders_resources_by_customer_id', 'CRUD'),
(477, '3', 'dashboard', 'R'),
(478, '3', 'raw_materials', 'R'),
(479, '3', 'bank_baby_management', 'CRUD'),
(480, '3', 'customers', 'R'),
(481, '2', 'customers_advanced_features', ''),
(482, '3', 'orders', 'RUD'),
(483, '3', 'wings', 'R'),
(484, '3', 'wings_through_orders', ''),
(485, '3', 'system_settings', ''),
(486, '3', 'backup', ''),
(487, '3', 'user_management', ''),
(488, '3', 'system_logs', ''),
(489, '3', 'customer_resources_by_customer_id', ''),
(490, '3', 'orders_resources_by_customer_id', ''),
(491, '4', 'dashboard', 'R'),
(492, '4', 'raw_materials', ''),
(493, '4', 'bank_baby_management', ''),
(494, '4', 'customers', ''),
(495, '4', 'customers_advanced_features', ''),
(496, '4', 'orders', ''),
(497, '4', 'wings', ''),
(498, '4', 'wings_through_orders', ''),
(499, '4', 'system_settings', ''),
(500, '4', 'user_management', ''),
(501, '4', 'backup', ''),
(502, '4', 'system_logs', ''),
(503, '4', 'customer_resources_by_customer_id', ''),
(504, '4', 'orders_resources_by_customer_id', ''),
(505, '1', 'dashboard', 'CRUD'),
(506, '1', 'raw_materials', 'CRUD'),
(507, '1', 'bank_baby_management', 'CRUD'),
(508, '1', 'customers', 'CRUD'),
(509, '1', 'customers_advanced_features', 'RU'),
(510, '1', 'orders', 'CRUD'),
(511, '1', 'wings', 'CRUD'),
(512, '1', 'wings_through_orders', ''),
(513, '1', 'system_settings', 'CRUD'),
(514, '1', 'backup', 'CRUD'),
(515, '1', 'system_logs', 'CRUD'),
(516, '1', 'user_management', 'CRUD'),
(517, '1', 'customer_resources_by_customer_id', ''),
(518, '1', 'orders_resources_by_customer_id', ''),
(519, '2', 'dashboard', 'R'),
(520, '2', 'raw_materials', ''),
(521, '2', 'bank_baby_management', ''),
(522, '2', 'customers', ''),
(523, '2', 'customers_advanced_features', ''),
(524, '2', 'orders', ''),
(525, '2', 'wings', ''),
(526, '2', 'wings_through_orders', 'CRUD'),
(527, '2', 'system_settings', ''),
(528, '2', 'backup', ''),
(529, '2', 'system_logs', ''),
(530, '2', 'user_management', ''),
(531, '2', 'customer_resources_by_customer_id', 'RU'),
(532, '2', 'orders_resources_by_customer_id', 'CRUD'),
(533, '3', 'dashboard', 'R'),
(534, '3', 'raw_materials', 'R'),
(535, '3', 'bank_baby_management', 'CRUD'),
(536, '3', 'customers', 'R'),
(537, '2', 'customers_advanced_features', ''),
(538, '3', 'orders', 'RUD'),
(539, '3', 'wings', 'R'),
(540, '3', 'wings_through_orders', ''),
(541, '3', 'system_settings', ''),
(542, '3', 'backup', ''),
(543, '3', 'user_management', ''),
(544, '3', 'system_logs', ''),
(545, '3', 'customer_resources_by_customer_id', ''),
(546, '3', 'orders_resources_by_customer_id', ''),
(547, '4', 'dashboard', 'R'),
(548, '4', 'raw_materials', ''),
(549, '4', 'bank_baby_management', ''),
(550, '4', 'customers', ''),
(551, '4', 'customers_advanced_features', ''),
(552, '4', 'orders', ''),
(553, '4', 'wings', ''),
(554, '4', 'wings_through_orders', ''),
(555, '4', 'system_settings', ''),
(556, '4', 'user_management', ''),
(557, '4', 'backup', ''),
(558, '4', 'system_logs', ''),
(559, '4', 'customer_resources_by_customer_id', ''),
(560, '4', 'orders_resources_by_customer_id', '')
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
(4, 'guest'),
(9, 'administrator'),
(10, 'customer'),
(11, 'employee'),
(12, 'guest'),
(13, 'administrator'),
(14, 'customer'),
(15, 'employee'),
(16, 'guest'),
(17, 'administrator'),
(18, 'customer'),
(19, 'employee'),
(20, 'guest'),
(21, 'administrator'),
(22, 'customer'),
(23, 'employee'),
(24, 'guest'),
(25, 'administrator'),
(26, 'customer'),
(27, 'employee'),
(28, 'guest'),
(29, 'administrator'),
(30, 'customer'),
(31, 'employee'),
(32, 'guest'),
(33, 'administrator'),
(34, 'customer'),
(35, 'employee'),
(36, 'guest'),
(37, 'administrator'),
(38, 'customer'),
(39, 'employee'),
(40, 'guest')
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
('alert_raw_material_item_percents_below', '10', '10', 'number'),
('alert_raw_material_item_units', '1', '1', 'boolean'),
('alert_raw_material_item_units_below', '10', '10', 'number'),
('alert_raw_material_total_kg', '1', '1', 'boolean'),
('alert_raw_material_total_kg_below', '10', '10', 'number'),
('alert_raw_material_total_units', '1', '1', 'boolean'),
('alert_raw_material_total_units_below', '20', '20', 'number'),
('customer_banks_babies_reduce_from_allocation', '0', '0', 'boolean'),
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
(1, '2026-03-08 14:47:36', 1, 270, 'raw_material_purchase', 1, 0, 0, 0, 270, -1, -1),
(2, '2026-03-08 14:52:30', 1, 270, 'to_customer_bank', 1, 12, 1, 0, 0, 270, -1),
(3, '2026-03-12 10:16:30', 1, 7, 'raw_material_purchase', 2, 0, 0, 0, 7, -1, -1),
(4, '2026-03-12 10:18:34', 1, 1673, 'raw_material_purchase', 2, 0, 0, 0, 1680, -1, -1),
(5, '2026-03-26 08:21:23', 1, 200, 'customer_bank_allocate_to_Work', 1, 12, 1, 1, -1, 70, 0),
(6, '2026-03-26 08:21:23', 1, 200, 'customer_bank_allocate_to_Work', 1, 12, 1, 2, -1, 70, 0),
(7, '2026-03-27 10:15:14', 1, 490, 'to_customer_bank', 2, 12, 2, 0, 1190, 490, -1),
(8, '2026-03-27 10:16:23', 1, 490, 'customer_bank_allocate_to_Work', 2, 12, 2, 3, -1, 0, 0),
(9, '2026-03-27 10:18:21', 1, 495, 'to_customer_bank', 2, 12, 2, 0, 695, 495, -1),
(11, '2026-04-17 11:25:46', 1, 1000, 'raw_material_purchase', 3, 0, 0, 0, 1000, -1, -1),
(12, '2026-04-17 11:31:41', 1, 500, 'customer_bank_allocate_to_Work', 3, 17, 4, 5, -1, 500, 0),
(13, '2026-04-17 11:51:43', 1, 300, 'customer_bank_allocate_to_Work', 3, 21, 0, 6, -1, 999700, 0),
(14, '2026-04-29 12:05:36', 1, 500, 'customer_bank_allocate_to_Work', 2, 21, 0, 8, -1, 999500, 0),
(15, '2026-04-29 13:14:33', 1, 1000, 'raw_material_purchase', 3, 0, 0, 0, 1000, -1, -1),
(16, '2026-04-29 13:14:34', 1, 500, 'to_customer_bank', 3, 10, 10, 0, 500, 500, -1),
(17, '2026-04-29 13:15:11', 1, 200, 'customer_bank_allocate_to_Work', 3, 10, 10, 9, -1, 300, 0),
(21, '2026-05-13 11:51:32', 1, 500, 'to_customer_bank', 2, 17, 12, 0, 195, 500, -1),
(22, '2026-05-13 11:52:41', 1, 500, 'customer_bank_allocate_to_Work', 2, 17, 12, 12, -1, 0, 0),
(23, '2026-06-19 08:58:27', 1, 300, 'raw_material_purchase', 4, 0, 0, 0, 300, -1, -1),
(24, '2026-06-19 08:58:52', 1, 200, 'to_customer_bank', 4, 17, 13, 0, 100, 200, -1),
(25, '2026-06-19 09:11:53', 1, 1000, 'raw_material_purchase', 5, 0, 0, 0, 1000, -1, -1),
(26, '2026-06-19 09:11:54', 1, 800, 'to_customer_bank', 5, 17, 14, 0, 200, 800, -1),
(27, '2026-06-23 08:36:27', 1, 200, 'customer_bank_allocate_to_Work', 4, 17, 13, 13, -1, 0, 0),
(28, '2026-06-23 08:36:27', 1, 200, 'customer_bank_allocate_to_Work', 4, 17, 13, 14, -1, 0, 0),
(29, '2026-07-03 10:44:01', 1, 31, 'customer_bank_allocate_to_Work', 3, 10, 10, 15, -1, 269, 0)
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
(7, 10),
(8, 10),
(6, 21)
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
(6, 2),
(7, 2),
(8, 2)
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
        SET @sql = IF(@table_exists > 0, "INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `email`, `password`, `is_verified`, `is_disabled`, `pending_verfication_code`, `verification_code_expiration`, `pending_new_email`, `pending_new_email_code`, `photo_url`, `phone`, `is_demo_customer`, `created_at`) 
VALUES
(1, 'Alon', 'Rotem', 'alrotem', 'alrotem@gmail.com', '$2b$10$VZrjHgOhn3JEWO/DQTv.n.9jnZGVnQKPXWskKpmMHRWBJ3bGyRAmq', 1, 0, '8DKLMLL9JY', null, null, null, '/uploads/images/users/1771246565523-profile.png', '', 0, '2026-02-16 12:48:15'),
(2, 'Avi', 'Bar', 'avibar', 'aviouslybar@gmail.com', '$2b$10$/hUQsvO19N4FPR7mtFS3G.AE4xM.WjvikZ/W4WNm/c0G2CebzLNZy', 1, 0, '2FDJ96H5KJ', null, null, null, '/uploads/images/users/1773931533050-profile.png', '', 0, '2026-02-16 12:51:11'),
(6, 'Shkembe', 'Chorba', 'avi', 'avi@mail.com', '$2b$10$NEjMmFzrGsz6PGbvwgxxpuQUwl7AVnHaPOleql6P5xOmAG8UQkHkG', 1, 0, '', null, null, null, null, '', 1, '2026-04-17 11:45:14'),
(7, 'Demo', 'User', 'demo_user', 'alrotem@walla.co.il', '$2b$10$u2BxRRjpi3eisq5sCEao4e3tN78MAha8ugqsib86u5IfSJs/vIYp.', 1, 0, '', null, null, null, null, null, 0, '2026-04-29 08:19:14'),
(8, 'Moshik', 'Tzabary', 'mojo', 'moshik.tzabary@gmail.com', '$2b$10$bHWy82mMq5xb0ejwJUHnkuJ2gOcNO0R7..0mTl2XWKQVJniPXJ9VC', 1, 0, null, null, null, null, '', '', 0, '2026-07-20 16:53:28')
as new_users
ON DUPLICATE KEY UPDATE
`firstname`=new_users.`firstname`, `lastname`=new_users.`lastname`, `username`=new_users.`username`, `email`=new_users.`email`, `password`=new_users.`password`, `is_verified`=new_users.`is_verified`, `is_disabled`=new_users.`is_disabled`, `pending_verfication_code`=new_users.`pending_verfication_code`, `verification_code_expiration`=new_users.`verification_code_expiration`, `pending_new_email`=new_users.`pending_new_email`, `pending_new_email_code`=new_users.`pending_new_email_code`, `photo_url`=new_users.`photo_url`, `phone`=new_users.`phone`, `is_demo_customer`=new_users.`is_demo_customer`, `created_at`=new_users.`created_at`;", 'SELECT \'Table users does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# WINGS
# -------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'wings');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `wings` (`id`, `name`, `knife`, `crown_width`, `split_l1`, `allow_shortening_babies_in_pairs`, `angled_crown`) 
VALUES
(39, 'DM 159 1', 9.5, 2, 1, 0, 0),
(83, 'RT11515', 11.5, 2.5, 1, 0, 0),
(92, 'RT 7130 C9', 7, 2, 2, 0, 0),
(93, 'RT 8130', 0, 2, 1, 0, 0),
(96, 'H&M T10.5 C11', 10.5, 2.3, 3, 0, 0),
(99, 'H&M T10.5 C1120260413144747', 10.5, 2.3, 3, 0, 0),
(100, 'H&M T10.5 C1120260413145203', 10.5, 2.3, 3, 0, 0),
(101, 'DM 159 2', 9.5, 2, 1, 0, 0),
(102, 'DM 159 120260414165510', 9.5, 2, 1, 0, 0),
(103, 'DM 159 12026041416551020260414180700', 9.5, 2, 1, 0, 0),
(104, 'HM-3 95135 ', 9.5, 1.5, 1, 0, 0),
(105, 'HM-3 95135 20260519115950', 9.5, 1.5, 1, 0, 0)
as new_wings
ON DUPLICATE KEY UPDATE
`name`=new_wings.`name`, `knife`=new_wings.`knife`, `crown_width`=new_wings.`crown_width`, `split_l1`=new_wings.`split_l1`, `allow_shortening_babies_in_pairs`=new_wings.`allow_shortening_babies_in_pairs`, `angled_crown`=new_wings.`angled_crown`;", 'SELECT \'Table wings does not exist\'');
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
(1919, 96, 'TOP', 10.5),
(1956, 96, 'R1', 6),
(1957, 96, 'R2', 6.5),
(1958, 96, 'L1', 7),
(1959, 96, 'R3', 7),
(1960, 96, 'L2', 7.5),
(1961, 96, 'R4', 7.5),
(1962, 96, 'L3', 8),
(1963, 96, 'R5', 8),
(1964, 96, 'L4', 8.5),
(1965, 96, 'R6', 8.5),
(1966, 96, 'L5', 9),
(1967, 96, 'R7', 9),
(1968, 96, 'L6', 9.5),
(1969, 96, 'R8', 9.5),
(1970, 96, 'L7', 10),
(1971, 96, 'C1', 11),
(1972, 96, 'C2', 11),
(1973, 96, 'C3', 11),
(1974, 96, 'C4', 11),
(1976, 99, 'R1', 6),
(1977, 99, 'R2', 6.5),
(1978, 99, 'L1', 7),
(1979, 99, 'R3', 7),
(1980, 99, 'L2', 7.5),
(1981, 99, 'R4', 7.5),
(1982, 99, 'L3', 8),
(1983, 99, 'R5', 8),
(1984, 99, 'L4', 8.5),
(1985, 99, 'R6', 8.5),
(1986, 99, 'L5', 9),
(1987, 99, 'R7', 9),
(1988, 99, 'L6', 9.5),
(1989, 99, 'R8', 9.5),
(1990, 99, 'L7', 10),
(1991, 99, 'TOP', 10.5),
(1992, 99, 'C1', 11),
(1993, 99, 'C2', 11),
(1994, 99, 'C3', 11),
(1995, 99, 'C4', 11),
(1996, 100, 'R1', 6),
(1997, 100, 'R2', 6.5),
(1998, 100, 'L1', 7),
(1999, 100, 'R3', 7),
(2000, 100, 'L2', 7.5),
(2001, 100, 'R4', 7.5),
(2002, 100, 'L3', 8),
(2003, 100, 'R5', 8),
(2004, 100, 'L4', 8.5),
(2005, 100, 'R6', 8.5),
(2006, 100, 'L5', 9),
(2007, 100, 'R7', 9),
(2008, 100, 'L6', 9.5),
(2009, 100, 'R8', 9.5),
(2010, 100, 'L7', 10),
(2011, 100, 'TOP', 10.5),
(2012, 100, 'C1', 11),
(2013, 100, 'C2', 11),
(2014, 100, 'C3', 11),
(2015, 100, 'C4', 11),
(2016, 101, 'R1', 6),
(2017, 101, 'L1', 6),
(2018, 101, 'L2', 6),
(2019, 101, 'R2', 6),
(2020, 101, 'L3', 6.5),
(2021, 101, 'R3', 6.5),
(2022, 101, 'L4', 7),
(2023, 101, 'R4', 7),
(2024, 101, 'L5', 7.5),
(2025, 101, 'R5', 7.5),
(2026, 101, 'L6', 8),
(2027, 101, 'R6', 8),
(2028, 101, 'L7', 8.5),
(2029, 101, 'L8', 9),
(2030, 101, 'R7', 9.5),
(2031, 101, 'L9', 9.5),
(2032, 101, 'C2', 10),
(2033, 101, 'C3', 10),
(2034, 101, 'C4', 10),
(2035, 101, 'TOP', 10),
(2036, 101, 'C1', 10.5),
(2037, 102, 'R1', 6),
(2038, 102, 'L1', 6),
(2039, 102, 'L2', 6),
(2040, 102, 'R2', 6),
(2041, 102, 'L3', 6.5),
(2042, 102, 'R3', 6.5),
(2043, 102, 'L4', 7),
(2044, 102, 'R4', 7),
(2045, 102, 'L5', 7.5),
(2046, 102, 'R5', 7.5),
(2047, 102, 'L6', 8),
(2048, 102, 'R6', 8),
(2049, 102, 'L7', 8.5),
(2050, 102, 'L8', 9),
(2051, 102, 'R7', 9.5),
(2052, 102, 'L9', 9.5),
(2053, 102, 'C2', 10),
(2054, 102, 'C3', 10),
(2055, 102, 'C4', 10),
(2056, 102, 'TOP', 10),
(2057, 102, 'C1', 10.5),
(2058, 103, 'R1', 6),
(2059, 103, 'L1', 6),
(2060, 103, 'L2', 6),
(2061, 103, 'R2', 6),
(2062, 103, 'L3', 6.5),
(2063, 103, 'R3', 6.5),
(2064, 103, 'L4', 7),
(2065, 103, 'R4', 7),
(2066, 103, 'L5', 7.5),
(2067, 103, 'R5', 7.5),
(2068, 103, 'L6', 8),
(2069, 103, 'R6', 8),
(2070, 103, 'L7', 8.5),
(2071, 103, 'L8', 9),
(2072, 103, 'R7', 9.5),
(2073, 103, 'L9', 9.5),
(2074, 103, 'C2', 10),
(2075, 103, 'C3', 10),
(2076, 103, 'C4', 10),
(2077, 103, 'TOP', 6),
(2078, 103, 'C1', 10.5),
(2079, 104, 'L1', 6),
(2080, 104, 'R1', 6),
(2081, 104, 'L2', 6.5),
(2082, 104, 'R2', 6.5),
(2083, 104, 'L3', 7),
(2084, 104, 'L4', 7),
(2085, 104, 'R3', 7),
(2086, 104, 'L5', 7.5),
(2087, 104, 'L6', 7.5),
(2088, 104, 'R4', 7.5),
(2089, 104, 'R5', 7.5),
(2090, 104, 'TOP', 8),
(2091, 104, 'C1', 8),
(2092, 104, 'C2', 8),
(2093, 104, 'C3', 8),
(2094, 105, 'L1', 6),
(2095, 105, 'R1', 6),
(2096, 105, 'L2', 6.5),
(2097, 105, 'R2', 6.5),
(2098, 105, 'L3', 7),
(2099, 105, 'L4', 7),
(2100, 105, 'R3', 7),
(2101, 105, 'L5', 7.5),
(2102, 105, 'L6', 7.5),
(2103, 105, 'R4', 7.5),
(2104, 105, 'R5', 7.5),
(2105, 105, 'C1', 8),
(2106, 105, 'C2', 8),
(2107, 105, 'C3', 8),
(2108, 105, 'TOP', 8)
as new_wings_babies
ON DUPLICATE KEY UPDATE
`parent_wing_id`=new_wings_babies.`parent_wing_id`, `position`=new_wings_babies.`position`, `length`=new_wings_babies.`length`;", 'SELECT \'Table wings_babies does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# WINGS_CUSTOMERS
# -----------------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'wings_customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `wings_customers` (`wing_id`, `customer_id`) 
VALUES
(97, 10),
(99, 17),
(100, 17),
(97, 10),
(99, 17),
(100, 17),
(97, 10),
(99, 17),
(100, 17),
(97, 10),
(99, 17),
(100, 17),
(101, 17),
(96, 17),
(92, 10)
as new_wings_customers
ON DUPLICATE KEY UPDATE
`wing_id`=new_wings_customers.`wing_id`, `customer_id`=new_wings_customers.`customer_id`;", 'SELECT \'Table wings_customers does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;


SET FOREIGN_KEY_CHECKS = 1;