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

-
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
