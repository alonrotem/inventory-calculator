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

# ACCOUNT_INVITES
# -----------------
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

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customer_banks');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customer_banks` (`id`, `customer_id`, `raw_material_id`, `quantity`, `remaining_quantity`, `quantity_units`, `quantity_in_kg`) 
VALUES
(1, 12, 1, 270, 70, 'units', 0),
(2, 12, 2, 985, 495, 'units', 495)
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
(3, 2, 490, 0, 'tails', 0, 0)
as new_customer_banks_allocations
ON DUPLICATE KEY UPDATE
`customer_bank_id`=new_customer_banks_allocations.`customer_bank_id`, `quantity`=new_customer_banks_allocations.`quantity`, `remaining_quantity`=new_customer_banks_allocations.`remaining_quantity`, `allocation_type`=new_customer_banks_allocations.`allocation_type`, `tails_quantity`=new_customer_banks_allocations.`tails_quantity`, `tails_in_orders`=new_customer_banks_allocations.`tails_in_orders`;", 'SELECT \'Table customer_banks_allocations does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;

# CUSTOMER_HATS
# ---------------
# CUSTOMERS
# -----------

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'customers');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `customers` (`id`, `name`, `business_name`, `email`, `phone`, `tax_id`, `customer_code`, `notes`, `allow_calculation_advisor`, `created_at`, `updated_at`, `created_by`, `updated_by`, `order_seq_number`) 
VALUES
(10, 'Avi Bar', 'Rom Tech Ltd ', 'avi_bar@mail.com', '+359 87 985 8868', 'Tax payer 5678', 'AB', null, 1, '2025-01-06 20:05:29', '2026-03-11 15:57:56', 1, 1, 35),
(12, 'London', 'Tiferes Inc', 'tiferes.adler@gmail.com', '1-845-558-0778', '456456', 'L', null, 1, '2025-02-24 22:19:45', '2026-03-27 10:16:39', 0, 0, 28),
(17, 'H&M', 'Shaniners Sachar Ltd', 's0548523233@gmail.com', '+972 54-852-3233', '517087078', 'H&M', null, 0, '2026-03-11 15:55:25', '2026-03-26 08:24:57', 0, 0, 1),
(18, 'MT', 'King', 'Meir2400@gmail.com', '+972 50-907-5900', '39425566', 'K', null, 0, '2026-03-11 16:06:02', '2026-03-11 16:06:02', 0, 0, 1)
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
(74, 1, '90.154.140.233', '2026-04-12 21:27:20', '2026-04-12 21:32:48', '2026-04-13 21:27:20', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzYwMjk1NjgsImV4cCI6MTc3NjExNTYzOX0.a2CV_OWdgj1zerrOXX_Kly3D1rn6xU9oFebiK0h7YSA', '', '', '', 'Windows', 'Edge')
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

        -- Check if the table exists
        SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'raw_materials');
        -- Prepare the INSERT statement only if the table exists
        SET @sql = IF(@table_exists > 0, "INSERT INTO `raw_materials` (`id`, `name`, `purchased_at`, `purchase_quantity`, `remaining_quantity`, `quantity_units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`, `color`, `created_at`, `updated_at`, `created_by`, `updated_by`, `allow_shortening_babies_in_pairs`) 
VALUES
(1, 'DM ', '2026-03-08 00:00:00', 270, 0, 'units', 0, 'Tif', 'US', 0, 'USD', '49 jambo', 'Dark brown', '2026-03-08 14:47:36', '2026-03-08 14:52:29', 0, 0, 0),
(2, 'Sable', '2026-03-12 00:00:00', 1680, 695, 'units', 0, '', 'GR', 0, 'USD', 'Tails', 'Light brown', '2026-03-12 10:16:26', '2026-03-27 10:18:20', 0, 0, 0)
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
('alert_customer_bank_kg_below', '5', '10', 'number'),
('alert_customer_bank_percents', '1', '1', 'boolean'),
('alert_customer_bank_percents_below', '30', '10', 'number'),
('alert_customer_bank_units', '1', '1', 'boolean'),
('alert_customer_bank_units_below', '200', '10', 'number'),
('alert_raw_material_item_kg', '1', '1', 'boolean'),
('alert_raw_material_item_kg_below', '10', '10', 'number'),
('alert_raw_material_item_percents', '1', '1', 'boolean'),
('alert_raw_material_item_percents_below', '20', '10', 'number'),
('alert_raw_material_item_units', '1', '1', 'boolean'),
('alert_raw_material_item_units_below', '300', '10', 'number'),
('alert_raw_material_total_kg', '1', '1', 'boolean'),
('alert_raw_material_total_kg_below', '7', '10', 'number'),
('alert_raw_material_total_units', '1', '1', 'boolean'),
('alert_raw_material_total_units_below', '250', '20', 'number'),
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
(9, '2026-03-27 10:18:21', 1, 495, 'to_customer_bank', 2, 12, 2, 0, 695, 495, -1)
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
(2, 'Avi', 'Bar', 'avibar', 'aviouslybar@gmail.com', '$2b$10$biw0c4d384VDXHnMl7cIFu.aLiLm.89ZMcvs7yCbiNJq6j.yrHAMW', 1, 0, '', null, null, null, '/uploads/images/users/1773931533050-profile.png', '', '2026-02-16 12:51:11'),
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
(83, 'RT11515', 11.5, 2.5, 1, 0),
(91, 'RT 115-155 (C7.5)', 11.5, 2.5, 2, 0),
(92, 'RT 7130 C9', 7, 2, 2, 0),
(93, 'RT 8130', 0, 2, 1, 0),
(94, 'O-10135', 0, 2, 1, 0),
(95, 'RT 115-155 (C10)', 11.5, 2.5, 1, 0)
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
(1904, 95, 'C4', 10)
as new_wings_babies
ON DUPLICATE KEY UPDATE
`parent_wing_id`=new_wings_babies.`parent_wing_id`, `position`=new_wings_babies.`position`, `length`=new_wings_babies.`length`;", 'SELECT \'Table wings_babies does not exist\'');
        -- Execute the prepared statement
        PREPARE stmt FROM @sql;
        EXECUTE stmt; #USING @value1, @value2;
        DEALLOCATE PREPARE stmt;


SET FOREIGN_KEY_CHECKS = 1;
