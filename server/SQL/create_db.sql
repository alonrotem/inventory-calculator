# Powershell:
# & cmd.exe /c """C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"" -u root -p12345678 < .\SQL\create_db.sql"

use inventory;

# CLEANUP
# -----------
# Drop foreign key if exists:
SET @table_name = 'babies', @fk_name = 'fk_baby_raw_material_parent'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'raw_materials', @fk_name = 'fk_raw_material_country'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'raw_materials', @fk_name = 'fk_raw_material_currency'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'wings_babies', @fk_name = 'fk_parent_wing_id'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @table_name = 'hats_wings', @fk_name = 'fk_hat_parent_wing_id'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;


drop table if exists raw_materials;
drop table if exists babies;
drop table if exists countries;
drop table if exists currencies;

# drop table if exists wing_positions;
drop table if exists wings;
drop table if exists wings_babies;

drop table if exists hats;
drop table if exists hats_wings;

# CREATE TABLES
# ---------------
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
('VN', 'Viet Nam', DEFAULT),
('VG', 'Virgin Islands (British)', DEFAULT),
('VI', 'Virgin Islands (US)', DEFAULT),
('WF', 'Wallis and Futuna', DEFAULT),
('EH', 'Western Sahara', DEFAULT),
('YE', 'Yemen', DEFAULT),
('ZM', 'Zambia', DEFAULT),
('ZW', 'Zimbabwe', DEFAULT);

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
  `id`            	INT NOT NULL auto_increment,
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
  `id`            INT NOT NULL auto_increment,
  `raw_material_parent_id` INT NOT NULL,
  `length`   	    float NOT NULL,
  `quantity`   	    INT NOT NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `created_by`	 int null,
  `updated_by`	 int null,
  PRIMARY KEY (`id`),
  CONSTRAINT fk_baby_raw_material_parent
  FOREIGN KEY (`raw_material_parent_id`) REFERENCES raw_materials(`id`) ON DELETE CASCADE
);

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
    PRIMARY KEY (`id`)
);

CREATE TABLE  IF NOT EXISTS wings_babies (
	/*`id`            INT NOT NULL auto_increment,*/
    `parent_wing_id` INT NOT NULL,
    `position`		VARCHAR(255) NOT NULL,
	`length`   	    float NOT NULL,
    /*PRIMARY KEY (`id`),*/
    CONSTRAINT fk_parent_wing_id
    FOREIGN KEY (`parent_wing_id`) REFERENCES wings(`id`) ON DELETE CASCADE
);

CREATE TABLE  IF NOT EXISTS `hats`
(
  `id`           INT NOT NULL auto_increment,
  `name` 		VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

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

# DATA SEED
# ---------
/*
  `notes`			varchar(255) NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `created_by`	 int null,
  `updated_by`	 int null,
*/

Insert into currencies (`code`, `name`, `symbol`, `order`)
values
  ('USD', 'US', '$', 10),
  ('EUR', 'EURO', _ucs2 0x20AC, 20),
  ('RUB', 'Ruble', _ucs2 0x20BD, 30);

INSERT INTO `raw_materials` (
  `id`, `name`, `purchased_at`, `weight`, `units`, `units_per_kg`, `vendor_name`, `origin_country`, 
  `price`, `currency`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`) 
VALUES 
(1,'Sable','2024-06-08',30,NULL,200,'JJ','US',30,'USD','This is a test material','2024-08-30 13:42:56','2024-08-31 13:04:00',1,1),
(2,'DM','2024-06-09',NULL,25,NULL,'MM','US',40,'EUR','This is a test material','2024-08-30 13:42:56','2024-08-31 17:14:00',1,1),
(3,'SM','2024-06-08',NULL,1000,112,'KK','RU',3,'USD','This is a test material','2024-08-30 13:42:56','2024-08-31 18:48:00',1,1),
(4,'BM','2024-06-08',NULL,750,135,NULL,'US',60,'EUR','This is a test material','2024-08-30 13:42:56','2024-08-31 18:51:00',1,1),
(5,'Canady','2024-06-08',50,NULL,7,'XY','US',10,'USD','This is a test material','2024-08-30 13:42:56','2024-08-31 13:06:00',1,1);

set @gold_id = (select id from raw_materials where name='Gold' limit 1);
set @silver_id = (select id from raw_materials where name='Silver' limit 1);
set @wood_id = (select id from raw_materials where name='Wood' limit 1);

INSERT INTO `babies` (
  `id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) 
VALUES 
  (1,1,5.5,100,'2024-08-30 13:42:00','2024-08-31 13:04:00',1,1),
  (2,1,6,200,'2024-08-30 13:42:00','2024-08-31 13:04:00',1,1),
  (3,1,10.5,356,'2024-08-30 13:42:00','2024-08-31 13:04:00',1,1),
  (4,2,12.5,50,'2024-08-30 13:42:00','2024-08-31 17:14:00',1,1),
  (5,2,9,6,'2024-08-30 13:42:00','2024-08-31 17:14:00',1,1),
  (6,2,13,3,'2024-08-30 13:42:00','2024-08-31 17:14:00',1,1),
  (7,4,8,650,'2024-08-30 13:42:00','2024-08-31 18:51:00',1,1),
  (8,4,9,510,'2024-08-30 13:42:00','2024-08-31 18:51:00',1,1),
  (9,4,10,40,'2024-08-30 13:42:00','2024-08-31 18:51:00',1,1),
  (10,1,7,1400,'2024-08-31 12:57:00','2024-08-31 13:04:00',1,1);

INSERT INTO `wings` (`name`) 
VALUES 
  ('RT100'),
  ('Wing RT90'),
  ('Wing 2'),
  ('Wing 3');

set @wing_id_RT100 = (select id from wings where name='RT100' limit 1);
set @wing_id_Wing_RT90 = (select id from wings where name='Wing RT90' limit 1);
set @wing_id_2 = (select id from wings where name='Wing 2' limit 1);

/*
	`id`            INT NOT NULL auto_increment,
    `parent_wing_id` INT NOT NULL,
    `position`		VARCHAR(255) NOT NULL,
	`length`   	    float NOT NULL,
*/
INSERT INTO `wings_babies` (`parent_wing_id`, `position`, `length`) 
VALUES
(@wing_id_RT100, 'L1', 5.5),
(@wing_id_RT100, 'L2', 6.5),
(@wing_id_RT100, 'L3', 7),
(@wing_id_RT100, 'L4', 7.5),
(@wing_id_RT100, 'L5', 8),
(@wing_id_RT100, 'L6', 8.5),
(@wing_id_RT100, 'L7', 9),
(@wing_id_RT100, 'L8', 9.5),
(@wing_id_RT100, 'R1', 5.5),
(@wing_id_RT100, 'R2', 6.5),
(@wing_id_RT100, 'R3', 7),
(@wing_id_RT100, 'R4', 7.5),
(@wing_id_RT100, 'R5', 8),
(@wing_id_RT100, 'R6', 8.5),
(@wing_id_RT100, 'R7', 9),
(@wing_id_RT100, 'R8', 9.5),
(@wing_id_RT100, 'TOP', 10),
(@wing_id_RT100, 'C1', 10),
(@wing_id_RT100, 'C2', 10),
(@wing_id_RT100, 'C3', 10),
(@wing_id_RT100, 'C4', 10),

(@wing_id_Wing_RT90, 'L1', 5.5),
(@wing_id_Wing_RT90, 'L2', 6),
(@wing_id_Wing_RT90, 'L3', 7),
(@wing_id_Wing_RT90, 'L4', 7.5),
(@wing_id_Wing_RT90, 'L5', 8.5),
(@wing_id_Wing_RT90, 'R1', 5.5),
(@wing_id_Wing_RT90, 'R2', 6.5),
(@wing_id_Wing_RT90, 'R3', 7),
(@wing_id_Wing_RT90, 'R4', 7.5),
(@wing_id_Wing_RT90, 'R5', 8.5),
(@wing_id_Wing_RT90, 'TOP', 9),
(@wing_id_Wing_RT90, 'C1', 10),
(@wing_id_Wing_RT90, 'C2', 10),
(@wing_id_Wing_RT90, 'C3', 10);
/*
set @left = (select id from wing_positions where name='Left' limit 1);
set @top = (select id from wing_positions where name='Top' limit 1);
set @right = (select id from wing_positions where name='Right' limit 1);
set @crown = (select id from wing_positions where name='Crown' limit 1);
*/
/*
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) 
VALUES 
  (13,'Stone',1,4,8.5),
  (15,'L1',1,1,5.5),
  (16,'L2',1,1,6),
  (17,'L3',1,1,7),
  (18,'L4',1,1,7.5),
  (19,'L5',1,1,8.5),
  (34,'R1',1,3,5.5),
  (35,'R2',1,3,6.5),
  (36,'R3',1,3,7),
  (37,'R4',1,3,7.5),
  (38,'R5',1,3,8.5),
  (53,'R90',1,2,9),
  (66,'DM3X10',1,4,10),
  (67,'DM10',1,4,10);
*/
insert into hats (name)
VALUES
	('Hat 1'), ('Hat 2'), ('Hat 3'), ('Hat 4'), ('Hat 5');

set @hat_id_1 = (select id from hats where name='Hat 1' limit 1);
set @hat_id_2 = (select id from hats where name='Hat 2' limit 1);
set @hat_id_3 = (select id from hats where name='Hat 3' limit 1);
set @hat_id_4 = (select id from hats where name='Hat 4' limit 1);
set @hat_id_5 = (select id from hats where name='Hat 5' limit 1);

set @wing_name_1 = (select name from wings where name='Wing 1' limit 1);
set @wing_name_2 = (select name from wings where name='Wing 2' limit 1);
set @wing_name_3 = (select name from wings where name='Wing 3' limit 1);
set @nonexisting_wing_name = 'Other wing';

insert into hats_wings(parent_hat_id, wing_name, wing_quantity)
VALUES
	(@hat_id_1, @wing_name_1, 10),
	(@hat_id_1, @wing_name_2, 9),
	(@hat_id_1, @wing_name_3, 4),
	(@hat_id_2, @wing_name_2, 8),
	(@hat_id_3, @wing_name_2, 3),
	(@hat_id_3, @wing_name_3, 6),
	(@hat_id_4, @wing_name_1, 2),
	(@hat_id_4, @wing_name_2, 40),
    (@hat_id_4, @nonexisting_wing_name, 3);

select "All done";
