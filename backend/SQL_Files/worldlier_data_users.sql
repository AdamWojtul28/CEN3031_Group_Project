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
INSERT INTO `admins` VALUES ('Darrion','$2a$08$GMgnxNBAGeeosoObJBsEQ.wnb8elSTtMqHbEl9olEkvfgsNs1l2NG'),('Alex','$2a$08$Stj97QwvZNSMv6lTkd/7BuhPU6V0HfMf0dsL6CZ4xLufUA8yFEAfS'),('Nico','$2a$08$kis5u6HVAh3k.j.61NTyw.fXrh07U4DxX/Ll1enJqVcCM0aYhjhde'),('Adam','$2a$08$CbXVmq03A090dVgmHS4mv.8G3xvZ82n5yA5swyl/1BfnSs2WblgLe');
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `connections`
--

LOCK TABLES `connections` WRITE;
/*!40000 ALTER TABLE `connections` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (38,'Darrion','$2a$08$GMgnxNBAGeeosoObJBsEQ.wnb8elSTtMqHbEl9olEkvfgsNs1l2NG','Accepted','01e712b4-d932-4cbf-81a7-238fbf6c1ce1','2023-04-18 19:53:42.0501','Darrion Ramos','','','','','','','','','','','','',''),(39,'Alex','$2a$08$Stj97QwvZNSMv6lTkd/7BuhPU6V0HfMf0dsL6CZ4xLufUA8yFEAfS','Accepted','a06aa05d-5228-4410-8e34-27b14a31d52b','2023-04-18 19:54:08.0308','Alex','','','','','','','','','','','','',''),(40,'Nico','$2a$08$kis5u6HVAh3k.j.61NTyw.fXrh07U4DxX/Ll1enJqVcCM0aYhjhde','Accepted','d587109e-bff7-4ad8-90f5-dd62a323c93d','2023-04-18 19:54:24.1313','Nico','','','','','','','','','','','','',''),(41,'Adam','$2a$08$CbXVmq03A090dVgmHS4mv.8G3xvZ82n5yA5swyl/1BfnSs2WblgLe','Accepted','e38b2c2c-0767-4b1c-9623-972122ad6439','2023-04-18 19:54:37.5664','Adam','','','','','','','','','','','','',''),(42,'testUser1','$2a$08$hfXVYzLPC41LIIP8jdzwYeuXUZR1XcNMnoAfVKOmq/FaB2zK3b5Xq','Pending','c46aca61-0bfb-4aff-8102-46d21dfbcade','2023-04-18 19:55:06.9140','testUser1','','','','','','','','','','','','',''),(43,'testUser2','$2a$08$ryV8pj/0pEdsgmXpCB81EeDErUQ62J.NzRAZxQlXMp.mxaY8JHy4y','Pending','61850d34-f355-48cd-b74c-318bd124bc49','2023-04-18 19:55:22.9041','testUser2','','','','','','','','','','','','',''),(44,'testUser3','$2a$08$ODDtMeNUCgujf.XwPBHR5Opy/fBZakKrUERFNBYUe4abK/9rZE22G','Pending','2af051a4-82a3-4916-af65-48636bac5a23','2023-04-18 19:55:28.5720','testUser3','','','','','','','','','','','','',''),(45,'testUser4','$2a$08$tSd4NIw4JfBUb31kUj/hAOz8SehP1kiUK1MTSvPZ/7lTGIw66DzjW','Pending','3d116f22-34c7-4379-98cd-8ca6076e1616','2023-04-18 19:55:33.1643','testUser4','','','','','','','','','','','','',''),(46,'testUser5','$2a$08$kWtbSaOb7W4DcyH5X5ovUe3gOlhL7WIi0igA06sSawqWO.D88XZti','Pending','c4aa5b48-97fd-4265-9d5a-d435784c783a','2023-04-18 19:55:38.1577','testUser5','','','','','','','','','','','','','');
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

-- Dump completed on 2023-04-18 20:30:55
