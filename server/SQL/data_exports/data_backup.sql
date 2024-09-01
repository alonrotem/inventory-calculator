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
INSERT INTO `babies` (`id`, `raw_material_parent_id`, `length`, `quantity`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (1,1,5.5,100,'2024-08-30 13:42:00','2024-08-31 13:04:00',1,1),(2,1,6,200,'2024-08-30 13:42:00','2024-08-31 13:04:00',1,1),(3,1,10.5,356,'2024-08-30 13:42:00','2024-08-31 13:04:00',1,1),(4,2,12.5,50,'2024-08-30 13:42:00','2024-08-31 17:14:00',1,1),(5,2,9,6,'2024-08-30 13:42:00','2024-08-31 17:14:00',1,1),(6,2,13,3,'2024-08-30 13:42:00','2024-08-31 17:14:00',1,1),(7,4,8,650,'2024-08-30 13:42:00','2024-08-31 18:51:00',1,1),(8,4,9,510,'2024-08-30 13:42:00','2024-08-31 18:51:00',1,1),(9,4,10,40,'2024-08-30 13:42:00','2024-08-31 18:51:00',1,1),(10,1,7,1400,'2024-08-31 12:57:00','2024-08-31 13:04:00',1,1);
/*!40000 ALTER TABLE `babies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` (`code`, `name`, `order`) VALUES ('AD','Andorra',999),('AE','United Arab Emirates',999),('AF','Afghanistan',999),('AG','Antigua and Barbuda',999),('AI','Anguilla',999),('AL','Albania',999),('AM','Armenia',999),('AO','Angola',999),('AQ','Antarctica',999),('AR','Argentina',999),('AS','American Samoa',999),('AT','Austria',999),('AU','Australia',999),('AW','Aruba',999),('AZ','Azerbaijan',999),('BA','Bosnia and Herzegovina',999),('BB','Barbados',999),('BD','Bangladesh',999),('BE','Belgium',999),('BF','Burkina Faso',999),('BG','Bulgaria',999),('BH','Bahrain',999),('BI','Burundi',999),('BJ','Benin',999),('BL','St. Barthelemy',999),('BM','Bermuda',999),('BN','Brunei Darussalam',999),('BO','Bolivia',999),('BQ','Bonaire',999),('BR','Brazil',999),('BS','Bahamas',999),('BT','Bhutan',999),('BV','Bouvet Island',999),('BW','Botswana',999),('BY','Belarus',999),('BZ','Belize',999),('CA','Canada',999),('CC','Cocos Islands',999),('CD','Congo',999),('CF','Central African Republic',999),('CG','Congo',999),('CH','Switzerland',999),('CI','CÃ´te d\'Ivoire',999),('CK','Cook Islands',999),('CL','Chile',999),('CM','Cameroon',999),('CN','China',999),('CO','Colombia',999),('CR','Costa Rica',999),('CU','Cuba',999),('CV','Cabo Verde',999),('CW','CuraÃ§ao',999),('CX','Christmas Island',999),('CY','Cyprus',999),('CZ','Czechia',999),('DE','Germany',999),('DJ','Djibouti',999),('DK','Denmark',999),('DM','Dominica',999),('DO','Dominican Republic',999),('DZ','Algeria',999),('EC','Ecuador',999),('EE','Estonia',999),('EG','Egypt',999),('EH','Western Sahara',999),('ER','Eritrea',999),('ES','Spain',999),('ET','Ethiopia',999),('FI','Finland',999),('FJ','Fiji',999),('FK','Falkland Islands',999),('FM','Micronesia',999),('FO','Faroe Islands',999),('FR','France',999),('GA','Gabon',999),('GB','United Kingdom',999),('GD','Grenada',999),('GE','Georgia',999),('GF','French Guiana',999),('GG','Guernsey',999),('GH','Ghana',999),('GI','Gibraltar',999),('GL','Greenland',999),('GM','Gambia',999),('GN','Guinea',999),('GP','Guadeloupe',999),('GQ','Equatorial Guinea',999),('GR','Greece',999),('GT','Guatemala',999),('GU','Guam',999),('GW','Guinea-Bissau',999),('GY','Guyana',999),('HK','Hong Kong',999),('HN','Honduras',999),('HR','Croatia',999),('HT','Haiti',999),('HU','Hungary',999),('ID','Indonesia',999),('IE','Ireland',999),('IL','Israel',999),('IM','Isle of Man',999),('IN','India',999),('IO','British Indian Ocean Territory',999),('IQ','Iraq',999),('IR','Iran',999),('IS','Iceland',999),('IT','Italy',999),('JE','Jersey',999),('JM','Jamaica',999),('JO','Jordan',999),('JP','Japan',999),('KE','Kenya',999),('KG','Kyrgyzstan',999),('KH','Cambodia',999),('KI','Kiribati',999),('KM','Comoros',999),('KN','St. Kitts and Nevis',999),('KP','North Korea',999),('KR','South Korea',999),('KW','Kuwait',999),('KY','Cayman Islands',999),('KZ','Kazakhstan',999),('LA','Laos',999),('LB','Lebanon',999),('LC','St. Lucia',999),('LI','Liechtenstein',999),('LK','Sri Lanka',999),('LR','Liberia',999),('LS','Lesotho',999),('LT','Lithuania',999),('LU','Luxembourg',999),('LV','Latvia',999),('LY','Libya',999),('MA','Morocco',999),('MC','Monaco',999),('MD','Moldova',999),('ME','Montenegro',999),('MF','St. Martin',999),('MG','Madagascar',999),('MH','Marshall Islands',999),('MK','Macedonia',999),('ML','Mali',999),('MM','Myanmar',999),('MN','Mongolia',999),('MO','Macao',999),('MP','Northern Mariana Islands',999),('MQ','Martinique',999),('MR','Mauritania',999),('MS','Montserrat',999),('MT','Malta',999),('MU','Mauritius',999),('MV','Maldives',999),('MW','Malawi',999),('MX','Mexico',999),('MY','Malaysia',999),('MZ','Mozambique',999),('NA','Namibia',999),('NC','New Caledonia',999),('NE','Niger',999),('NF','Norfolk Island',999),('NG','Nigeria',999),('NI','Nicaragua',999),('NL','Netherlands',999),('NO','Norway',999),('NP','Nepal',999),('NR','Nauru',999),('NU','Niue',999),('NZ','New Zealand',999),('OM','Oman',999),('PA','Panama',999),('PE','Peru',999),('PF','French Polynesia',999),('PG','Papua New Guinea',999),('PH','Philippines',999),('PK','Pakistan',999),('PL','Poland',999),('PM','St. Pierre and Miquelon',999),('PN','Pitcairn',999),('PR','Puerto Rico',999),('PS','Palestine, State of',999),('PT','Portugal',999),('PW','Palau',999),('PY','Paraguay',999),('QA','Qatar',999),('RE','Reunion',999),('RO','Romania',999),('RS','Serbia',999),('RU','Russia',2),('RW','Rwanda',999),('SA','Saudi Arabia',999),('SB','Solomon Islands',999),('SC','Seychelles',999),('SD','Sudan',999),('SE','Sweden',999),('SG','Singapore',999),('SH','St. Helena',999),('SI','Slovenia',999),('SJ','Svalbard and Jan Mayen',999),('SK','Slovakia',999),('SL','Sierra Leone',999),('SM','San Marino',999),('SN','Senegal',999),('SO','Somalia',999),('SR','Suriname',999),('SS','South Sudan',999),('ST','Sao Tome and Principe',999),('SV','El Salvador',999),('SX','Sint Maarten',999),('SY','Syrian Arab Republic',999),('SZ','Eswatini',999),('TC','Turks and Caicos Islands',999),('TD','Chad',999),('TG','Togo',999),('TH','Thailand',999),('TJ','Tajikistan',999),('TK','Tokelau',999),('TL','Timor-Leste',999),('TM','Turkmenistan',999),('TN','Tunisia',999),('TO','Tonga',999),('TR','Turkey',999),('TT','Trinidad and Tobago',999),('TV','Tuvalu',999),('TW','Taiwan',999),('TZ','Tanzania, United Republic of',999),('UA','Ukraine',999),('UG','Uganda',999),('US','United States',1),('UY','Uruguay',999),('UZ','Uzbekistan',999),('VA','Holy See',999),('VC','St. Vincent and the Grenadines',999),('VE','Venezuela',999),('VG','Virgin Islands (British)',999),('VI','Virgin Islands (US)',999),('VN','Viet Nam',999),('VU','Vanuatu',999),('WF','Wallis and Futuna',999),('WS','Samoa',999),('YE','Yemen',999),('YT','Mayotte',999),('ZA','South Africa',999),('ZM','Zambia',999),('ZW','Zimbabwe',999);
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` (`code`, `name`, `symbol`, `order`) VALUES ('EUR','EURO','€',20),('RUB','Ruble','₽',30),('USD','US','$',10);
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `raw_materials`
--

LOCK TABLES `raw_materials` WRITE;
/*!40000 ALTER TABLE `raw_materials` DISABLE KEYS */;
INSERT INTO `raw_materials` (`id`, `name`, `purchased_at`, `weight`, `units`, `units_per_kg`, `vendor_name`, `origin_country`, `price`, `currency`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (1,'Sable','2024-06-08',30,NULL,200,'JJ','US',30,'USD','This is a test material','2024-08-30 13:42:56','2024-08-31 13:04:00',1,1),(2,'DM','2024-06-09',NULL,25,NULL,'MM','US',40,'EUR','This is a test material','2024-08-30 13:42:56','2024-08-31 17:14:00',1,1),(3,'SM','2024-06-08',NULL,1000,112,'KK','RU',3,'USD','This is a test material','2024-08-30 13:42:56','2024-08-31 18:48:00',1,1),(4,'BM','2024-06-08',NULL,750,135,NULL,'US',60,'EUR','This is a test material','2024-08-30 13:42:56','2024-08-31 18:51:00',1,1),(5,'Canady','2024-06-08',50,NULL,7,'XY','US',10,'USD','This is a test material','2024-08-30 13:42:56','2024-08-31 13:06:00',1,1);
/*!40000 ALTER TABLE `raw_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `wing_positions`
--

LOCK TABLES `wing_positions` WRITE;
/*!40000 ALTER TABLE `wing_positions` DISABLE KEYS */;
INSERT INTO `wing_positions` (`id`, `name`) VALUES (1,'Left'),(2,'Top'),(3,'Right'),(4,'Crown');
/*!40000 ALTER TABLE `wing_positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `wings`
--

LOCK TABLES `wings` WRITE;
/*!40000 ALTER TABLE `wings` DISABLE KEYS */;
INSERT INTO `wings` (`id`, `name`) VALUES (1,'Wing RT90'),(2,'Wing 2'),(3,'Wing 3');
/*!40000 ALTER TABLE `wings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `wings_babies`
--

LOCK TABLES `wings_babies` WRITE;
/*!40000 ALTER TABLE `wings_babies` DISABLE KEYS */;
INSERT INTO `wings_babies` (`id`, `raw_material_name`, `parent_wing_id`, `position_id`, `length`) VALUES (13,'Stone',1,4,8.5),(15,'L1',1,1,5.5),(16,'L2',1,1,6),(17,'L3',1,1,7),(18,'L4',1,1,7.5),(19,'L5',1,1,8.5),(34,'R1',1,3,5.5),(35,'R2',1,3,6.5),(36,'R3',1,3,7),(37,'R4',1,3,7.5),(38,'R5',1,3,8.5),(53,'R90',1,2,9),(66,'DM3X10',1,4,10),(67,'DM10',1,4,10);
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

-- Dump completed on 2024-09-01 23:00:08
