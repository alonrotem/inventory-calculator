# Powershell:
# & cmd.exe /c """C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"" -u root -p12345678 < .\SQL\create_db.sql"

use inventory;

# CLEANUP
# -----------
# Drop foreign key if exists:
SET @table_name = 'babies', @fk_name = 'fk_baby_raw_material_parent'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'babies', @fk_name = 'babies_ibfk_1'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'raw_materials', @fk_name = 'fk_raw_material_country'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'raw_materials', @fk_name = 'fk_raw_material_currency'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
drop table if exists raw_materials;
drop table if exists babies;
drop table if exists countries;
drop table if exists currencies;

# CREATE TABLES
# ---------------
CREATE TABLE  IF NOT EXISTS `countries`
(
  `code`  VARCHAR(2) NOT NULL,
  `name`  VARCHAR(64) NOT NULL,
  `order` int default(999),
  PRIMARY KEY (`code`)
);

CREATE TABLE  IF NOT EXISTS `currencies`
(
  `code`  VARCHAR(3) NOT NULL,
  `name`  VARCHAR(64) NOT NULL,
  `symbol` VARCHAR(3) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci  NULL,
  `order` int default(999),
  PRIMARY KEY (`code`)
);

CREATE TABLE  IF NOT EXISTS `raw_materials`
(
  `id`            	INT NOT NULL auto_increment ,
  `name`          	VARCHAR(255) NOT NULL ,
  `purchased_at` 	DATE NOT NULL DEFAULT(CURRENT_DATE),
  `weight`   	    float NULL ,
  `units`			INT NULL,
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

CREATE TABLE  IF NOT EXISTS `babies`
(
  `id`            INT NOT NULL auto_increment ,
  `raw_material_parent_id` INT NOT NULL,
  `length`   	    INT NULL ,
  `quantity`   	    INT NULL ,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `created_by`	 int null,
  `updated_by`	 int null,
  PRIMARY KEY (`id`),
  CONSTRAINT fk_baby_raw_material_parent
  FOREIGN KEY (`raw_material_parent_id`) REFERENCES raw_materials(`id`) ON DELETE CASCADE
);

# DATA SEED
# ---------
/*
  `notes`			varchar(255) NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `created_by`	 int null,
  `updated_by`	 int null,
*/

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
('VN', 'Viet Nam', DEFAULT),
('VG', 'Virgin Islands (British)', DEFAULT),
('VI', 'Virgin Islands (US)', DEFAULT),
('WF', 'Wallis and Futuna', DEFAULT),
('EH', 'Western Sahara', DEFAULT),
('YE', 'Yemen', DEFAULT),
('ZM', 'Zambia', DEFAULT),
('ZW', 'Zimbabwe', DEFAULT);

Insert into currencies (`code`, `name`, `symbol`, `order`)
values
('USD', 'US', '$', 10),
('EUR', 'EURO', _ucs2 0x20AC, 20),
('RUB', 'Ruble', _ucs2 0x20BD, 30);

insert into raw_materials (
	`name`, `purchased_at`,  `weight`, `units`, 
    `units_per_kg`, `origin_country`, `vendor_name`, 
    `price`, `currency`, `notes`,
    `created_by`, `updated_by`)
values
# name		purchase	  wght	units	u/kg	org	  vnd	$	curr	notes 					 cr/upd	
('Gold',	'2024-06-08', 30, 	NULL,	NULL, 	'US', 'JJ',	30, 'USD', 'This is a test material' ,1, 1),
('Silver', 	'2024-06-08', NULL,	25, 	NULL, 	'US', 'MM',	40, 'EUR', 'This is a test material' ,1, 1),
('Metal', 	'2024-06-08', NULL, 1, 		3, 		'RU', 'KK',	50, 'USD', 'This is a test material' ,1, 1),
('Wood', 	'2024-06-08', NULL, 13, 	NULL, 	'US', NULL,	60, 'EUR', 'This is a test material' ,1, 1),
('Concrete','2024-06-08', 50, 	NULL, 	7, 		'US', 'XY',	10, 'USD', 'This is a test material' ,1, 1),
('Diamond', '2024-06-08', 14, 	NULL, 	NULL, 	'RU', 'RU',	20, 'EUR', 'This is a test material' ,1, 1),
('Plastic', '2024-06-08', NULL, 99, 	10, 	'US', NULL,	50, 'USD', 'This is a test material' ,1, 1),
('Bad shit','2024-06-08', NULL, 13, 	NULL, 	'US', NULL,	75, 'EUR', 'This is a test material' ,1, 1);

set @gold_id = (select id from raw_materials where name='Gold' limit 1);
set @silver_id = (select id from raw_materials where name='Silver' limit 1);

insert into babies (raw_material_parent_id, length, quantity, 
        created_at, updated_at, created_by, updated_by)
values
	(@gold_id, 10, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
	(@gold_id, 25, 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
	(@gold_id, 30, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
	(@silver_id, 30, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
	(@silver_id, 17, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
	(@silver_id, 30, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1);

select "All done";
