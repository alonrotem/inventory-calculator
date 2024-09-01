-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: inventory
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `babies`
--

LOCK TABLES `babies` WRITE;
/*!40000 ALTER TABLE `babies` DISABLE KEYS */;
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (1,1,5.5,100,'2024-08-30 13:42:00','2024-08-31 13:04:00',1,1);
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (2,1,6,200,'2024-08-30 13:42:00','2024-08-31 13:04:00',1,1);
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (3,1,10.5,356,'2024-08-30 13:42:00','2024-08-31 13:04:00',1,1);
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (4,2,12.5,50,'2024-08-30 13:42:00','2024-08-31 17:14:00',1,1);
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (5,2,9,6,'2024-08-30 13:42:00','2024-08-31 17:14:00',1,1);
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (6,2,13,3,'2024-08-30 13:42:00','2024-08-31 17:14:00',1,1);
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (7,4,8,650,'2024-08-30 13:42:00','2024-08-31 18:51:00',1,1);
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (8,4,9,510,'2024-08-30 13:42:00','2024-08-31 18:51:00',1,1);
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (9,4,10,40,'2024-08-30 13:42:00','2024-08-31 18:51:00',1,1);
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (10,1,7,1400,'2024-08-31 12:57:00','2024-08-31 13:04:00',1,1);
/*!40000 ALTER TABLE `babies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AD','Andorra',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AE','United Arab Emirates',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AF','Afghanistan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AG','Antigua and Barbuda',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AI','Anguilla',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AL','Albania',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AM','Armenia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AO','Angola',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AQ','Antarctica',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AR','Argentina',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AS','American Samoa',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AT','Austria',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AU','Australia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AW','Aruba',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AZ','Azerbaijan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BA','Bosnia and Herzegovina',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BB','Barbados',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BD','Bangladesh',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BE','Belgium',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BF','Burkina Faso',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BG','Bulgaria',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BH','Bahrain',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BI','Burundi',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BJ','Benin',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BL','St. Barthelemy',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BM','Bermuda',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BN','Brunei Darussalam',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BO','Bolivia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BQ','Bonaire',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BR','Brazil',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BS','Bahamas',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BT','Bhutan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BV','Bouvet Island',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BW','Botswana',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BY','Belarus',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('BZ','Belize',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CA','Canada',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CC','Cocos Islands',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CD','Congo',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CF','Central African Republic',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CG','Congo',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CH','Switzerland',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CI','CÃ´te d\'Ivoire',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CK','Cook Islands',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CL','Chile',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CM','Cameroon',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CN','China',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CO','Colombia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CR','Costa Rica',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CU','Cuba',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CV','Cabo Verde',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CW','CuraÃ§ao',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CX','Christmas Island',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CY','Cyprus',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('CZ','Czechia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('DE','Germany',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('DJ','Djibouti',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('DK','Denmark',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('DM','Dominica',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('DO','Dominican Republic',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('DZ','Algeria',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('EC','Ecuador',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('EE','Estonia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('EG','Egypt',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('EH','Western Sahara',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('ER','Eritrea',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('ES','Spain',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('ET','Ethiopia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('FI','Finland',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('FJ','Fiji',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('FK','Falkland Islands',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('FM','Micronesia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('FO','Faroe Islands',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('FR','France',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GA','Gabon',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GB','United Kingdom',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GD','Grenada',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GE','Georgia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GF','French Guiana',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GG','Guernsey',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GH','Ghana',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GI','Gibraltar',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GL','Greenland',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GM','Gambia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GN','Guinea',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GP','Guadeloupe',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GQ','Equatorial Guinea',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GR','Greece',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GT','Guatemala',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GU','Guam',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GW','Guinea-Bissau',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('GY','Guyana',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('HK','Hong Kong',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('HN','Honduras',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('HR','Croatia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('HT','Haiti',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('HU','Hungary',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('ID','Indonesia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('IE','Ireland',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('IL','Israel',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('IM','Isle of Man',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('IN','India',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('IO','British Indian Ocean Territory',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('IQ','Iraq',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('IR','Iran',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('IS','Iceland',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('IT','Italy',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('JE','Jersey',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('JM','Jamaica',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('JO','Jordan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('JP','Japan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KE','Kenya',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KG','Kyrgyzstan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KH','Cambodia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KI','Kiribati',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KM','Comoros',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KN','St. Kitts and Nevis',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KP','North Korea',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KR','South Korea',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KW','Kuwait',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KY','Cayman Islands',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('KZ','Kazakhstan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LA','Laos',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LB','Lebanon',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LC','St. Lucia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LI','Liechtenstein',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LK','Sri Lanka',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LR','Liberia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LS','Lesotho',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LT','Lithuania',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LU','Luxembourg',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LV','Latvia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('LY','Libya',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MA','Morocco',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MC','Monaco',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MD','Moldova',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('ME','Montenegro',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MF','St. Martin',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MG','Madagascar',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MH','Marshall Islands',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MK','Macedonia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('ML','Mali',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MM','Myanmar',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MN','Mongolia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MO','Macao',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MP','Northern Mariana Islands',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MQ','Martinique',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MR','Mauritania',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MS','Montserrat',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MT','Malta',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MU','Mauritius',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MV','Maldives',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MW','Malawi',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MX','Mexico',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MY','Malaysia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('MZ','Mozambique',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NA','Namibia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NC','New Caledonia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NE','Niger',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NF','Norfolk Island',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NG','Nigeria',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NI','Nicaragua',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NL','Netherlands',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NO','Norway',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NP','Nepal',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NR','Nauru',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NU','Niue',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('NZ','New Zealand',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('OM','Oman',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PA','Panama',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PE','Peru',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PF','French Polynesia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PG','Papua New Guinea',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PH','Philippines',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PK','Pakistan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PL','Poland',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PM','St. Pierre and Miquelon',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PN','Pitcairn',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PR','Puerto Rico',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PS','Palestine, State of',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PT','Portugal',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PW','Palau',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('PY','Paraguay',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('QA','Qatar',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('RE','Reunion',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('RO','Romania',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('RS','Serbia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('RU','Russia',2);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('RW','Rwanda',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SA','Saudi Arabia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SB','Solomon Islands',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SC','Seychelles',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SD','Sudan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SE','Sweden',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SG','Singapore',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SH','St. Helena',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SI','Slovenia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SJ','Svalbard and Jan Mayen',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SK','Slovakia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SL','Sierra Leone',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SM','San Marino',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SN','Senegal',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SO','Somalia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SR','Suriname',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SS','South Sudan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('ST','Sao Tome and Principe',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SV','El Salvador',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SX','Sint Maarten',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SY','Syrian Arab Republic',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('SZ','Eswatini',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TC','Turks and Caicos Islands',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TD','Chad',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TG','Togo',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TH','Thailand',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TJ','Tajikistan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TK','Tokelau',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TL','Timor-Leste',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TM','Turkmenistan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TN','Tunisia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TO','Tonga',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TR','Turkey',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TT','Trinidad and Tobago',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TV','Tuvalu',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TW','Taiwan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('TZ','Tanzania, United Republic of',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('UA','Ukraine',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('UG','Uganda',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('US','United States',1);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('UY','Uruguay',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('UZ','Uzbekistan',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('VA','Holy See',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('VC','St. Vincent and the Grenadines',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('VE','Venezuela',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('VG','Virgin Islands (British)',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('VI','Virgin Islands (US)',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('VN','Viet Nam',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('VU','Vanuatu',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('WF','Wallis and Futuna',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('WS','Samoa',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('YE','Yemen',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('YT','Mayotte',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('ZA','South Africa',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('ZM','Zambia',999);
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('ZW','Zimbabwe',999);
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` (`code`, `name`, `symbol`, `order`) VALUES ('EUR','EURO','€',20);
INSERT INTO `currencies` (`code`, `name`, `symbol`, `order`) VALUES ('RUB','Ruble','₽',30);
INSERT INTO `currencies` (`code`, `name`, `symbol`, `order`) VALUES ('USD','US','$',10);
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `raw_materials`
--

LOCK TABLES `raw_materials` WRITE;
/*!40000 ALTER TABLE `raw_materials` DISABLE KEYS */;
INSERT INTO `raw_materials` (`id`, `name`, `purchased_at`, `weight`, `units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (1,'Sable','2024-06-08',30,NULL,200,'JJ','US',30,'USD','This is a test material','2024-08-30 13:42:56','2024-08-31 13:04:00',1,1);
INSERT INTO `raw_materials` (`id`, `name`, `purchased_at`, `weight`, `units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (2,'DM','2024-06-09',NULL,25,NULL,'MM','US',40,'EUR','This is a test material','2024-08-30 13:42:56','2024-08-31 17:14:00',1,1);
INSERT INTO `raw_materials` (`id`, `name`, `purchased_at`, `weight`, `units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (3,'SM','2024-06-08',NULL,1000,112,'KK','RU',3,'USD','This is a test material','2024-08-30 13:42:56','2024-08-31 18:48:00',1,1);
INSERT INTO `raw_materials` (`id`, `name`, `purchased_at`, `weight`, `units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (4,'BM','2024-06-08',NULL,750,135,NULL,'US',60,'EUR','This is a test material','2024-08-30 13:42:56','2024-08-31 18:51:00',1,1);
INSERT INTO `raw_materials` (`id`, `name`, `purchased_at`, `weight`, `units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (5,'Canady','2024-06-08',50,NULL,7,'XY','US',10,'USD','This is a test material','2024-08-30 13:42:56','2024-08-31 13:06:00',1,1);
/*!40000 ALTER TABLE `raw_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `wing_positions`
--

LOCK TABLES `wing_positions` WRITE;
/*!40000 ALTER TABLE `wing_positions` DISABLE KEYS */;
INSERT INTO `wing_positions` (`id`, `name`) VALUES (1,'Left');
INSERT INTO `wing_positions` (`id`, `name`) VALUES (2,'Top');
INSERT INTO `wing_positions` (`id`, `name`) VALUES (3,'Right');
INSERT INTO `wing_positions` (`id`, `name`) VALUES (4,'Crown');
/*!40000 ALTER TABLE `wing_positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `wings`
--

LOCK TABLES `wings` WRITE;
/*!40000 ALTER TABLE `wings` DISABLE KEYS */;
INSERT INTO `wings` (`id`, `name`) VALUES (1,'Wing RT90');
INSERT INTO `wings` (`id`, `name`) VALUES (2,'Wing 2');
INSERT INTO `wings` (`id`, `name`) VALUES (3,'Wing 3');
/*!40000 ALTER TABLE `wings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `wings_babies`
--

LOCK TABLES `wings_babies` WRITE;
/*!40000 ALTER TABLE `wings_babies` DISABLE KEYS */;
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (13,'Stone',1,4,8.5);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (15,'L1',1,1,5.5);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (16,'L2',1,1,6);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (17,'L3',1,1,7);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (18,'L4',1,1,7.5);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (19,'L5',1,1,8.5);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (34,'R1',1,3,5.5);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (35,'R2',1,3,6.5);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (36,'R3',1,3,7);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (37,'R4',1,3,7.5);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (38,'R5',1,3,8.5);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (53,'R90',1,2,9);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (66,'DM3X10',1,4,10);
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (67,'DM10',1,4,10);
/*!40000 ALTER TABLE `wings_babies` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-01 22:57:13
