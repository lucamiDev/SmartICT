-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gostitelj: 127.0.0.1
-- Čas nastanka: 06. maj 2024 ob 20.54
-- Različica strežnika: 10.4.27-MariaDB
-- Različica PHP: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Zbirka podatkov: `users_matanks`
--

-- --------------------------------------------------------

--
-- Struktura tabele `user2`
--

CREATE TABLE `user2` (
  `id` int(11) NOT NULL,
  `unique_id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `surname` varchar(45) DEFAULT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Odloži podatke za tabelo `user2`
--

INSERT INTO `user2` (`id`, `unique_id`, `name`, `surname`, `status`) VALUES
(1, 0, 'sa', 'sa', 'removed'),
(2, 98991, 'Samio', 'Jean', 'removed'),
(3, 112344, 'ana', 'trala', 'removed'),
(4, 333444, 'Ana', 'Hlebec', 'removed'),
(5, 898989, 'Poskus', 'Shell', 'removed'),
(6, 144444, 'Test ', 'Zadostnosti', 'removed'),
(7, 123123, 'camera', 'poskus', 'removed'),
(8, 999888, 'tralal', 'camera', 'removed'),
(9, 111111, 'Test with seprate avro', 'Test', 'active'),
(10, 121322, 'sda', 'sad', 'active'),
(11, 1345677, 'novi', 'test', 'active'),
(12, 123456, NULL, NULL, 'active'),
(13, 333444, NULL, NULL, 'active'),
(14, 987987, NULL, NULL, 'active'),
(15, 123123, NULL, NULL, 'active');

--
-- Indeksi zavrženih tabel
--

--
-- Indeksi tabele `user2`
--
ALTER TABLE `user2`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT zavrženih tabel
--

--
-- AUTO_INCREMENT tabele `user2`
--
ALTER TABLE `user2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
