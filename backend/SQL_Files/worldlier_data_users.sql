-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: crud_user
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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `username` varchar(30) NOT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='no routes should be able to change this table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES ('DarrionRamos','$2a$08$yWy6L1P6GxycYjtrH5NGWuFTaUrvlVbT4HPJMpU1iY3c1JsDsNXFq');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `connections`
--

DROP TABLE IF EXISTS `connections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `connections` (
  `ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sender` varchar(30) NOT NULL,
  `reciever` varchar(30) NOT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `idconnections_UNIQUE` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `connections`
--

LOCK TABLES `connections` WRITE;
/*!40000 ALTER TABLE `connections` DISABLE KEYS */;
INSERT INTO `connections` VALUES (10,'G','YEEE','Pending'),(11,'God','Disciple','Pending'),(12,'YareDaze','brother','Accepted'),(13,'YareDaze','yesMan','Accepted'),(14,'YareDaze','test','Pending');
/*!40000 ALTER TABLE `connections` ENABLE KEYS */;
UNLOCK TABLES;

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
  `host_name` varchar(100) DEFAULT NULL,
  `host_username` varchar(30) NOT NULL,
  `host_email` varchar(100) DEFAULT NULL,
  `host_address` varchar(100) NOT NULL,
  `guest_username_1` varchar(30) DEFAULT NULL,
  `guest_username_2` varchar(30) DEFAULT NULL,
  `guest_username_3` varchar(30) DEFAULT NULL,
  `guest_username_4` varchar(30) DEFAULT NULL,
  `capacity` int NOT NULL,
  `status` varchar(30) NOT NULL,
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
  `username` longtext,
  `password` longtext,
  `status` longtext,
  `session_token` longtext,
  `expiry` longtext,
  `name` longtext,
  `address_2` longtext,
  `email` longtext,
  `phone` longtext,
  `country` longtext,
  `gender` longtext,
  `birthday` longtext,
  `address_1` longtext,
  `address_3` longtext,
  `emergency_contact_name` longtext,
  `emergency_contact_phone_number` longtext,
  `emergency_contact_address` longtext,
  `biography` longtext,
  `profile_image` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (35,'John3','$2a$08$wIYms7cgPbKSVX.Peugp1evvQ5AJ3Pd7nOlmz5SCkoVZjPQQDq6v.','Accepted','752207f0-f3bf-4be1-a73a-2abe284d7f1c','2023-04-12 18:41:20.6745','BOBBY','','','','','','','','','','','','',''),(36,'DarrionRamos','$2a$08$yWy6L1P6GxycYjtrH5NGWuFTaUrvlVbT4HPJMpU1iY3c1JsDsNXFq','Accepted','6bcebf37-2841-4c6e-9b9e-64757786974e','2023-04-12 19:40:55.4299','Darrion Ramos','','','','','','','','','','','','',''),(37,'MR. Invincible','$2a$08$4DB/Bid6pKMjyEYWlRLekeeG4.KhKWup4Y31rMU0n.USjaTGaiNde','Accepted','af7a8f9a-ca2b-49e0-b8ff-a152e1c6c3b1','2023-04-12 18:17:03.5803','Bob John','','','','','','','','','','','','','');
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

-- Dump completed on 2023-04-18 18:01:25
