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
# CUSTOMER_BANKS_ALLOCATIONS
# ----------------------------
# CUSTOMER_HATS
# ---------------
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
(18, 1, '95.42.140.35', '2026-03-02 09:02:46', '2026-03-08 11:08:26', '2026-04-01 09:02:44', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI5NjgxMDYsImV4cCI6MTc3NTAzNDE2M30.XBcnIgrJfzWs0-Ov67F8xRqu_m5SjHdc5ULeKKiSUbg', '', '', '', 'Windows', 'Edge'),
(21, 2, '95.42.140.220', '2026-03-06 14:45:16', '2026-03-06 15:30:07', '2026-03-07 14:45:16', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI4MTEwMDcsImV4cCI6MTc3Mjg5NDcxNX0.wQreRmpmyojPuDmJ1sdIjGdkU69gHydmNDVDxwFJiuQ', '', '', '', 'Windows', 'Edge')
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
# ORDERS_STATUS
# ---------------
# RAW_MATERIALS
# ---------------
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
