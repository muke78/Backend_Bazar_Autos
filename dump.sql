-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bazar_autos
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `car_costs`
--

DROP TABLE IF EXISTS `car_costs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_costs` (
  `cost_id` char(36) NOT NULL,
  `car_id` char(36) NOT NULL,
  `cost_type` enum('llantas','hojalateria','tapiceria','cielo','volante','funda','mecanico','tapones','multa','kit','sombrerera','rin_llaveta','aceite','tapon_facion','alineacion','manija','faros_calaveras') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cost_id`),
  KEY `idx_car_cost_type` (`car_id`,`cost_type`),
  CONSTRAINT `fk_cost_car` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_costs`
--

LOCK TABLES `car_costs` WRITE;
/*!40000 ALTER TABLE `car_costs` DISABLE KEYS */;
INSERT INTO `car_costs` VALUES ('1e73f113-dc84-42f0-a634-920396ef4020','0f4c7197-2d98-4552-9d9e-869cfc4c41a8','hojalateria',3200.00,NULL,'2026-03-17 01:21:09'),('2da24625-4c51-445e-9712-2451ad0c98d0','39fc0dcd-c0c8-4961-81d6-680dabfefcfc','tapones',650.00,NULL,'2026-03-17 01:26:23'),('4e958e47-1419-4761-a57b-bfd8bd232745','5a0462a3-fa9d-4776-81be-4d0d917b535c','tapiceria',800.00,NULL,'2026-03-17 01:30:49'),('52b52f5a-35ad-40b2-b142-48a10d8673e9','39fc0dcd-c0c8-4961-81d6-680dabfefcfc','hojalateria',9500.00,NULL,'2026-03-17 01:26:23'),('548e8dd4-37ad-4005-8761-d04ffbaf6c9e','f6890530-5818-45ac-b33d-0e2f7c05f42b','llantas',4200.00,'2 llantas delanteras nuevas','2026-03-08 03:33:58'),('58b92676-d9ea-4a94-9933-6bfb3792ed42','0f4c7197-2d98-4552-9d9e-869cfc4c41a8','funda',4800.00,NULL,'2026-03-17 01:21:09'),('6b24f8cd-3f0d-404f-bbf9-d2f236551f62','4a344a1e-5212-496b-b74f-f28d5eb46dd2','volante',750.00,NULL,'2026-03-08 03:56:48'),('6e7cb5f7-6a9d-4b3a-9796-8733acbd166d','413b26cc-0c7b-4fe8-a1ac-bb69516fba0a','aceite',850.00,'Cambio sintético','2026-03-08 03:35:26'),('6f178330-0e60-45c3-99b1-fd124ecb761b','413b26cc-0c7b-4fe8-a1ac-bb69516fba0a','llantas',4200.00,'2 llantas delanteras nuevas','2026-03-08 03:35:26'),('6f2c2172-a2ba-42fd-8d45-b0cee3d35a84','39fc0dcd-c0c8-4961-81d6-680dabfefcfc','volante',800.00,NULL,'2026-03-17 01:26:23'),('8530523c-e99d-48cc-ba1d-197dcf51f734','5f3941ec-0eef-4cb9-bed2-c824f811a53a','tapiceria',350.00,NULL,'2026-03-17 01:29:07'),('87c5d11c-0cb6-44d2-82a5-cea9682230d9','f6890530-5818-45ac-b33d-0e2f7c05f42b','aceite',850.00,'Cambio sintético','2026-03-08 03:33:58'),('8eae66f6-84ea-48c3-960d-54eb9f81213e','0f4c7197-2d98-4552-9d9e-869cfc4c41a8','tapones',1330.00,NULL,'2026-03-17 01:21:09'),('ad863af3-bcfa-456f-b4ff-b785812788d1','0f4c7197-2d98-4552-9d9e-869cfc4c41a8','mecanico',470.00,NULL,'2026-03-17 01:21:09'),('b1717bf2-fd67-4d46-932a-5c39a8dea463','4a344a1e-5212-496b-b74f-f28d5eb46dd2','tapiceria',500.00,NULL,'2026-03-08 03:56:48'),('bbfec5eb-a89d-46fb-8ad3-289a1d0828e6','4a344a1e-5212-496b-b74f-f28d5eb46dd2','hojalateria',2400.00,NULL,'2026-03-08 03:56:48'),('c8f836d2-0779-41f3-b598-a1a5ea2a97eb','0f4c7197-2d98-4552-9d9e-869cfc4c41a8','tapiceria',5000.00,NULL,'2026-03-17 01:21:09'),('d036cb4e-97e4-470c-86e5-c255430c2021','0f4c7197-2d98-4552-9d9e-869cfc4c41a8','volante',450.00,NULL,'2026-03-17 01:21:09'),('d2ef414d-e7a9-470a-b3d8-ac7d728fe69b','5a0462a3-fa9d-4776-81be-4d0d917b535c','cielo',200.00,NULL,'2026-03-17 01:30:49'),('d499233d-dc4b-43fd-bbbd-45226e0dc5ef','0f4c7197-2d98-4552-9d9e-869cfc4c41a8','llantas',4050.00,NULL,'2026-03-17 01:21:09'),('e4f6def4-694a-44bd-95d4-9181764d115f','8890835a-e1fc-468d-99d0-466348c495a3','hojalateria',2500.00,NULL,'2026-03-17 01:24:02'),('e5cfece6-5685-4ab2-b01a-da4939e338e3','39fc0dcd-c0c8-4961-81d6-680dabfefcfc','cielo',300.00,NULL,'2026-03-17 01:26:23'),('f21570a5-cdfc-4e6c-9acf-8adcf308fb5b','5f3941ec-0eef-4cb9-bed2-c824f811a53a','hojalateria',3200.00,NULL,'2026-03-17 01:29:07'),('f4a9aa4f-0cc8-40de-8613-67ef24e23fc8','5f3941ec-0eef-4cb9-bed2-c824f811a53a','cielo',970.00,NULL,'2026-03-17 01:29:07');
/*!40000 ALTER TABLE `car_costs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `car_id` char(36) NOT NULL,
  `brand` varchar(20) NOT NULL,
  `model` varchar(50) NOT NULL,
  `year_of_car` int NOT NULL,
  `color` varchar(15) NOT NULL,
  `purchase_date` date NOT NULL,
  `sale_date` date DEFAULT NULL,
  `status` enum('Vendido','Inventario','En espera','Reparacion') NOT NULL,
  `purchase_price` decimal(10,2) NOT NULL,
  `price_for_sale` decimal(10,2) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`car_id`),
  KEY `idx_brand_model` (`brand`,`model`),
  KEY `idx_dates` (`purchase_date`,`sale_date`),
  KEY `idx_year_of_car` (`year_of_car`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES ('0f4c7197-2d98-4552-9d9e-869cfc4c41a8','Kia','Kia Forte',2018,'Rojo','2025-12-29','2026-03-08','En espera',148000.00,214000.00,'2026-03-17 01:21:09','2026-03-17 01:21:09'),('39fc0dcd-c0c8-4961-81d6-680dabfefcfc','Chevrolet','Chevrolet Aveo',2017,'Morado','2025-12-29','2026-03-08','En espera',87000.00,136000.00,'2026-03-17 01:26:23','2026-03-17 01:26:23'),('413b26cc-0c7b-4fe8-a1ac-bb69516fba0a','Toyota','Corolla',2022,'Blanco','2024-03-08',NULL,'Inventario',150000.00,NULL,'2026-03-08 03:35:26','2026-03-08 03:35:26'),('4a344a1e-5212-496b-b74f-f28d5eb46dd2','Volkswagen','Jetta',2017,'Azul','2025-12-29','2026-03-08','Vendido',190000.00,240000.00,'2026-03-08 03:56:48','2026-03-08 03:56:48'),('5a0462a3-fa9d-4776-81be-4d0d917b535c','Jeep','Jeep Renegade',2017,'Negro','2025-12-29','2026-03-08','En espera',190000.00,240000.00,'2026-03-17 01:30:49','2026-03-17 01:30:49'),('5f3941ec-0eef-4cb9-bed2-c824f811a53a','Hyundai','Hyundai Elantra',2017,'Gris','2025-12-29','2026-03-08','En espera',135000.00,175000.00,'2026-03-17 01:29:07','2026-03-17 01:29:07'),('8890835a-e1fc-468d-99d0-466348c495a3','Nissan','Nissan March',2017,'Gris','2025-12-29','2026-03-08','En espera',120000.00,160000.00,'2026-03-17 01:24:02','2026-03-17 01:24:02'),('f6890530-5818-45ac-b33d-0e2f7c05f42b','Toyota','Corolla',2022,'Blanco','2024-03-08',NULL,'Inventario',150000.00,NULL,'2026-03-08 03:33:58','2026-03-08 03:33:58');
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investor`
--

DROP TABLE IF EXISTS `investor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investor` (
  `investor_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `investment_amount` decimal(10,2) NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`investor_id`),
  KEY `idx_investor_user` (`user_id`),
  CONSTRAINT `fk_investor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investor`
--

LOCK TABLES `investor` WRITE;
/*!40000 ALTER TABLE `investor` DISABLE KEYS */;
INSERT INTO `investor` VALUES ('5ffe4fda-8c9e-4c98-805a-fe13a17c6b8b','6aa4afe6-3ea2-461b-8bdd-84c8167ed1e2',504000.00,'2026-03-17 00:06:14','2026-03-17 00:06:14'),('6742ed31-a8c7-4346-a321-ae7d68dbd395','f272776e-7033-44c4-82de-f7c668f17cf0',54000.20,'2026-03-17 00:05:16','2026-03-17 00:05:16');
/*!40000 ALTER TABLE `investor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movements`
--

DROP TABLE IF EXISTS `movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movements` (
  `movements_id` char(36) NOT NULL,
  `movements_category_id` char(36) NOT NULL,
  `car_id` char(36) NOT NULL,
  `type` enum('Compra','Gasto') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(120) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`movements_id`),
  KEY `idx_movements_car` (`car_id`),
  KEY `idx_movements_category` (`movements_category_id`),
  CONSTRAINT `fk_movements_car` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_movements_category` FOREIGN KEY (`movements_category_id`) REFERENCES `movements_category` (`category_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movements`
--

LOCK TABLES `movements` WRITE;
/*!40000 ALTER TABLE `movements` DISABLE KEYS */;
INSERT INTO `movements` VALUES ('068fe2e1-9dc1-47da-8978-0357c24022b9','1edf123a-fbc5-42e4-af29-86a1b67509d4','4a344a1e-5212-496b-b74f-f28d5eb46dd2','Gasto',1500.00,'Cambio de aceite sintético','2026-03-17 01:13:30','2026-03-17 01:13:30'),('5aff92b8-4154-496e-8f3b-84ca352bebff','e0336f64-fa02-4503-9c59-664473028b82','5a0462a3-fa9d-4776-81be-4d0d917b535c','Gasto',10000.00,'[Compartido] Renta mensual de pensión/cajón central','2026-03-17 01:32:05','2026-03-17 01:32:05'),('7e5776a3-5e39-49b5-8ff0-c65b4461eb85','e0336f64-fa02-4503-9c59-664473028b82','0f4c7197-2d98-4552-9d9e-869cfc4c41a8','Gasto',10000.00,'[Compartido] Renta mensual de pensión/cajón central','2026-03-17 01:32:05','2026-03-17 01:32:05');
/*!40000 ALTER TABLE `movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movements_category`
--

DROP TABLE IF EXISTS `movements_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movements_category` (
  `category_id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` enum('Activo','Pasivo') NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movements_category`
--

LOCK TABLES `movements_category` WRITE;
/*!40000 ALTER TABLE `movements_category` DISABLE KEYS */;
INSERT INTO `movements_category` VALUES ('19d7e1d7-c302-4ccc-83c9-4e3f601f068e','Traslados','Pasivo'),('1edf123a-fbc5-42e4-af29-86a1b67509d4','Mantenimiento Menor','Pasivo'),('25717013-00e4-44c6-ae1d-4cd9fc6e4bdc','Tenencia','Activo'),('33d335f2-9181-4955-a1b2-a1641e61c439','Comida','Pasivo'),('38be1842-910b-483a-b5a2-dec0184d30e9','Refacciones','Activo'),('78fff1f4-a921-4efa-811e-9df550442e0a','Seguro del Auto','Activo'),('9403fd42-b2ba-41f8-8c9b-74045e014d33','Gastos Personales','Pasivo'),('a990c139-7dca-4165-8510-79f33d49e34c','Pago de Piso','Activo'),('d15c71ae-3379-429f-a75d-344487654c34','Gasolina','Pasivo'),('dad9fd2e-0b73-4800-899f-aa6c793096d0','Lavado','Pasivo'),('e0336f64-fa02-4503-9c59-664473028b82','Cajón','Pasivo'),('fbf6f17c-0437-4f1c-9a02-42634f1f6d41','Verificación','Activo');
/*!40000 ALTER TABLE `movements_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` char(36) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('4a274aee-a02e-4814-98e9-6a5a55848918','ise67','$argon2i$v=19$m=16,t=2,p=1$UzVGbTdVWU1jRFZ1cjRxZQ$CZxbmRtudDUbrgX9SorCNQ','Isela Quijada Quandon','ise67@gmail.com',NULL,'2026-03-05 23:54:34','2026-03-06 00:00:36'),('6aa4afe6-3ea2-461b-8bdd-84c8167ed1e2','zuuri12','$argon2i$v=19$m=16,t=2,p=1$UzVGbTdVWU1jRFZ1cjRxZQ$GcWuiIY/sStKPG3GpzpyjQ','Zuri Quandon Quijada','zuri12@gmail.com','2026-03-16 21:40:20','2026-03-05 23:54:34','2026-03-16 21:40:20'),('ec54cc39-9174-451e-b1d0-224cd3a54e29','mon97','$argon2i$v=19$m=16,t=2,p=1$UzVGbTdVWU1jRFZ1cjRxZQ$1EOVdobZ3yrAHwhO3IwVYg','Montserrat Quandon Quijada','mon97@gmail.com',NULL,'2026-03-05 23:54:34','2026-03-06 00:03:24'),('f272776e-7033-44c4-82de-f7c668f17cf0','ricardo90','$argon2i$v=19$m=16,t=2,p=1$UzVGbTdVWU1jRFZ1cjRxZQ$+dqCtvbeT9ydgUINkdh/5g','Ricardo Quandon Quijada','ricardo90@gmail.com','2026-03-16 21:43:09','2026-03-05 23:54:34','2026-03-16 21:43:09');
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

-- Dump completed on 2026-03-17  1:40:24
