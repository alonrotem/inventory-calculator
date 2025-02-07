# Powershell:
# & cmd.exe /c """C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"" -u root -p12345678 < .\SQL\create_db.sql"

use inventory;
/*
CREATE TABLE  IF NOT EXISTS `test` (
`quantity_units`	ENUM('kg', 'units') DEFAULT 'kg'
);
SHOW COLUMNS FROM test LIKE 'quantity_units';
drop table if exists test;
*/
# CLEANUP
# -----------
# Drop foreign key if exists:
SET @table_name = 'babies', @fk_name = 'fk_baby_raw_material_customer_parent'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'raw_materials', @fk_name = 'fk_raw_material_country'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'raw_materials', @fk_name = 'fk_raw_material_currency'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'wings_babies', @fk_name = 'fk_parent_wing_id'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'hats_wings', @fk_name = 'fk_hat_parent_wing_id'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'customer_banks', @fk_name = 'fk_raw_material_customer'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'customer_banks', @fk_name = 'fk_customer_raw_material'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'customer_banks_babies', @fk_name = 'fk_customer_babies_bank'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

/*
drop table if exists users;

drop table if exists raw_materials;
drop table if exists customers;
drop table if exists customer_banks;
drop table if exists customer_banks_babies;
drop table if exists babies;
drop table if exists countries;
drop table if exists currencies;

# drop table if exists wing_positions;
drop table if exists wings;
drop table if exists wings_babies;

drop table if exists hats;
drop table if exists hats_wings;

drop table if exists transaction_history;
*/

# CREATE TABLES
# ---------------
/*
CREATE TABLE  IF NOT EXISTS `users` (
	`id` INT NOT NULL auto_increment,
	`username`  VARCHAR(64) NOT NULL,
    `email`  	VARCHAR(64) NOT NULL,
    `password`  VARCHAR(64) NOT NULL,
    PRIMARY KEY (`username`)
);

CREATE TABLE  IF NOT EXISTS `user_profiles` (
	
  CONSTRAINT fk_user_profile
  FOREIGN KEY (`currency`) REFERENCES currencies(`code`)
);*/

CREATE TABLE  IF NOT EXISTS `countries`
(
  `code`  VARCHAR(2) NOT NULL,
  `name`  VARCHAR(64) NOT NULL,
  `order` int default(999),
  PRIMARY KEY (`code`)
);

insert into countries (`code`, `name`, `order`)
values
('AF', 'Afghanistan', DEFAULT),
('AL', 'Albania', DEFAULT),
('DZ', 'Algeria', DEFAULT),
('AS', 'American Samoa', DEFAULT),
('AD', 'Andorra', DEFAULT),
('AO', 'Angola', DEFAULT),
('AI', 'Anguilla', DEFAULT),
('AQ', 'Antarctica', DEFAULT),
('AG', 'Antigua and Barbuda', DEFAULT),
('AR', 'Argentina', DEFAULT),
('AM', 'Armenia', DEFAULT),
('AW', 'Aruba', DEFAULT),
('AU', 'Australia', DEFAULT),
('AT', 'Austria', DEFAULT),
('AZ', 'Azerbaijan', DEFAULT),
('BS', 'Bahamas', DEFAULT),
('BH', 'Bahrain', DEFAULT),
('BD', 'Bangladesh', DEFAULT),
('BB', 'Barbados', DEFAULT),
('BY', 'Belarus', DEFAULT),
('BE', 'Belgium', DEFAULT),
('BZ', 'Belize', DEFAULT),
('BJ', 'Benin', DEFAULT),
('BM', 'Bermuda', DEFAULT),
('BT', 'Bhutan', DEFAULT),
('BO', 'Bolivia', DEFAULT),
('BQ', 'Bonaire', DEFAULT),
('BA', 'Bosnia and Herzegovina', DEFAULT),
('BW', 'Botswana', DEFAULT),
('BV', 'Bouvet Island', DEFAULT),
('BR', 'Brazil', DEFAULT),
('IO', 'British Indian Ocean Territory', DEFAULT),
('BN', 'Brunei Darussalam', DEFAULT),
('BG', 'Bulgaria', DEFAULT),
('BF', 'Burkina Faso', DEFAULT),
('BI', 'Burundi', DEFAULT),
('CV', 'Cabo Verde', DEFAULT),
('KH', 'Cambodia', DEFAULT),
('CM', 'Cameroon', DEFAULT),
('CA', 'Canada', DEFAULT),
('KY', 'Cayman Islands', DEFAULT),
('CF', 'Central African Republic', DEFAULT),
('TD', 'Chad', DEFAULT),
('CL', 'Chile', DEFAULT),
('CN', 'China', DEFAULT),
('CX', 'Christmas Island', DEFAULT),
('CC', 'Cocos Islands', DEFAULT),
('CO', 'Colombia', DEFAULT),
('KM', 'Comoros', DEFAULT),
('CD', 'Congo', DEFAULT),
('CG', 'Congo', DEFAULT),
('CK', 'Cook Islands', DEFAULT),
('CR', 'Costa Rica', DEFAULT),
('HR', 'Croatia', DEFAULT),
('CU', 'Cuba', DEFAULT),
('CW', 'Curaçao', DEFAULT),
('CY', 'Cyprus', DEFAULT),
('CZ', 'Czechia', DEFAULT),
('CI', 'Côte d''Ivoire', DEFAULT),
('DK', 'Denmark', DEFAULT),
('DJ', 'Djibouti', DEFAULT),
('DM', 'Dominica', DEFAULT),
('DO', 'Dominican Republic', DEFAULT),
('EC', 'Ecuador', DEFAULT),
('EG', 'Egypt', DEFAULT),
('SV', 'El Salvador', DEFAULT),
('GQ', 'Equatorial Guinea', DEFAULT),
('ER', 'Eritrea', DEFAULT),
('EE', 'Estonia', DEFAULT),
('SZ', 'Eswatini', DEFAULT),
('ET', 'Ethiopia', DEFAULT),
('FK', 'Falkland Islands', DEFAULT),
('FO', 'Faroe Islands', DEFAULT),
('FJ', 'Fiji', DEFAULT),
('FI', 'Finland', DEFAULT),
('FR', 'France', DEFAULT),
('GF', 'French Guiana', DEFAULT),
('PF', 'French Polynesia', DEFAULT),
('GA', 'Gabon', DEFAULT),
('GM', 'Gambia', DEFAULT),
('GE', 'Georgia', DEFAULT),
('DE', 'Germany', DEFAULT),
('GH', 'Ghana', DEFAULT),
('GI', 'Gibraltar', DEFAULT),
('GR', 'Greece', DEFAULT),
('GL', 'Greenland', DEFAULT),
('GD', 'Grenada', DEFAULT),
('GP', 'Guadeloupe', DEFAULT),
('GU', 'Guam', DEFAULT),
('GT', 'Guatemala', DEFAULT),
('GG', 'Guernsey', DEFAULT),
('GN', 'Guinea', DEFAULT),
('GW', 'Guinea-Bissau', DEFAULT),
('GY', 'Guyana', DEFAULT),
('HT', 'Haiti', DEFAULT),
('VA', 'Holy See', DEFAULT),
('HN', 'Honduras', DEFAULT),
('HK', 'Hong Kong', DEFAULT),
('HU', 'Hungary', DEFAULT),
('IS', 'Iceland', DEFAULT),
('IN', 'India', DEFAULT),
('ID', 'Indonesia', DEFAULT),
('IR', 'Iran', DEFAULT),
('IQ', 'Iraq', DEFAULT),
('IE', 'Ireland', DEFAULT),
('IM', 'Isle of Man', DEFAULT),
('IL', 'Israel', DEFAULT),
('IT', 'Italy', DEFAULT),
('JM', 'Jamaica', DEFAULT),
('JP', 'Japan', DEFAULT),
('JE', 'Jersey', DEFAULT),
('JO', 'Jordan', DEFAULT),
('KZ', 'Kazakhstan', DEFAULT),
('KE', 'Kenya', DEFAULT),
('KI', 'Kiribati', DEFAULT),
('KP', 'North Korea', DEFAULT),
('KR', 'South Korea', DEFAULT),
('KW', 'Kuwait', DEFAULT),
('KG', 'Kyrgyzstan', DEFAULT),
('LA', 'Laos', DEFAULT),
('LV', 'Latvia', DEFAULT),
('LB', 'Lebanon', DEFAULT),
('LS', 'Lesotho', DEFAULT),
('LR', 'Liberia', DEFAULT),
('LY', 'Libya', DEFAULT),
('LI', 'Liechtenstein', DEFAULT),
('LT', 'Lithuania', DEFAULT),
('LU', 'Luxembourg', DEFAULT),
('MO', 'Macao', DEFAULT),
('MG', 'Madagascar', DEFAULT),
('MW', 'Malawi', DEFAULT),
('MY', 'Malaysia', DEFAULT),
('MV', 'Maldives', DEFAULT),
('ML', 'Mali', DEFAULT),
('MT', 'Malta', DEFAULT),
('MH', 'Marshall Islands', DEFAULT),
('MQ', 'Martinique', DEFAULT),
('MR', 'Mauritania', DEFAULT),
('MU', 'Mauritius', DEFAULT),
('YT', 'Mayotte', DEFAULT),
('MX', 'Mexico', DEFAULT),
('FM', 'Micronesia', DEFAULT),
('MD', 'Moldova', DEFAULT),
('MC', 'Monaco', DEFAULT),
('MN', 'Mongolia', DEFAULT),
('ME', 'Montenegro', DEFAULT),
('MS', 'Montserrat', DEFAULT),
('MA', 'Morocco', DEFAULT),
('MZ', 'Mozambique', DEFAULT),
('MM', 'Myanmar', DEFAULT),
('NA', 'Namibia', DEFAULT),
('NR', 'Nauru', DEFAULT),
('NP', 'Nepal', DEFAULT),
('NL', 'Netherlands', DEFAULT),
('NC', 'New Caledonia', DEFAULT),
('NZ', 'New Zealand', DEFAULT),
('NI', 'Nicaragua', DEFAULT),
('NE', 'Niger', DEFAULT),
('NG', 'Nigeria', DEFAULT),
('NU', 'Niue', DEFAULT),
('NF', 'Norfolk Island', DEFAULT),
('MP', 'Northern Mariana Islands', DEFAULT),
('NO', 'Norway', DEFAULT),
('OM', 'Oman', DEFAULT),
('PK', 'Pakistan', DEFAULT),
('PW', 'Palau', DEFAULT),
('PS', 'Palestine, State of', DEFAULT),
('PA', 'Panama', DEFAULT),
('PG', 'Papua New Guinea', DEFAULT),
('PY', 'Paraguay', DEFAULT),
('PE', 'Peru', DEFAULT),
('PH', 'Philippines', DEFAULT),
('PN', 'Pitcairn', DEFAULT),
('PL', 'Poland', DEFAULT),
('PT', 'Portugal', DEFAULT),
('PR', 'Puerto Rico', DEFAULT),
('QA', 'Qatar', DEFAULT),
('MK', 'Macedonia', DEFAULT),
('RO', 'Romania', DEFAULT),
('RU', 'Russia', 2),
('RW', 'Rwanda', DEFAULT),
('RE', 'Reunion', DEFAULT),
('BL', 'St. Barthelemy', DEFAULT),
('SH', 'St. Helena', DEFAULT),
('KN', 'St. Kitts and Nevis', DEFAULT),
('LC', 'St. Lucia', DEFAULT),
('MF', 'St. Martin', DEFAULT),
('PM', 'St. Pierre and Miquelon', DEFAULT),
('VC', 'St. Vincent and the Grenadines', DEFAULT),
('WS', 'Samoa', DEFAULT),
('SM', 'San Marino', DEFAULT),
('ST', 'Sao Tome and Principe', DEFAULT),
('SA', 'Saudi Arabia', DEFAULT),
('SN', 'Senegal', DEFAULT),
('RS', 'Serbia', DEFAULT),
('SC', 'Seychelles', DEFAULT),
('SL', 'Sierra Leone', DEFAULT),
('SG', 'Singapore', DEFAULT),
('SX', 'Sint Maarten', DEFAULT),
('SK', 'Slovakia', DEFAULT),
('SI', 'Slovenia', DEFAULT),
('SB', 'Solomon Islands', DEFAULT),
('SO', 'Somalia', DEFAULT),
('ZA', 'South Africa', DEFAULT),
('SS', 'South Sudan', DEFAULT),
('ES', 'Spain', DEFAULT),
('LK', 'Sri Lanka', DEFAULT),
('SD', 'Sudan', DEFAULT),
('SR', 'Suriname', DEFAULT),
('SJ', 'Svalbard and Jan Mayen', DEFAULT),
('SE', 'Sweden', DEFAULT),
('CH', 'Switzerland', DEFAULT),
('SY', 'Syrian Arab Republic', DEFAULT),
('TW', 'Taiwan', DEFAULT),
('TJ', 'Tajikistan', DEFAULT),
('TZ', 'Tanzania, United Republic of', DEFAULT),
('TH', 'Thailand', DEFAULT),
('TL', 'Timor-Leste', DEFAULT),
('TG', 'Togo', DEFAULT),
('TK', 'Tokelau', DEFAULT),
('TO', 'Tonga', DEFAULT),
('TT', 'Trinidad and Tobago', DEFAULT),
('TN', 'Tunisia', DEFAULT),
('TR', 'Turkey', DEFAULT),
('TM', 'Turkmenistan', DEFAULT),
('TC', 'Turks and Caicos Islands', DEFAULT),
('TV', 'Tuvalu', DEFAULT),
('UG', 'Uganda', DEFAULT),
('UA', 'Ukraine', DEFAULT),
('AE', 'United Arab Emirates', DEFAULT),
('GB', 'United Kingdom', DEFAULT),
('US', 'United States', 1),
('UY', 'Uruguay', DEFAULT),
('UZ', 'Uzbekistan', DEFAULT),
('VU', 'Vanuatu', DEFAULT),
('VE', 'Venezuela', DEFAULT),
('VN', 'Vietnam', DEFAULT),
('VG', 'Virgin Islands (British)', DEFAULT),
('VI', 'Virgin Islands (US)', DEFAULT),
('WF', 'Wallis and Futuna', DEFAULT),
('EH', 'Western Sahara', DEFAULT),
('YE', 'Yemen', DEFAULT),
('ZM', 'Zambia', DEFAULT),
('ZW', 'Zimbabwe', DEFAULT) AS new_countries
ON DUPLICATE KEY UPDATE
name=new_countries.name, `order`=new_countries.order;

CREATE TABLE  IF NOT EXISTS `currencies`
(
  `code`  VARCHAR(3) NOT NULL,
  `name`  VARCHAR(64) NOT NULL,
  `symbol` VARCHAR(3) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci  NULL,
  `order` int default(999),
  PRIMARY KEY (`code`)
);

Insert into currencies (`code`, `name`, `symbol`, `order`)
values
  ('USD', 'US', '$', 10),
  ('EUR', 'EURO', _ucs2 0x20AC, 20),
  ('RUB', 'Ruble', _ucs2 0x20BD, 30) AS new_currencies
ON DUPLICATE KEY UPDATE
name=new_currencies.name, symbol= new_currencies.symbol, `order`=new_currencies.order;

/*
	raw_materials
		purchase quantity
        current remaining quantity
    
    customers
		customer bank
			current quantity
            assigned to work
            
		customer bank work allocation
			stock
            remaining quantity
    
		transaction history
			raw material id
            transaction type:
				added raw material
                move to customer bank
                allocate to customer work
			transaction quantity
*/
# raw_materials -> customer_banks -> customer_banks_babies -> babies

CREATE TABLE  IF NOT EXISTS `raw_materials`
(
  `id`            	INT NOT NULL auto_increment,
  `name`          	VARCHAR(255) NOT NULL ,
  `purchased_at` 	DATE NOT NULL DEFAULT(CURRENT_DATE),
  `purchase_quantity`   	    float NOT NULL ,
  `remaining_quantity`   	    float NOT NULL ,
  `quantity_units`	ENUM('kg', 'units') DEFAULT 'kg',
  `units_per_kg`	float NULL,
  `vendor_name`		varchar(255) NULL,
  `origin_country`	VARCHAR(2) NULL,
  `price`			float NULL,
  `currency`		varchar(3) NULL,
  `notes`			varchar(255) NULL,
  `created_at`    	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`    	DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `created_by`	 	int null,
  `updated_by`	 	int null,
  PRIMARY KEY (`id`),
  CONSTRAINT fk_raw_material_country
  FOREIGN KEY (`origin_country`) REFERENCES countries(`code`),
  CONSTRAINT fk_raw_material_currency
  FOREIGN KEY (`currency`) REFERENCES currencies(`code`)
);

CREATE TABLE  IF NOT EXISTS `customers` (
	`id`            	INT NOT NULL auto_increment,
	`name`          	VARCHAR(255) NOT NULL ,
	`business_name`     VARCHAR(255) NULL ,
	`email`     		VARCHAR(255) NULL ,
	`phone`     		VARCHAR(255) NULL ,
	`tax_id`     		VARCHAR(255) NULL ,
    `notes`				varchar(255) NULL,
	`created_at`    	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`updated_at`    	DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`created_by`	 	int null,
	`updated_by`	 	int null,    
    PRIMARY KEY (`id`)
);

CREATE TABLE  IF NOT EXISTS `customer_banks` (
	`id`            			INT NOT NULL auto_increment,
	`customer_id`            	INT NOT NULL,
    `raw_material_id`            INT NOT NULL,
	`quantity`   	    		float NOT NULL,
    `remaining_quantity`   	    float NOT NULL ,
	PRIMARY KEY (`id`),
  CONSTRAINT fk_raw_material_customer
  FOREIGN KEY (`customer_id`) REFERENCES customers(`id`)  ON DELETE CASCADE,
  CONSTRAINT fk_customer_raw_material
  FOREIGN KEY (`raw_material_id`) REFERENCES raw_materials(`id`)  ON DELETE CASCADE
);

# Withdrawn for work
CREATE TABLE  IF NOT EXISTS `customer_banks_babies` (
	`id`            			INT NOT NULL auto_increment,
    `customer_bank_id`          INT NOT NULL,
	`quantity`   	    		float NOT NULL,
    `remaining_quantity`   	    float NOT NULL ,
    PRIMARY KEY (`id`),
    CONSTRAINT fk_customer_babies_bank
	FOREIGN KEY (`customer_bank_id`) REFERENCES customer_banks(`id`)  ON DELETE CASCADE
);

CREATE TABLE  IF NOT EXISTS `babies`
(
  `id`            INT NOT NULL auto_increment,
  `customer_banks_babies_id` INT NOT NULL,
  `length`   	    float NOT NULL,
  `quantity`   	    INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT fk_baby_raw_material_customer_parent
  FOREIGN KEY (`customer_banks_babies_id`) REFERENCES customer_banks_babies(`id`) ON DELETE CASCADE
);

CREATE TABLE  IF NOT EXISTS transaction_history (
	`id`            	INT NOT NULL auto_increment,
    `date`    			DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `added_by` INT,
    `transaction_quantity`     float NOT NULL,
    `transaction_type`	ENUM(
		'raw_material_purchase', 
        'to_customer_bank', 
        'deleted_customer_bank',
        'customer_bank_allocate_to_Work',
        'customer_bank_allocation_deleted',
        'customer_bank_allocation_merged'
	) NOT NULL,
    
    # involved banks in this transaction:
	`raw_material_id` 	INT,
    `customer_id` 		INT,
    `customer_bank_id` 	INT,
    `customer_banks_babies_id` INT,
		
	# track keeping on quantities at the time of this transaction:
    `cur_raw_material_quantity` float,
    `cur_customer_bank_quantity` float,
    `cur_banks_babies_allocation_quantity` float,
        
    PRIMARY KEY (`id`)
);

ALTER TABLE
    `transaction_history`
MODIFY COLUMN
    `transaction_type` enum(
		'raw_material_purchase', 
        'to_customer_bank', 
        'deleted_customer_bank',
        'customer_bank_allocate_to_Work',
        'customer_bank_allocation_deleted',
        'customer_bank_allocation_merged'
    )
NOT NULL;

/*
CREATE TABLE  IF NOT EXISTS wing_positions (
	`id` 	INT NOT NULL,
	`name`	VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

insert into wing_positions (id, name)
VALUES 
	(1, 'Left'),
    (2, 'Top'),
    (3, 'Right'),
    (4, 'Crown');
*/

CREATE TABLE  IF NOT EXISTS wings (
	`id`    INT NOT NULL auto_increment,
    `name`	VARCHAR(255) NOT NULL,
    `width`	float,
    PRIMARY KEY (`id`)
);

CREATE TABLE  IF NOT EXISTS wings_babies (
	`id`            INT NOT NULL auto_increment,
    `parent_wing_id` INT NOT NULL,
    `position`		VARCHAR(255) NOT NULL,
	`length`   	    float NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT fk_parent_wing_id
    FOREIGN KEY (`parent_wing_id`) REFERENCES wings(`id`) ON DELETE CASCADE
);

CREATE TABLE  IF NOT EXISTS `hats`
(
  `id`           INT NOT NULL auto_increment,
  `name` 		VARCHAR(255) NOT NULL,
  `hat_material` VARCHAR(255) NULL,
  `crown_material` VARCHAR(255) NULL,
   `photo` VARCHAR(255) null,
  PRIMARY KEY (`id`)
);

# -----------------------------------
# Add column if doesn't exist...
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_NAME = 'hats' 
    AND COLUMN_NAME = 'photo' 
    AND TABLE_SCHEMA = DATABASE()
);
SET @query = IF(@col_exists = 0, 'ALTER TABLE hats ADD COLUMN photo VARCHAR(255) null;', 'SELECT 1');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
# End: Add column if doesn't exist
# -----------------------------------

CREATE TABLE  IF NOT EXISTS `hats_wings`
(
  `id`           	INT NOT NULL auto_increment,
  `parent_hat_id`	INT NOT NULL,
  `wing_name`		VARCHAR(255) NULL,
  `wing_quantity`	INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT fk_hat_parent_wing_id
  FOREIGN KEY (`parent_hat_id`) REFERENCES hats(`id`) ON DELETE CASCADE
);

CREATE TABLE  IF NOT EXISTS `settings`
(
  `key`		VARCHAR(255) NOT NULL,
  `value`	VARCHAR(255) NULL,
  `default_value`	VARCHAR(255) NULL,
  `value_type` ENUM(
		'string', 
		'number',
		'boolean'
	) NOT NULL,
	PRIMARY KEY (`key`)
);
Insert into `settings` (`key`, `value`, `default_value`, `value_type`)
VALUES
/* Raw material totals */
-- Alert when raw material total kg quantity below ___ kg
('alert_raw_material_total_kg', '1', '1', 'boolean'),
('alert_raw_material_total_kg_below', '10', '10', 'number'),
-- Alert when raw material total unit quantity below ___ unit
('alert_raw_material_total_units', '1', '1', 'boolean'),
('alert_raw_material_total_units_below', '20', '20', 'number'),

/* Raw material single item follow up */
-- alert if a raw material item quantity remains less than __% percents
('alert_raw_material_item_percents', '1', '1', 'boolean'),
('alert_raw_material_item_percents_below', '10', '10', 'number'),
-- alert if a raw material item quantity less than __ kg
('alert_raw_material_item_kg', '1', '1', 'boolean'),
('alert_raw_material_item_kg_below', '10', '10', 'number'),
-- alert if a raw material item quantity less than __ units
('alert_raw_material_item_units', '1', '1', 'boolean'),
('alert_raw_material_item_units_below', '10', '10', 'number'),
-- Mark the item in YELLOW, if raw material item quantity less than __%
('mark_yellow_raw_material_item_percents', '1', '1', 'boolean'),
('mark_yellow_raw_material_item_percents_below', '30', '30', 'number'),
-- Mark the item in RED, if raw material item quantity less than __%
('mark_red_raw_material_item_percents', '1', '1', 'boolean'),
('mark_red_raw_material_item_percents_below', '10', '10', 'number'),

/* Raw material in customer banks: */
-- alert if a customer bank quantity remains less than __% percents
('alert_customer_bank_percents', '1', '1', 'boolean'),
('alert_customer_bank_percents_below', '10', '10', 'number'),
-- alert if a customer bank quantity less than __ kg
('alert_customer_bank_kg', '1', '1', 'boolean'),
('alert_customer_bank_kg_below', '10', '10', 'number'),
-- alert if a customer bank quantity less than __ units
('alert_customer_bank_units', '1', '1', 'boolean'),
('alert_customer_bank_units_below', '10', '10', 'number'),

-- Mark the customer bankin YELLOW, if raw material item quantity less than __%
('mark_yellow_customer_bank_percents', '1', '1', 'boolean'),
('mark_yellow_customer_bank_percents_below', '30', '30', 'number'),
-- Mark the customer bank in RED, if raw material item quantity less than __%
('mark_red_customer_bank_percents', '1', '1', 'boolean'),
('mark_red_customer_bank_percents_below', '10', '10', 'number')
AS new_settings
ON DUPLICATE KEY UPDATE
	value=new_settings.value, 
	default_value=new_settings.default_value, 
	value_type=new_settings.value_type;

select "All done";
