-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 23, 2024 at 07:52 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `studio_sasvat`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `_id` int NOT NULL,
  `userId` varchar(100) NOT NULL,
  `productId` bigint NOT NULL,
  `quantitySelected` bigint NOT NULL,
  `productName` varchar(100) NOT NULL,
  `productImageUrl` varchar(200) NOT NULL,
  `price` varchar(10) NOT NULL,
  `shippingCharge` varchar(5) NOT NULL DEFAULT '0',
  `discount` varchar(5) NOT NULL,
  `freeDelivery` varchar(5) NOT NULL,
  `openBoxDelivery` varchar(5) NOT NULL,
  `returnAndRefund` varchar(5) NOT NULL,
  `cashOnDelivery` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`_id`, `userId`, `productId`, `quantitySelected`, `productName`, `productImageUrl`, `price`, `shippingCharge`, `discount`, `freeDelivery`, `openBoxDelivery`, `returnAndRefund`, `cashOnDelivery`, `createdAt`) VALUES
(19, '2', 1, 1, 'Women Antique Earing', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726205873/studioSasvatImages/qbcbtlohokmgulwnbaoj.png', '199', '0', '10', '0', '0', '0', 0, '2024-09-23 04:50:38');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `_id` int NOT NULL,
  `categoryName` varchar(100) NOT NULL,
  `categoryImageUrl` varchar(500) NOT NULL,
  `categoryImagePublicId` varchar(500) NOT NULL,
  `isDeleted` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`_id`, `categoryName`, `categoryImageUrl`, `categoryImagePublicId`, `isDeleted`, `createdAt`) VALUES
(1, 'Women', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726141938/studioSasvatImages/jhnpvjvhtmnkrnmsclzm.jpg', 'studioSasvatImages/jhnpvjvhtmnkrnmsclzm', 0, '2024-09-12 11:52:19'),
(2, 'Furniture', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200924/studioSasvatImages/jwmxtwfhyzs6rrysvguz.png', 'studioSasvatImages/jwmxtwfhyzs6rrysvguz', 0, '2024-09-13 04:15:25'),
(3, 'Art & Craft', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200962/studioSasvatImages/nvcred7gfmoprchf7kus.png', 'studioSasvatImages/nvcred7gfmoprchf7kus', 0, '2024-09-13 04:16:03'),
(4, 'Toys', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726201047/studioSasvatImages/dowqwy282v0z9a91bgji.png', 'studioSasvatImages/dowqwy282v0z9a91bgji', 0, '2024-09-13 04:17:28'),
(5, 'Men', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726201068/studioSasvatImages/imzin71pfelnu5t0m44j.png', 'studioSasvatImages/imzin71pfelnu5t0m44j', 0, '2024-09-13 04:17:48'),
(6, 'Kitchen', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726201105/studioSasvatImages/gkegrnt3ngfnjxi9xbxt.png', 'studioSasvatImages/gkegrnt3ngfnjxi9xbxt', 0, '2024-09-13 04:18:25');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `_id` int NOT NULL,
  `couponName` varchar(500) NOT NULL,
  `couponDescription` varchar(3000) NOT NULL,
  `couponMinimumCartValue` varchar(100) NOT NULL,
  `couponPrice` varchar(15) NOT NULL,
  `couponPercentage` varchar(5) NOT NULL,
  `couponBasedOn` varchar(25) NOT NULL,
  `couponValidUpto` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `couponApplyLimit` int NOT NULL DEFAULT '0',
  `isDeleted` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `featured_images`
--

CREATE TABLE `featured_images` (
  `_id` int NOT NULL,
  `productId` bigint NOT NULL,
  `featuredImagesPublicId` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `featuredImagesUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `featured_images`
--

INSERT INTO `featured_images` (`_id`, `productId`, `featuredImagesPublicId`, `featuredImagesUrl`, `createdAt`) VALUES
(1, 1, 'studioSasvatImages/featured/kdgehzvpebhgr9bsk1bw', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726205877/studioSasvatImages/featured/kdgehzvpebhgr9bsk1bw.webp', '2024-09-13 05:37:57'),
(2, 1, 'studioSasvatImages/featured/pe1eele3xhec8jalrxew', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726205878/studioSasvatImages/featured/pe1eele3xhec8jalrxew.png', '2024-09-13 05:37:58'),
(3, 1, 'studioSasvatImages/featured/rry7uwgggbyw6qmlv7pb', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726205879/studioSasvatImages/featured/rry7uwgggbyw6qmlv7pb.png', '2024-09-13 05:38:00'),
(4, 2, 'studioSasvatImages/featured/ynkh4flkzkfwoadqkipc', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206043/studioSasvatImages/featured/ynkh4flkzkfwoadqkipc.png', '2024-09-13 05:40:43'),
(5, 2, 'studioSasvatImages/featured/fcsbvpizzlw24j0755q4', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206043/studioSasvatImages/featured/fcsbvpizzlw24j0755q4.png', '2024-09-13 05:40:44'),
(6, 2, 'studioSasvatImages/featured/mjwxhohrmmc9sg66spca', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206045/studioSasvatImages/featured/mjwxhohrmmc9sg66spca.png', '2024-09-13 05:40:46'),
(7, 3, 'studioSasvatImages/featured/nnayiqpgnobv7zp7a8pp', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206186/studioSasvatImages/featured/nnayiqpgnobv7zp7a8pp.webp', '2024-09-13 05:43:06'),
(8, 3, 'studioSasvatImages/featured/bzqcq3bymz3fsi7e0j2n', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206187/studioSasvatImages/featured/bzqcq3bymz3fsi7e0j2n.webp', '2024-09-13 05:43:07'),
(9, 3, 'studioSasvatImages/featured/mzyxb8dojfs5wux9aeld', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206188/studioSasvatImages/featured/mzyxb8dojfs5wux9aeld.jpg', '2024-09-13 05:43:08'),
(10, 3, 'studioSasvatImages/featured/kr6hgaznozvx4pyqzpl3', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206189/studioSasvatImages/featured/kr6hgaznozvx4pyqzpl3.jpg', '2024-09-13 05:43:10'),
(11, 4, 'studioSasvatImages/featured/jqv4943znvdeqepmaw3q', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206339/studioSasvatImages/featured/jqv4943znvdeqepmaw3q.png', '2024-09-13 05:45:39'),
(12, 4, 'studioSasvatImages/featured/jrwln1m3zf3zn2mpfe9e', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206341/studioSasvatImages/featured/jrwln1m3zf3zn2mpfe9e.png', '2024-09-13 05:45:41'),
(13, 4, 'studioSasvatImages/featured/t92sy7s0q4xq5e0qoc6n', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206342/studioSasvatImages/featured/t92sy7s0q4xq5e0qoc6n.png', '2024-09-13 05:45:43'),
(14, 5, 'studioSasvatImages/featured/qudossaqhmfhzojwzjs1', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206407/studioSasvatImages/featured/qudossaqhmfhzojwzjs1.jpg', '2024-09-13 05:46:47'),
(15, 5, 'studioSasvatImages/featured/mu1bsbandz5ulbwjaqp8', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206408/studioSasvatImages/featured/mu1bsbandz5ulbwjaqp8.jpg', '2024-09-13 05:46:48'),
(16, 6, 'studioSasvatImages/featured/ab0j4tnpvzeuj5qpzx70', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206479/studioSasvatImages/featured/ab0j4tnpvzeuj5qpzx70.webp', '2024-09-13 05:48:00'),
(17, 6, 'studioSasvatImages/featured/wxr2klegkl6rp9hpac1l', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206480/studioSasvatImages/featured/wxr2klegkl6rp9hpac1l.jpg', '2024-09-13 05:48:01'),
(18, 6, 'studioSasvatImages/featured/wtpryaupntfglxqigiug', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206481/studioSasvatImages/featured/wtpryaupntfglxqigiug.jpg', '2024-09-13 05:48:01'),
(19, 7, 'studioSasvatImages/featured/erdvcih9m8wkrahhvt85', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209599/studioSasvatImages/featured/erdvcih9m8wkrahhvt85.png', '2024-09-13 06:40:00'),
(20, 7, 'studioSasvatImages/featured/aps2liubnzly7zrwihg9', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209601/studioSasvatImages/featured/aps2liubnzly7zrwihg9.png', '2024-09-13 06:40:01'),
(21, 7, 'studioSasvatImages/featured/gblh47op5lvjrmnuncxr', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209602/studioSasvatImages/featured/gblh47op5lvjrmnuncxr.png', '2024-09-13 06:40:02'),
(22, 8, 'studioSasvatImages/featured/c8usaqqnpnqzwhevceer', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209671/studioSasvatImages/featured/c8usaqqnpnqzwhevceer.png', '2024-09-13 06:41:12'),
(23, 8, 'studioSasvatImages/featured/i2hetfloqcrdln6prqa0', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209673/studioSasvatImages/featured/i2hetfloqcrdln6prqa0.png', '2024-09-13 06:41:14'),
(24, 8, 'studioSasvatImages/featured/wvt9m1easqzc4f4qyeri', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209675/studioSasvatImages/featured/wvt9m1easqzc4f4qyeri.png', '2024-09-13 06:41:15'),
(25, 9, 'studioSasvatImages/featured/svxuxxwuzpocyuq1k4dc', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209743/studioSasvatImages/featured/svxuxxwuzpocyuq1k4dc.jpg', '2024-09-13 06:42:23'),
(26, 9, 'studioSasvatImages/featured/s4ou9zpvac5kr7sbdznj', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209744/studioSasvatImages/featured/s4ou9zpvac5kr7sbdznj.jpg', '2024-09-13 06:42:24'),
(27, 9, 'studioSasvatImages/featured/vzxl1bcblds4iekekq6y', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209744/studioSasvatImages/featured/vzxl1bcblds4iekekq6y.jpg', '2024-09-13 06:42:25'),
(28, 10, 'studioSasvatImages/featured/w6h7tbeciphqi57uwhc9', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209836/studioSasvatImages/featured/w6h7tbeciphqi57uwhc9.png', '2024-09-13 06:43:57'),
(29, 10, 'studioSasvatImages/featured/wb1mjmn9ioco53eqy3wk', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209838/studioSasvatImages/featured/wb1mjmn9ioco53eqy3wk.png', '2024-09-13 06:43:58'),
(30, 10, 'studioSasvatImages/featured/xiqo567yl7etkfskhryn', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209838/studioSasvatImages/featured/xiqo567yl7etkfskhryn.png', '2024-09-13 06:43:59'),
(31, 11, 'studioSasvatImages/featured/x5csnjoq5pvih5qebxd5', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209906/studioSasvatImages/featured/x5csnjoq5pvih5qebxd5.webp', '2024-09-13 06:45:06'),
(32, 11, 'studioSasvatImages/featured/b2s0m1a4oce3kr9y4tfe', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209907/studioSasvatImages/featured/b2s0m1a4oce3kr9y4tfe.webp', '2024-09-13 06:45:07'),
(33, 11, 'studioSasvatImages/featured/p66jdieh7pnteizd0trg', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209907/studioSasvatImages/featured/p66jdieh7pnteizd0trg.jpg', '2024-09-13 06:45:08'),
(34, 11, 'studioSasvatImages/featured/urqqxnrqgm3atw7rsf6e', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209908/studioSasvatImages/featured/urqqxnrqgm3atw7rsf6e.jpg', '2024-09-13 06:45:09'),
(35, 12, 'studioSasvatImages/featured/chrzvdgog5ax0rqo4eba', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726210002/studioSasvatImages/featured/chrzvdgog5ax0rqo4eba.png', '2024-09-13 06:46:43'),
(36, 12, 'studioSasvatImages/featured/vzthbsaguyydo2irr3eg', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726210003/studioSasvatImages/featured/vzthbsaguyydo2irr3eg.png', '2024-09-13 06:46:44'),
(37, 12, 'studioSasvatImages/featured/yk0xf53ww8km7jdyln8y', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726210005/studioSasvatImages/featured/yk0xf53ww8km7jdyln8y.png', '2024-09-13 06:46:45'),
(38, 13, 'studioSasvatImages/featured/l7lgm66nrfvxpuxp8rbx', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726210569/studioSasvatImages/featured/l7lgm66nrfvxpuxp8rbx.webp', '2024-09-13 06:56:09'),
(39, 13, 'studioSasvatImages/featured/e2j4httr2svplquq3ni0', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726210570/studioSasvatImages/featured/e2j4httr2svplquq3ni0.webp', '2024-09-13 06:56:10'),
(40, 13, 'studioSasvatImages/featured/zixwetrcrazsytrvsy90', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726210570/studioSasvatImages/featured/zixwetrcrazsytrvsy90.jpg', '2024-09-13 06:56:11'),
(41, 13, 'studioSasvatImages/featured/p98h1p5r0ho6lzctikb1', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726210571/studioSasvatImages/featured/p98h1p5r0ho6lzctikb1.jpg', '2024-09-13 06:56:12');

-- --------------------------------------------------------

--
-- Table structure for table `main_banners`
--

CREATE TABLE `main_banners` (
  `_id` int NOT NULL,
  `mainBannerImageUrl` varchar(500) NOT NULL,
  `mainBannerImagePublicId` varchar(500) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `main_banners`
--

INSERT INTO `main_banners` (`_id`, `mainBannerImageUrl`, `mainBannerImagePublicId`, `createdAt`) VALUES
(1, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200556/studioSasvatImages/mainBannerImage/gk6zvuais52kqgbts1hn.png', 'studioSasvatImages/mainBannerImage/gk6zvuais52kqgbts1hn', '2024-09-13 04:09:17'),
(2, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200558/studioSasvatImages/mainBannerImage/db9zykoervrabrlucbtm.png', 'studioSasvatImages/mainBannerImage/db9zykoervrabrlucbtm', '2024-09-13 04:09:18'),
(3, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200559/studioSasvatImages/mainBannerImage/vgfvcspfdyzmsthqzshf.png', 'studioSasvatImages/mainBannerImage/vgfvcspfdyzmsthqzshf', '2024-09-13 04:09:19');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `_id` int NOT NULL,
  `mandateOrderId` bigint NOT NULL,
  `orderId` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `paymentId` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `signature` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `userId` bigint NOT NULL,
  `billingAddressName` varchar(50) NOT NULL,
  `billingAddressEmail` varchar(50) NOT NULL,
  `billingAddressContactNumber` varchar(15) NOT NULL,
  `billingAddressAlternateNumber` varchar(15) DEFAULT NULL,
  `billingAddressPincode` varchar(15) NOT NULL,
  `billingAddressCity` varchar(25) NOT NULL,
  `billingAddressState` varchar(25) NOT NULL,
  `billingAddressCountry` varchar(25) NOT NULL,
  `billingAddressFullAddress` varchar(1000) NOT NULL,
  `productId` bigint NOT NULL,
  `productName` varchar(100) NOT NULL,
  `quantitySelected` varchar(5) NOT NULL,
  `returnedQuantity` varchar(100) DEFAULT NULL,
  `productImageUrl` varchar(500) NOT NULL,
  `price` varchar(10) NOT NULL,
  `shippingCharge` varchar(5) NOT NULL DEFAULT '0',
  `couponId` bigint DEFAULT NULL,
  `couponName` varchar(100) DEFAULT NULL,
  `couponMinimumCartValue` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `couponPrice` varchar(100) DEFAULT NULL,
  `couponPercentage` varchar(5) DEFAULT NULL,
  `couponBasedOn` varchar(15) DEFAULT NULL,
  `couponValidUpto` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `discount` varchar(5) NOT NULL,
  `freeDelivery` varchar(5) NOT NULL,
  `openBoxDelivery` varchar(5) NOT NULL,
  `returnAndRefund` varchar(5) NOT NULL,
  `cashOnDelivery` int NOT NULL DEFAULT '0',
  `paymentMode` varchar(25) NOT NULL,
  `grandTotal` varchar(20) NOT NULL,
  `status` varchar(25) NOT NULL DEFAULT 'Pending',
  `paymentStatus` varchar(30) NOT NULL,
  `shipmentDate` varchar(50) DEFAULT NULL,
  `outForDeliveryDate` varchar(50) DEFAULT NULL,
  `deliveredDate` varchar(50) DEFAULT NULL,
  `upiForRefund` varchar(100) DEFAULT NULL,
  `bankAccountHolderNameForRefund` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bankAccountNumberForRefund` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bankAccountIfscForRefund` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bankName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bankBranchName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bankFullAddress` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bankCity` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bankDistrict` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `refundAmount` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `refundRequestDate` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `returnCancelDate` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `proceedForRefundDate` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `refundCompletedDate` varchar(100) DEFAULT NULL,
  `cancelledDate` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`_id`, `mandateOrderId`, `orderId`, `paymentId`, `signature`, `userId`, `billingAddressName`, `billingAddressEmail`, `billingAddressContactNumber`, `billingAddressAlternateNumber`, `billingAddressPincode`, `billingAddressCity`, `billingAddressState`, `billingAddressCountry`, `billingAddressFullAddress`, `productId`, `productName`, `quantitySelected`, `returnedQuantity`, `productImageUrl`, `price`, `shippingCharge`, `couponId`, `couponName`, `couponMinimumCartValue`, `couponPrice`, `couponPercentage`, `couponBasedOn`, `couponValidUpto`, `discount`, `freeDelivery`, `openBoxDelivery`, `returnAndRefund`, `cashOnDelivery`, `paymentMode`, `grandTotal`, `status`, `paymentStatus`, `shipmentDate`, `outForDeliveryDate`, `deliveredDate`, `upiForRefund`, `bankAccountHolderNameForRefund`, `bankAccountNumberForRefund`, `bankAccountIfscForRefund`, `bankName`, `bankBranchName`, `bankFullAddress`, `bankCity`, `bankDistrict`, `refundAmount`, `refundRequestDate`, `returnCancelDate`, `proceedForRefundDate`, `refundCompletedDate`, `cancelledDate`, `createdAt`) VALUES
(1, 100000001, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '8770089556', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'jhdsbfkljdvfdukjv', 12, 'Test Product 8', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209998/studioSasvatImages/m1jhwlffuaccgmup6a9m.png', '559', '0', NULL, '', '', '', '', '', '', '25', '0', '0', '0', 0, 'Cash on Delivery', '559', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:36:53'),
(2, 100000002, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '9876543210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'fvhnghfbj', 12, 'Test Product 8', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209998/studioSasvatImages/m1jhwlffuaccgmup6a9m.png', '559', '0', NULL, '', '', '', '', '', '', '25', '0', '0', '0', 0, 'Cash on Delivery', '559', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:40:35'),
(3, 100000003, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '8974563210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'vgjfdjvf', 10, 'Test Product 6', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209832/studioSasvatImages/g1oxdshetijefurmp7yy.png', '149', '0', NULL, '', '', '', '', '', '', '5', '0', '0', '0', 0, 'Cash on Delivery', '149', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:41:34'),
(4, 100000004, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '9876543210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'ggbkgfyjbfg', 8, 'Test Product 4', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209668/studioSasvatImages/uo6l7lftsl4zpc75rxo2.png', '499', '0', NULL, '', '', '', '', '', '', '10', '0', '0', '0', 0, 'Cash on Delivery', '499', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:42:09'),
(5, 100000005, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '8974563210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'cvbncf fxcgn', 3, 'Women Antique Ring', '2', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206183/studioSasvatImages/vldmfhblnwms07t2si5o.png', '99', '0', NULL, '', '', '', '', '', '', '5', '0', '0', '0', 0, 'Cash on Delivery', '198', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:42:37'),
(6, 100000006, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '9876543210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'bc xvb xbv', 4, 'Women Antique Earing 2', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206335/studioSasvatImages/pvj17jcjrjyogit0kg1s.webp', '299', '0', NULL, '', '', '', '', '', '', '20', '0', '0', '0', 0, 'Cash on Delivery', '299', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:43:11'),
(7, 100000007, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '9876543210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'gvbhxdfcvhdsfh', 6, 'Test Product 2', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206476/studioSasvatImages/dnxjajiktdw6ndqgtfrt.jpg', '699', '0', NULL, '', '', '', '', '', '', '15', '0', '0', '0', 0, 'Cash on Delivery', '699', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:43:41'),
(8, 100000008, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '8974563210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'cvhb jmdfgcbjvfxg', 5, 'Test Product 1', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206403/studioSasvatImages/aylnqlugvdpucyoonhgp.webp', '599', '0', NULL, '', '', '', '', '', '', '20', '0', '0', '0', 0, 'Cash on Delivery', '599', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:44:23'),
(9, 100000009, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '9876543210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'sbfxdghvdfhvgjh', 3, 'Women Antique Ring', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206183/studioSasvatImages/vldmfhblnwms07t2si5o.png', '99', '0', NULL, '', '', '', '', '', '', '5', '0', '0', '0', 0, 'Cash on Delivery', '99', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:44:52'),
(10, 100000010, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '9876543210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'cvnb jfsgxsbvzxvhghn', 1, 'Women Antique Earing', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726205873/studioSasvatImages/qbcbtlohokmgulwnbaoj.png', '199', '0', NULL, '', '', '', '', '', '', '10', '0', '0', '0', 0, 'Cash on Delivery', '199', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:45:29'),
(11, 100000011, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '8974563210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'fbhdxgfhvfhsdh', 3, 'Women Antique Ring', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206183/studioSasvatImages/vldmfhblnwms07t2si5o.png', '99', '0', NULL, '', '', '', '', '', '', '5', '0', '0', '0', 0, 'Cash on Delivery', '99', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:53:08'),
(12, 100000012, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '9876543210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'vdghjfsdcfjdfhn', 2, 'Women Antique Necklace', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206037/studioSasvatImages/cja3han9g9dbgao5b5hi.jpg', '299', '0', NULL, '', '', '', '', '', '', '25', '0', '0', '0', 0, 'Cash on Delivery', '299', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:53:35'),
(13, 100000013, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '8974563210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'fcvzxfxbfdbzdfb', 3, 'Women Antique Ring', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206183/studioSasvatImages/vldmfhblnwms07t2si5o.png', '99', '0', NULL, '', '', '', '', '', '', '5', '0', '0', '0', 0, 'Cash on Delivery', '99', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:53:59'),
(14, 100000014, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '9876543210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'cghjvfvdjydtrj', 6, 'Test Product 2', '1', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206476/studioSasvatImages/dnxjajiktdw6ndqgtfrt.jpg', '699', '0', NULL, '', '', '', '', '', '', '15', '0', '0', '0', 0, 'Cash on Delivery', '699', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:55:46'),
(15, 100000015, '', '', NULL, 1, 'Studio Sasvat', 'ppatchint75@gmail.com', '9876543210', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'sadegscddhjkfgk', 3, 'Women Antique Ring', '2', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206183/studioSasvatImages/vldmfhblnwms07t2si5o.png', '99', '0', NULL, '', '', '', '', '', '', '5', '0', '0', '0', 0, 'Cash on Delivery', '198', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-13 11:56:09'),
(16, 100000016, '', '', NULL, 2, 'John Doe', 'johndoe@test.com', '8770089556', '9587463210', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'Test Address', 11, 'Test Product 7', '2', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209902/studioSasvatImages/vckb3cljtydotrbiemgb.jpg', '249', '0', NULL, '', '', '', '', '', '', '20', '0', '0', '0', 0, 'Cash on Delivery', '498', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-23 04:32:17'),
(17, 100000017, '', '', NULL, 2, 'John Doe', 'johndoe@test.com', '8770089556', '', '474001', 'Gwalior', 'Madhya Pradesh', 'India', 'Test Address', 1, 'Women Antique Earing', '2', NULL, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726205873/studioSasvatImages/qbcbtlohokmgulwnbaoj.png', '199', '0', NULL, '', '', '', '', '', '', '10', '0', '0', '0', 0, 'Cash on Delivery', '398', 'Pending', 'Yet to Pay', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-23 04:40:10');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `_id` int NOT NULL,
  `orderId` varchar(200) NOT NULL,
  `paymentId` varchar(200) NOT NULL,
  `signature` varchar(200) NOT NULL,
  `success` varchar(15) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `_id` int NOT NULL,
  `productName` varchar(50) NOT NULL,
  `categoryId` bigint NOT NULL,
  `categoryName` varchar(100) NOT NULL,
  `subCategoryId` bigint NOT NULL,
  `subCategoryName` varchar(50) NOT NULL,
  `shortDescription` varchar(1000) NOT NULL,
  `detailedDescription` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` varchar(10) NOT NULL,
  `shippingCharge` varchar(5) NOT NULL DEFAULT '0',
  `discount` varchar(15) NOT NULL,
  `availableQuantity` bigint NOT NULL,
  `quantitySold` bigint NOT NULL DEFAULT '0',
  `freeDelivery` int NOT NULL,
  `openBoxDelivery` int NOT NULL,
  `returnAndRefund` int NOT NULL,
  `deliveryPolicy` varchar(2000) NOT NULL,
  `returnPolicy` varchar(2000) NOT NULL,
  `cashOnDelivery` int NOT NULL DEFAULT '0',
  `productImageUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `productImagePublicId` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `productVideoUrl` varchar(500) DEFAULT NULL,
  `productVideoPublicId` varchar(500) DEFAULT NULL,
  `currentRating` varchar(10) NOT NULL DEFAULT '0',
  `isDeleted` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`_id`, `productName`, `categoryId`, `categoryName`, `subCategoryId`, `subCategoryName`, `shortDescription`, `detailedDescription`, `price`, `shippingCharge`, `discount`, `availableQuantity`, `quantitySold`, `freeDelivery`, `openBoxDelivery`, `returnAndRefund`, `deliveryPolicy`, `returnPolicy`, `cashOnDelivery`, `productImageUrl`, `productImagePublicId`, `productVideoUrl`, `productVideoPublicId`, `currentRating`, `isDeleted`, `createdAt`) VALUES
(1, 'Women Antique Earing', 1, 'Women', 2, 'Women Earing', '<p>Step into a world of elegance and charm with our Women’s Epoxy Earrings. Carefully handcrafted with premium epoxy resin, these lightweight, hypoallergenic earrings are perfect for any occasion. A seamless blend of modern design and timeless beauty, they’re designed to complement your unique style.</p>', '<p>Our Women’s Epoxy Earrings are a stunning blend of artistry and elegance, handcrafted with precision using high-quality epoxy resin. These earrings are lightweight, hypoallergenic, and comfortable, making them perfect for everyday wear or special occasions. The smooth, glossy finish of the resin adds a touch of sophistication, while the vibrant colors and unique patterns make each pair truly one-of-a-kind.</p><p>These earrings are designed for the modern woman who appreciates stylish accessories that can transition seamlessly from casual to formal settings. Whether you’re attending a wedding, a party, or simply going about your daily routine, these earrings will add a charming, elegant touch to your outfit.</p><p><strong>Key Features</strong>:</p><ul><li><strong>Handcrafted Design</strong>: Each pair is uniquely handmade, ensuring no two pairs are exactly alike.</li><li><strong>Lightweight &amp; Comfortable</strong>: Designed for all-day wear without causing discomfort.</li><li><strong>Hypoallergenic</strong>: Suitable for sensitive skin, crafted with materials that prevent irritation.</li><li><strong>Versatile</strong>: Perfect for both casual and formal outfits, adding a sophisticated touch to any look.</li><li><strong>Durable</strong>: Epoxy resin ensures longevity and resistance to fading, maintaining its beauty over time.</li></ul><p>Enhance your wardrobe with these unique, stylish earrings that offer both comfort and elegance, making them the perfect accessory for any occasion.</p>', '199', '0', '10', 22, 3, 0, 0, 0, '<p>We prioritize fast, reliable, and safe delivery for your purchases. Once your order is placed and confirmed, our team ensures a seamless processing experience to get your earrings delivered to you as quickly as possible.</p><p><strong>Shipping Options</strong>:</p><ul><li><strong>Standard Delivery</strong>: Orders are typically processed within 1-2 business days. Once processed, delivery will take approximately 5-7 business days, depending on your location. We ensure that all products are securely packaged to protect your earrings during transit.</li><li><strong>Express Delivery</strong>: If you need your earrings sooner, we offer an express delivery option, which ensures that your package reaches you within 2-3 business days after processing.</li></ul><p>We ship to most locations domestically and internationally. Our goal is to make sure your shopping experience is as convenient and hassle-free as possible. Upon dispatch, you will receive tracking details via email so you can monitor the progress of your delivery at all times.</p>', '<p>Due to the nature of earrings and the importance of hygiene, we currently do not accept returns on our Women’s Epoxy Earrings. This ensures that all of our customers receive brand new, hygienically safe products every time they order.</p><p>However, we understand that situations may arise where you need to cancel your order. You may cancel your purchase anytime before the earrings have been shipped out. Simply contact our customer support team with your order number, and we will assist you in canceling the order without any additional charges.</p><p>In the unlikely event that you receive a damaged or defective product, please reach out to us immediately. We take great care in ensuring the quality of every item shipped, but if an issue arises, we will work to resolve it by either replacing the product or issuing store credit as appropriate.</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726205873/studioSasvatImages/qbcbtlohokmgulwnbaoj.png', 'studioSasvatImages/qbcbtlohokmgulwnbaoj', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726205876/studioSasvatVideos/svpwin0lrlskomy5quyp.mp4', 'studioSasvatVideos/svpwin0lrlskomy5quyp', '0', 0, '2024-09-13 05:37:56'),
(2, 'Women Antique Necklace', 1, 'Women', 3, 'Women Necklace', '<p>Elegant handcrafted women’s necklace featuring high-quality materials, perfect for enhancing any outfit. Lightweight, durable, and designed for both casual and formal wear.</p>', '<p>Elevate your style with our <strong>Women’s Necklace</strong>, a timeless piece designed for women who appreciate both fashion and craftsmanship. This exquisite necklace is carefully handcrafted using premium materials, ensuring a lasting finish that withstands daily wear. The necklace combines a delicate yet striking design, perfect for pairing with both everyday outfits and more formal attire.</p><p><strong>Key Features</strong>:</p><ul><li><strong>Handcrafted Excellence</strong>: Each necklace is individually crafted to ensure attention to detail and uniqueness.</li><li><strong>Premium Materials</strong>: Made from durable, high-quality metals, gems, and stones that add elegance and longevity.</li><li><strong>Lightweight &amp; Comfortable</strong>: Designed to be worn throughout the day without any discomfort.</li><li><strong>Hypoallergenic</strong>: Safe for sensitive skin, reducing the risk of allergic reactions.</li><li><strong>Versatile Design</strong>: Whether you’re dressing up for a special occasion or adding a touch of elegance to your everyday look, this necklace will complement any style.</li><li><strong>Unique Patterns &amp; Finishes</strong>: Available in a variety of designs, ensuring that you can find a piece that resonates with your personal style.</li></ul><p>This <strong>Women’s Necklace</strong> is an ideal gift for yourself or a loved one, perfect for birthdays, anniversaries, holidays, or just because. Its versatile design makes it suitable for both casual wear and formal events, ensuring that you’re always accessorized with elegance and class. With its durable construction, you can trust that this necklace will be a long-lasting addition to your jewelry collection.</p>', '299', '0', '25', 19, 1, 0, 0, 0, '<p>We strive to deliver your <strong>Women’s Necklace</strong> as quickly and efficiently as possible. Upon placing your order, you will receive a confirmation email. Standard delivery takes approximately 5-7 business days within the country, and international shipping may take 10-15 business days depending on the destination. Tracking details will be provided once the product is shipped, so you can stay updated on your order status.</p><p><strong>Note</strong>: Delivery times may vary due to external factors such as holidays or global shipping disruptions. We partner with reliable courier services to ensure your package arrives in a timely manner and in perfect condition.</p>', '<p>We do not accept returns for this <strong>Women’s Necklace</strong> due to hygiene and safety concerns. However, you can cancel your order before the product is shipped. If the product arrives damaged or if you receive the wrong item, we offer a replacement free of charge. Please contact our customer service within 24 hours of receiving the item, and we will assist you with the replacement process.</p><p>We are committed to ensuring your satisfaction with every purchase and will work with you to resolve any issues with your order.</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206037/studioSasvatImages/cja3han9g9dbgao5b5hi.jpg', 'studioSasvatImages/cja3han9g9dbgao5b5hi', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726206041/studioSasvatVideos/joc1n3rdspfyp1yoddmp.mp4', 'studioSasvatVideos/joc1n3rdspfyp1yoddmp', '0', 0, '2024-09-13 05:40:41'),
(3, 'Women Antique Ring', 1, 'Women', 4, 'Women Ring', '<p>Elegant and timeless women’s ring, crafted with premium materials for a sophisticated look. Perfect for everyday wear or special occasions, this ring adds a touch of elegance to any outfit.</p>', '<p>Add a touch of elegance to your jewelry collection with our beautifully crafted <strong>Women’s Ring</strong>. This ring is designed for women who appreciate style, durability, and versatility. Whether you\'re dressing up for an evening out or adding a subtle statement to your everyday attire, this ring complements any look effortlessly.</p><p><strong>Key Features</strong>:</p><ul><li><strong>Premium Craftsmanship</strong>: Each ring is meticulously handcrafted using high-quality metals and gemstones, ensuring lasting shine and durability.</li><li><strong>Elegant Design</strong>: The minimalist yet sophisticated design makes it perfect for both casual wear and formal events.</li><li><strong>Durable Materials</strong>: Made from sterling silver, gold, or other fine materials, this ring resists tarnishing and ensures a long-lasting, beautiful finish.</li><li><strong>Comfortable Fit</strong>: Designed for maximum comfort, this ring is lightweight and sits comfortably on the finger without causing irritation.</li><li><strong>Versatility</strong>: Ideal for wearing solo as a statement piece or stacking with other rings for a layered look. Suitable for everyday wear or special occasions like weddings, parties, and anniversaries.</li><li><strong>Hypoallergenic</strong>: Crafted with materials safe for sensitive skin, ensuring no irritation or allergic reactions.</li></ul><p>This <strong>Women’s Ring</strong> is an excellent gift for loved ones, symbolizing elegance and sophistication. Available in various sizes and finishes, it’s perfect for celebrating special moments or simply as a treat to yourself. The ring\'s sleek and versatile design makes it an essential accessory for modern women who appreciate both style and quality.</p>', '99', '0', '5', 8, 7, 0, 0, 0, '<p>We aim to provide fast and reliable delivery for your <strong>Women’s Ring</strong>. After placing your order, you’ll receive a confirmation email with details about the shipping process. Standard shipping usually takes 5-7 business days within the country, and international shipping may take 10-15 business days, depending on the destination. Once shipped, you’ll receive tracking information to monitor the delivery status of your package.</p><p><strong>Note</strong>: Delivery times may vary due to factors such as holidays or global shipping conditions. We partner with trusted couriers to ensure your item arrives in perfect condition.</p>', '<p>There is no return policy for this <strong>Women’s Ring</strong> due to hygiene concerns. However, you can cancel your order before the item is shipped. If you receive a defective or incorrect product, we offer free replacements. Please contact our support team within 24 hours of delivery to arrange for a replacement. We are committed to resolving any issues and ensuring you are satisfied with your purchase.</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206183/studioSasvatImages/vldmfhblnwms07t2si5o.png', 'studioSasvatImages/vldmfhblnwms07t2si5o', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726206185/studioSasvatVideos/qdtinqg13v4ga8ibrpfl.mp4', 'studioSasvatVideos/qdtinqg13v4ga8ibrpfl', '0', 0, '2024-09-13 05:43:05'),
(4, 'Women Antique Earing 2', 1, 'Women', 2, 'Women Earing', '<p>Step into a world of elegance and charm with our Women’s Epoxy Earrings. Carefully handcrafted with premium epoxy resin, these lightweight, hypoallergenic earrings are perfect for any occasion. A seamless blend of modern design and timeless beauty, they’re designed to complement your unique style.</p>', '<p>Our Women’s Epoxy Earrings are a stunning blend of artistry and elegance, handcrafted with precision using high-quality epoxy resin. These earrings are lightweight, hypoallergenic, and comfortable, making them perfect for everyday wear or special occasions. The smooth, glossy finish of the resin adds a touch of sophistication, while the vibrant colors and unique patterns make each pair truly one-of-a-kind.</p><p>These earrings are designed for the modern woman who appreciates stylish accessories that can transition seamlessly from casual to formal settings. Whether you’re attending a wedding, a party, or simply going about your daily routine, these earrings will add a charming, elegant touch to your outfit.</p><p><strong>Key Features</strong>:</p><ul><li><strong>Handcrafted Design</strong>: Each pair is uniquely handmade, ensuring no two pairs are exactly alike.</li><li><strong>Lightweight &amp; Comfortable</strong>: Designed for all-day wear without causing discomfort.</li><li><strong>Hypoallergenic</strong>: Suitable for sensitive skin, crafted with materials that prevent irritation.</li><li><strong>Versatile</strong>: Perfect for both casual and formal outfits, adding a sophisticated touch to any look.</li><li><strong>Durable</strong>: Epoxy resin ensures longevity and resistance to fading, maintaining its beauty over time.</li></ul><p>Enhance your wardrobe with these unique, stylish earrings that offer both comfort and elegance, making them the perfect accessory for any occasion.</p>', '299', '0', '20', 21, 1, 1, 0, 0, '<p>We prioritize fast, reliable, and safe delivery for your purchases. Once your order is placed and confirmed, our team ensures a seamless processing experience to get your earrings delivered to you as quickly as possible.</p><p><strong>Shipping Options</strong>:</p><ul><li><strong>Standard Delivery</strong>: Orders are typically processed within 1-2 business days. Once processed, delivery will take approximately 5-7 business days, depending on your location. We ensure that all products are securely packaged to protect your earrings during transit.</li><li><strong>Express Delivery</strong>: If you need your earrings sooner, we offer an express delivery option, which ensures that your package reaches you within 2-3 business days after processing.</li></ul><p>We ship to most locations domestically and internationally. Our goal is to make sure your shopping experience is as convenient and hassle-free as possible. Upon dispatch, you will receive tracking details via email so you can monitor the progress of your delivery at all times.</p>', '<p>Due to the nature of earrings and the importance of hygiene, we currently do not accept returns on our Women’s Epoxy Earrings. This ensures that all of our customers receive brand new, hygienically safe products every time they order.</p><p>However, we understand that situations may arise where you need to cancel your order. You may cancel your purchase anytime before the earrings have been shipped out. Simply contact our customer support team with your order number, and we will assist you in canceling the order without any additional charges.</p><p>In the unlikely event that you receive a damaged or defective product, please reach out to us immediately. We take great care in ensuring the quality of every item shipped, but if an issue arises, we will work to resolve it by either replacing the product or issuing store credit as appropriate.</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206335/studioSasvatImages/pvj17jcjrjyogit0kg1s.webp', 'studioSasvatImages/pvj17jcjrjyogit0kg1s', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726206338/studioSasvatVideos/oztcma8jpgl9rgqmz6ge.mp4', 'studioSasvatVideos/oztcma8jpgl9rgqmz6ge', '0', 0, '2024-09-13 05:45:38'),
(5, 'Test Product 1', 1, 'Women', 3, 'Women Necklace', '<p>test sd</p>', '<p>test dd</p>', '599', '0', '20', 19, 1, 0, 0, 0, '<p>test sp</p>', '<p>test rp</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206403/studioSasvatImages/aylnqlugvdpucyoonhgp.webp', 'studioSasvatImages/aylnqlugvdpucyoonhgp', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726206406/studioSasvatVideos/vn3lgxy8kootpblsnr4a.mp4', 'studioSasvatVideos/vn3lgxy8kootpblsnr4a', '0', 0, '2024-09-13 05:46:46'),
(6, 'Test Product 2', 1, 'Women', 5, 'Women Payal', '<p>test sd</p>', '<p>test dd</p>', '699', '0', '15', 16, 2, 0, 0, 0, '<p>test dp</p>', '<p>test rp</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726206476/studioSasvatImages/dnxjajiktdw6ndqgtfrt.jpg', 'studioSasvatImages/dnxjajiktdw6ndqgtfrt', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726206478/studioSasvatVideos/x6mfqxepgmql0mfzyh2y.mp4', 'studioSasvatVideos/x6mfqxepgmql0mfzyh2y', '0', 0, '2024-09-13 05:47:59'),
(7, 'Test Product 3', 1, 'Women', 5, 'Women Payal', '<p>test sd</p>', '<p>test dd</p>', '399', '0', '30', 28, 0, 0, 0, 0, '<p>test dp</p>', '<p>test rp</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209596/studioSasvatImages/sfpvx53peleyejrdta95.png', 'studioSasvatImages/sfpvx53peleyejrdta95', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726209598/studioSasvatVideos/l0iady61rthv9niztvay.mp4', 'studioSasvatVideos/l0iady61rthv9niztvay', '3.5', 0, '2024-09-13 06:39:59'),
(8, 'Test Product 4', 1, 'Women', 6, 'Women Bracelet', '<p>test sd</p>', '<p>test dd</p>', '499', '0', '10', 13, 1, 0, 0, 0, '<p>test dp</p>', '<p>test rp</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209668/studioSasvatImages/uo6l7lftsl4zpc75rxo2.png', 'studioSasvatImages/uo6l7lftsl4zpc75rxo2', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726209670/studioSasvatVideos/ltd5zij0vhc1stuqr1sn.mp4', 'studioSasvatVideos/ltd5zij0vhc1stuqr1sn', '0', 0, '2024-09-13 06:41:11'),
(9, 'Test Product 5', 1, 'Women', 1, 'Women Pendant', '<p>test sd</p>', '<p>test dd</p>', '59', '0', '5', 11, 0, 0, 0, 0, '<p>test dp</p>', '<p>test rp</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209740/studioSasvatImages/lisunkczieafk9ahz0uo.jpg', 'studioSasvatImages/lisunkczieafk9ahz0uo', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726209742/studioSasvatVideos/bjza1jbogc6g7qctwrrv.mp4', 'studioSasvatVideos/bjza1jbogc6g7qctwrrv', '0', 0, '2024-09-13 06:42:22'),
(10, 'Test Product 6', 1, 'Women', 4, 'Women Ring', '<p>test sd</p>', '<p>test dd</p>', '149', '0', '5', 39, 1, 0, 0, 0, '<p>test dp</p>', '<p>test rp</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209832/studioSasvatImages/g1oxdshetijefurmp7yy.png', 'studioSasvatImages/g1oxdshetijefurmp7yy', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726209834/studioSasvatVideos/gjw3u6iuy1ssrwxgdtwn.mp4', 'studioSasvatVideos/gjw3u6iuy1ssrwxgdtwn', '0', 0, '2024-09-13 06:43:54'),
(11, 'Test Product 7', 1, 'Women', 6, 'Women Bracelet', '<p>test sd</p>', '<p>test dd</p>', '249', '0', '20', 3, 2, 0, 0, 0, '<p>test dp</p>', '<p>test rp</p>', 0, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209902/studioSasvatImages/vckb3cljtydotrbiemgb.jpg', 'studioSasvatImages/vckb3cljtydotrbiemgb', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726209904/studioSasvatVideos/fsh29a3uqek5sesjcvnt.mp4', 'studioSasvatVideos/fsh29a3uqek5sesjcvnt', '0', 0, '2024-09-13 06:45:05'),
(12, 'Test Product 8', 1, 'Women', 3, 'Women Necklace', '<p>test sd</p>', '<p>test dd</p>', '559', '60', '25', 10, 2, 0, 0, 0, '<p>test dp</p>', '<p>test rp</p>', 1, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209998/studioSasvatImages/m1jhwlffuaccgmup6a9m.png', 'studioSasvatImages/m1jhwlffuaccgmup6a9m', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726210000/studioSasvatVideos/c3wj9mtuliiai7dih1sf.mp4', 'studioSasvatVideos/c3wj9mtuliiai7dih1sf', '0', 0, '2024-09-13 06:46:41'),
(13, 'Test Product 9', 1, 'Women', 5, 'Women Payal', '<p>test sd</p>', '<p>test dd</p>', '899', '80', '15', 16, 0, 0, 0, 0, '<p>test dp</p>', '<p>test rp</p>', 1, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726210566/studioSasvatImages/t3mrswndjcdmutsxrfrt.jpg', 'studioSasvatImages/t3mrswndjcdmutsxrfrt', 'https://res.cloudinary.com/depjzfj9a/video/upload/v1726210567/studioSasvatVideos/vrhfuqkpxmohvtk75gjd.mp4', 'studioSasvatVideos/vrhfuqkpxmohvtk75gjd', '0', 0, '2024-09-13 06:56:08');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `_id` int NOT NULL,
  `productId` bigint NOT NULL,
  `userId` bigint NOT NULL,
  `userName` varchar(25) NOT NULL,
  `rating` varchar(10) NOT NULL,
  `review` varchar(1000) DEFAULT NULL,
  `ratingProductOneImageUrl` varchar(500) DEFAULT NULL,
  `ratingProductOneImagePublicId` varchar(500) DEFAULT NULL,
  `ratingProductTwoImageUrl` varchar(500) DEFAULT NULL,
  `ratingProductTwoImagePublicId` varchar(500) DEFAULT NULL,
  `ratingProductThreeImageUrl` varchar(500) DEFAULT NULL,
  `ratingProductThreeImagePublicId` varchar(500) DEFAULT NULL,
  `ratingProductFourImageUrl` varchar(500) DEFAULT NULL,
  `ratingProductFourImagePublicId` varchar(500) DEFAULT NULL,
  `ratingProductFiveImageUrl` varchar(500) DEFAULT NULL,
  `ratingProductFiveImagePublicId` varchar(500) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `secondary_banners`
--

CREATE TABLE `secondary_banners` (
  `_id` int NOT NULL,
  `secondaryBannerImageUrl` varchar(500) NOT NULL,
  `secondaryBannerImagePublicId` varchar(500) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `secondary_banners`
--

INSERT INTO `secondary_banners` (`_id`, `secondaryBannerImageUrl`, `secondaryBannerImagePublicId`, `createdAt`) VALUES
(1, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200866/studioSasvatImages/secondaryBannerImage/mnwjjtza0jzkclxpudcf.png', 'studioSasvatImages/secondaryBannerImage/mnwjjtza0jzkclxpudcf', '2024-09-13 04:14:27'),
(2, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200867/studioSasvatImages/secondaryBannerImage/hcjourbxvzdjyqxulbac.png', 'studioSasvatImages/secondaryBannerImage/hcjourbxvzdjyqxulbac', '2024-09-13 04:14:28'),
(3, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200868/studioSasvatImages/secondaryBannerImage/orlrtjucg5y9baiclqdi.png', 'studioSasvatImages/secondaryBannerImage/orlrtjucg5y9baiclqdi', '2024-09-13 04:14:29'),
(4, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200871/studioSasvatImages/secondaryBannerImage/cuiflo0eqfxkl4bkiqko.png', 'studioSasvatImages/secondaryBannerImage/cuiflo0eqfxkl4bkiqko', '2024-09-13 04:14:31'),
(5, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200872/studioSasvatImages/secondaryBannerImage/ecu3sqccrwnwfmc3iz7h.png', 'studioSasvatImages/secondaryBannerImage/ecu3sqccrwnwfmc3iz7h', '2024-09-13 04:14:32'),
(6, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726200873/studioSasvatImages/secondaryBannerImage/uviyjca5nauusxbb1moz.png', 'studioSasvatImages/secondaryBannerImage/uviyjca5nauusxbb1moz', '2024-09-13 04:14:34');

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `_id` int NOT NULL,
  `categoryId` bigint NOT NULL,
  `categoryName` varchar(100) NOT NULL,
  `subCategoryName` varchar(100) NOT NULL,
  `subCategoryImageUrl` varchar(500) NOT NULL,
  `subCategoryImagePublicId` varchar(500) NOT NULL,
  `isDeleted` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sub_categories`
--

INSERT INTO `sub_categories` (`_id`, `categoryId`, `categoryName`, `subCategoryName`, `subCategoryImageUrl`, `subCategoryImagePublicId`, `isDeleted`, `createdAt`) VALUES
(1, 1, 'Women', 'Women Pendant', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726141988/studioSasvatImages/uie3cfnnsdvptoalhajk.jpg', 'studioSasvatImages/uie3cfnnsdvptoalhajk', 0, '2024-09-12 11:53:09'),
(2, 1, 'Women', 'Women Earing', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726204232/studioSasvatImages/yqgxjv4e1rwoagokbq9u.jpg', 'studioSasvatImages/yqgxjv4e1rwoagokbq9u', 0, '2024-09-13 05:10:33'),
(3, 1, 'Women', 'Women Necklace', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726204261/studioSasvatImages/zb5igg7v3tqkq2yp5vuj.jpg', 'studioSasvatImages/zb5igg7v3tqkq2yp5vuj', 0, '2024-09-13 05:11:01'),
(4, 1, 'Women', 'Women Ring', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726204312/studioSasvatImages/tfzycpyyy9uuee7zed1j.webp', 'studioSasvatImages/tfzycpyyy9uuee7zed1j', 0, '2024-09-13 05:11:53'),
(5, 1, 'Women', 'Women Payal', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726204332/studioSasvatImages/shwpvrgvafkkzqebn5uy.jpg', 'studioSasvatImages/shwpvrgvafkkzqebn5uy', 0, '2024-09-13 05:12:13'),
(6, 1, 'Women', 'Women Bracelet', 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726204355/studioSasvatImages/ypy38mywtvv6knvwfk6a.jpg', 'studioSasvatImages/ypy38mywtvv6knvwfk6a', 0, '2024-09-13 05:12:35');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `_id` int NOT NULL,
  `mobileNumber` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `otp` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(80) NOT NULL,
  `mobileNumber` varchar(15) NOT NULL,
  `alternateNumber` varchar(15) DEFAULT NULL,
  `password` varchar(150) NOT NULL,
  `pincode` bigint NOT NULL,
  `city` varchar(25) NOT NULL,
  `state` varchar(20) NOT NULL,
  `country` varchar(50) NOT NULL,
  `role` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`_id`, `name`, `email`, `mobileNumber`, `alternateNumber`, `password`, `pincode`, `city`, `state`, `country`, `role`, `createdAt`) VALUES
(1, 'Studio Sasvat', 'ppatchint75@gmail.com', '9826243120', '', '$2b$10$nQB7rqZISABZ9EITzkf4oup5CFQpKuWahTSs5hL21TxfCF.e614j.', 474001, 'Gwalior', 'Madhya Pradesh', 'India', 'Admin', '2024-08-26 09:36:36'),
(2, 'John Doe', 'johndoe@test.com', '9876543210', '', '$2b$10$XoWskyoZkFXiHXztE3e8GeP8Q4lVq0GlwA5qRMRiLjcj8Aa2NHVi.', 474001, 'Gwalior', 'Madhya Pradesh', 'India', 'User', '2024-08-26 11:16:06'),
(3, 'Sam Torent', 'samtorent@test.com', '3698521470', '', '$2b$10$YSLQFJk48OgIfoG4ob1S5eM3Qg8J7y6PzvuDiq7/KLew7rzlcOEfS', 474001, 'Gwalior', 'Madhya Pradesh', 'India', 'User', '2024-08-28 11:17:58'),
(5, 'Ankur Shrivastava', 'ankur@test.com', '8770089556', '9753353343', '$2b$10$1u9MjErx64kZzGW1Nop6V.w7pD6tB7bMGO28b8QonZGznXZuQNSRm', 474001, 'Gwalior', 'Madhya Pradesh', 'India', 'User', '2024-09-02 06:33:22');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `_id` int NOT NULL,
  `userId` bigint NOT NULL,
  `productId` bigint NOT NULL,
  `productImageUrl` varchar(200) NOT NULL,
  `productName` varchar(50) NOT NULL,
  `price` bigint NOT NULL,
  `discount` int NOT NULL,
  `freeDelivery` int NOT NULL,
  `openBoxDelivery` int NOT NULL,
  `returnAndRefund` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`_id`, `userId`, `productId`, `productImageUrl`, `productName`, `price`, `discount`, `freeDelivery`, `openBoxDelivery`, `returnAndRefund`, `createdAt`) VALUES
(1, 2, 11, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726209902/studioSasvatImages/vckb3cljtydotrbiemgb.jpg', 'Test Product 7', 249, 20, 0, 0, 0, '2024-09-14 06:53:13'),
(2, 2, 1, 'https://res.cloudinary.com/depjzfj9a/image/upload/v1726205873/studioSasvatImages/qbcbtlohokmgulwnbaoj.png', 'Women Antique Earing', 199, 10, 0, 0, 0, '2024-09-16 06:40:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `featured_images`
--
ALTER TABLE `featured_images`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `main_banners`
--
ALTER TABLE `main_banners`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `secondary_banners`
--
ALTER TABLE `secondary_banners`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `featured_images`
--
ALTER TABLE `featured_images`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `main_banners`
--
ALTER TABLE `main_banners`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `secondary_banners`
--
ALTER TABLE `secondary_banners`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
