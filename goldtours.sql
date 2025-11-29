

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";



CREATE TABLE `Bookings` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `tourId` int NOT NULL,
  `numberOfPersons` int NOT NULL DEFAULT '1',
  `totalPrice` decimal(10,2) NOT NULL,
  `bookingDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Pending','Confirmed','Cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE `Likes` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `tourId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE `Tours` (
  `id` int NOT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `destination` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int NOT NULL COMMENT 'Duration in days',
  `availableSpots` int NOT NULL DEFAULT '0',
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `imageUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO `Tours` (`id`, `title`, `description`, `destination`, `price`, `duration`, `availableSpots`, `startDate`, `endDate`, `imageUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Paris City Tour', 'Explore the beautiful streets of Paris', 'Paris, France', 1200.00, 5, 20, '2024-06-01', '2024-06-05', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop', 1, '2025-11-22 14:09:05', '2025-11-22 14:09:05'),
(2, 'Tokyo Adventure', 'Discover the wonders of Tokyo', 'Tokyo, Japan', 2500.00, 7, 15, '2024-07-15', '2024-07-21', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop', 1, '2025-11-22 14:09:05', '2025-11-22 14:09:05'),
(3, 'New York Experience', 'The city that never sleeps', 'New York, USA', 1800.00, 4, 25, '2024-08-10', '2024-08-13', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop', 1, '2025-11-22 14:09:05', '2025-11-22 14:09:05'),
(4, 'London Discovery', 'Historical tour of London', 'London, UK', 1500.00, 6, 18, '2024-09-01', '2024-09-06', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop', 1, '2025-11-22 14:09:05', '2025-11-22 14:09:05'),
(5, 'Rome Ancient Times', 'Step back in time in Rome', 'Rome, Italy', 1300.00, 5, 22, '2024-10-05', '2024-10-09', 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=400&fit=crop', 1, '2025-11-22 14:09:05', '2025-11-22 14:09:05');



CREATE TABLE `Users` (
  `id` int NOT NULL,
  `firstName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('User','Admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'User',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO `Users` (`id`, `firstName`, `lastName`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 'User', 'admin', 'admin@goldtours.com', '$2b$10$18jOmLi3nWOqYxEMjs7EKudj73UbzFzG/uu/AXE.PJq3D9La4uJ4u', 'Admin', '2025-11-22 14:09:05', '2025-11-22 14:09:05'),
(2, 'John', 'Doe', 'johndoe', 'john@goldtours.com', '$2b$10$xhvjOoy84fyQrPxyA/l1g.EJ5X3M2apd4z3lCYkxcQIAJgdjjVuIy', 'User', '2025-11-22 14:09:05', '2025-11-22 14:09:05'),
(3, 'Jane', 'Smith', 'janesmith', 'jane@goldtours.com', '$2b$10$xhvjOoy84fyQrPxyA/l1g.EJ5X3M2apd4z3lCYkxcQIAJgdjjVuIy', 'User', '2025-11-22 14:09:05', '2025-11-22 14:09:05'),
(4, 'Mike', 'Johnson', 'mikejohnson', 'mike@goldtours.com', '$2b$10$xhvjOoy84fyQrPxyA/l1g.EJ5X3M2apd4z3lCYkxcQIAJgdjjVuIy', 'User', '2025-11-22 14:09:05', '2025-11-22 14:09:05');


ALTER TABLE `Bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_tourId` (`tourId`),
  ADD KEY `idx_status` (`status`);


ALTER TABLE `Likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`userId`,`tourId`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_tourId` (`tourId`);

-
ALTER TABLE `Tours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_destination` (`destination`),
  ADD KEY `idx_price` (`price`),
  ADD KEY `idx_startDate` (`startDate`),
  ADD KEY `idx_isActive` (`isActive`);


ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);


ALTER TABLE `Bookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;


ALTER TABLE `Likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;


ALTER TABLE `Tours`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;


ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;


ALTER TABLE `Bookings`
  ADD CONSTRAINT `Bookings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Bookings_ibfk_2` FOREIGN KEY (`tourId`) REFERENCES `Tours` (`id`) ON DELETE CASCADE;


ALTER TABLE `Likes`
  ADD CONSTRAINT `Likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Likes_ibfk_2` FOREIGN KEY (`tourId`) REFERENCES `Tours` (`id`) ON DELETE CASCADE;
COMMIT;