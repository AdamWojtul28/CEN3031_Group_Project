-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: worldlier
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `listings`
--

DROP TABLE IF EXISTS `listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `host_name` longtext,
  `host_username` longtext NOT NULL,
  `host_email` longtext,
  `host_address` longtext NOT NULL,
  `guest_username_1` longtext,
  `guest_username_2` longtext,
  `guest_username_3` longtext,
  `guest_username_4` longtext,
  `capacity` int NOT NULL,
  `status` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listings`
--

LOCK TABLES `listings` WRITE;
/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES (1,'2006-01-02','2006-01-04',NULL,'JohnDoe',NULL,'',NULL,NULL,NULL,NULL,0,'pending'),(2,'2006-01-02','2006-01-04',NULL,'JakeDoe',NULL,'',NULL,NULL,NULL,NULL,4,'pending');
/*!40000 ALTER TABLE `listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` longtext NOT NULL,
  `password` longtext NOT NULL,
  `name` longtext,
  `biography` longtext,
  `birthday` longtext,
  `email` longtext,
  `phone` longtext,
  `gender` longtext,
  `address_1` longtext,
  `address_2` longtext,
  `address_3` longtext,
  `country` longtext,
  `emergency_contact_name` longtext,
  `emergency_contact_phone_number` longtext,
  `emergency_contact_address` longtext,
  `expiry` longtext,
  `session_token` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Jim Smith','password123',NULL,'I love UF so muuch, Go Gators!','','','','','','','','','','','',NULL,NULL),(2,'Adam Wujuletski','GoG8torz!',NULL,'Big BrAIN',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'MATT','acktumally',NULL,'Da!',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'testuser1','pass123',NULL,'','','','','','London, UK','','','','','','','',''),(9,'MATT','password123',NULL,'I love UF so muuch, this place rules.','','','','','','','','','','','',NULL,NULL),(10,'MATT','password123',NULL,'I love UF so muuch, this place rules.','','','','','','','','','','','',NULL,NULL),(11,'MATT','password123',NULL,'I love UF so muuch, this place rules.','','','','','','','','','','','',NULL,NULL),(14,'MATTY4','password123',NULL,'I love UF so muuch, this place rules.','','','','','','','','','','','',NULL,NULL),(15,'John Doe','password123',NULL,'I love UF so muuch, this place rules.','','','','','','','','','','','',NULL,NULL),(16,'Jake Doe','password123',NULL,'I love UF so muuch, this place rules.','','','','','','','','','','','',NULL,NULL),(25,'Johnny Miller','password123',NULL,'I love UF so muuch, this place rules.','','','','','','','','','','','',NULL,NULL),(26,'JimmyBoah','$2a$08$CpXZl3Jmv491vc9HEHSiIObl5cn.g6PUoSEb53EYdnKohfowX8n1O',NULL,'','','','','','','','','','','','',NULL,NULL),(27,'FredSmith','$2a$08$e5SoADGsAH01jX8cEhlvcuxa96bITdY1h0RZT1UF6mEJ1wW8vB5nG',NULL,'','','','','','','','','','','','',NULL,NULL),(28,'Jack Daniels','SomePassword123',NULL,'','','','','','Warsaw, PL','','','','','','','2023-03-16 18:34:50.0413','096d9c84-d20f-42f4-938e-d889604e2bcc');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-29 16:40:07
