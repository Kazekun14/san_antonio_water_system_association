-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 25, 2026 at 03:07 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sawsa`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `is_pinned` tinyint(1) NOT NULL DEFAULT '0',
  `expires_at` timestamp NULL DEFAULT NULL,
  `posted_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcement_views`
--

CREATE TABLE `announcement_views` (
  `id` bigint UNSIGNED NOT NULL,
  `announcement_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `id` bigint UNSIGNED NOT NULL,
  `customer_id` bigint UNSIGNED NOT NULL,
  `billing_date` date NOT NULL,
  `consumption` decimal(8,2) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('unpaid','paid','overdue') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `seen_at` timestamp NULL DEFAULT NULL,
  `due_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint UNSIGNED NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `household_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purok` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meter_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `initial_reading` decimal(15,2) NOT NULL DEFAULT '0.00',
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `access_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'physical_only',
  `connection_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `first_name`, `last_name`, `household_address`, `purok`, `meter_number`, `email`, `initial_reading`, `phone_number`, `balance`, `user_id`, `access_type`, `connection_status`, `created_at`, `updated_at`) VALUES
(37, 'Kurt Shiedrick', 'Tangcay', 'Atbang sa bilyaran', 'Spathiphyllum', 'MTR-1111', 'kurtshiedrickbomedianotangcay@gmail.com', 0.00, '09984416156', 0.00, NULL, 'physical_only', 'active', '2026-07-31 08:34:15', '2026-07-31 08:34:15'),
(38, 'Kirk Shien', 'Tangcay', 'Atbang saka dadang', 'Sampaguita', NULL, NULL, 0.00, NULL, 0.00, NULL, 'physical_only', 'active', '2026-08-10 16:10:51', '2026-08-10 16:10:51');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meter_readings`
--

CREATE TABLE `meter_readings` (
  `id` bigint UNSIGNED NOT NULL,
  `meter_reader_id` bigint UNSIGNED DEFAULT NULL,
  `customer_id` bigint UNSIGNED NOT NULL,
  `recorded_by_user_id` bigint UNSIGNED DEFAULT NULL,
  `reading_date` date NOT NULL,
  `meter_reading` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` enum('pending','approved') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meter_readings`
--

INSERT INTO `meter_readings` (`id`, `meter_reader_id`, `customer_id`, `recorded_by_user_id`, `reading_date`, `meter_reading`, `status`, `created_at`, `updated_at`) VALUES
(153, 44, 37, 44, '2026-08-01', 0.00, 'approved', '2026-09-09 16:38:01', '2026-09-09 17:22:21'),
(154, 46, 38, 44, '2026-08-01', 0.00, 'pending', '2026-09-09 16:40:28', '2026-09-09 16:40:28');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_19_084933_add_water_fields_to_users_table', 1),
(5, '2026_04_20_125136_create_bills_table', 1),
(6, '2026_04_20_125137_create_payments_table', 1),
(7, '2026_04_21_000001_add_role_to_users_table', 1),
(8, '2026_04_21_000002_create_water_rates_table', 1),
(9, '2026_04_21_000003_create_meter_readings_table', 1),
(10, '2026_04_23_230219_update_payments_table_and_add_balance_to_users', 1),
(11, '2026_04_23_230627_create_personal_access_tokens_table', 1),
(12, '2026_05_08_171921_create_announcements_table', 1),
(13, '2026_05_08_171922_create_announcement_views_table', 1),
(14, '2026_05_11_090714_refactor_users_table_for_new_auth_and_names', 1),
(15, '2026_05_11_091850_drop_account_number_from_users_table', 1),
(16, '2026_05_11_091900_drop_account_number_from_users_table', 1),
(17, '2026_05_11_094150_add_social_login_fields_to_users_table', 1),
(18, '2026_05_11_102305_make_address_nullable_on_users_table', 1),
(19, '2026_05_11_105640_make_credential_fields_nullable_on_users_table', 1),
(20, '2026_05_11_133003_remove_social_login_columns_from_users_table', 1),
(21, '2026_05_11_143626_add_seen_at_to_bills_table', 1),
(22, '2026_05_11_145435_create_push_subscriptions_table', 1),
(23, '2026_05_14_075040_create_customers_and_refactor_schema', 1),
(24, '2026_05_14_094917_add_fcm_token_to_users_table', 1),
(25, '2026_05_14_134337_create_notifications_table', 1),
(26, '2026_05_14_144432_add_account_status_to_customers_table', 1),
(27, '2026_05_14_145214_rename_account_status_to_access_type_in_customers_table', 1),
(28, '2026_05_14_150544_add_connection_status_to_customers_table', 1),
(29, '2026_05_14_151013_add_zone_to_customers_table', 1),
(30, '2026_05_14_151954_add_meter_fields_and_email_to_customers_table', 1),
(31, '2026_05_17_170025_drop_username_from_customers_table', 1),
(32, '2026_05_27_150000_rename_address_and_zone_to_house_address_and_purok_in_customers', 1),
(33, '2026_05_27_160000_rename_phone_to_phone_number_in_customers', 1),
(34, '2026_05_27_170000_rename_house_address_to_household_address_in_customers', 1),
(35, '2026_08_03_000000_refactor_meter_readings_table', 1),
(36, '2026_08_03_000001_add_position_to_users_table', 2),
(37, '2026_08_06_000001_add_unique_customer_reading_date_to_meter_readings_table', 3),
(38, '2026_08_09_000001_add_status_to_meter_readings_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint UNSIGNED NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('00ea3b73-3c70-405e-8b07-3464da7a5db2', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T13:35:46.436078Z\"}}', NULL, '2026-08-06 05:35:46', '2026-08-06 05:35:46'),
('023202f8-463f-4322-9b0f-972d5f3712f6', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-08 08:02:33', '2026-08-08 08:02:33'),
('03227bd7-5f2c-4b3b-b069-df305d6710ce', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 07:37:45', '2026-08-09 07:37:45'),
('032ca5e4-0715-4763-96da-2a057baee4ff', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:58:12.183748Z\"}}', NULL, '2026-08-08 16:58:12', '2026-08-08 16:58:12'),
('04d85298-0ca9-4727-988f-63e83d63fbd5', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:58:54.980028Z\"}}', NULL, '2026-08-08 16:58:55', '2026-08-08 16:58:55'),
('09aac2bd-34a2-42c9-8104-3c77f7812b30', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-13\"}}', NULL, '2026-08-13 02:26:18', '2026-08-13 02:26:18'),
('0b8d0e82-363a-40e0-845d-956939128a89', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T06:12:23.055890Z\"}}', NULL, '2026-08-05 22:12:23', '2026-08-05 22:12:23'),
('0bb5bba1-cd27-4d82-81bf-0d8b1ecfcec9', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":33}}', NULL, '2026-08-08 00:41:15', '2026-08-08 00:41:15'),
('0c5c6aed-3fb1-4f20-80eb-f336609cebfa', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T06:37:08.973213Z\"}}', NULL, '2026-08-05 22:37:09', '2026-08-05 22:37:09'),
('0d45b0b4-7427-442b-a663-8d6e24c674be', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-08\"}}', NULL, '2026-08-08 08:04:48', '2026-08-08 08:04:48'),
('0f699640-9ba0-4d3a-83cf-3a200f8ed4ca', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T14:23:30.629978Z\"}}', NULL, '2026-08-08 06:23:30', '2026-08-08 06:23:30'),
('0ffa0ee3-e29f-41a2-89c3-462bdeaa66e9', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:35:52.464158Z\"}}', NULL, '2026-08-08 00:35:52', '2026-08-08 00:35:52'),
('11f6f497-9ca7-4fed-84cf-7f9c78332abb', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-04T09:26:35.413481Z\"}}', NULL, '2026-08-04 01:26:35', '2026-08-04 01:26:35'),
('151e8aab-6100-4ad0-a5bf-473db2855b8b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-08 16:36:09', '2026-08-08 16:36:09'),
('160c41b6-cb77-454f-9102-4170e1377ca7', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":5}}', NULL, '2026-08-04 01:15:59', '2026-08-04 01:15:59'),
('167f384f-eec9-40e2-a954-0d0345adb3bb', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T12:41:18.431188Z\"}}', NULL, '2026-08-06 04:41:18', '2026-08-06 04:41:18'),
('1785ed64-055f-43f8-9fd5-c74eb4a21fe8', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:43:46', '2026-08-14 07:43:46'),
('17893f4e-8a01-47ea-ab47-eb4055442479', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T07:20:23.180246Z\"}}', NULL, '2026-08-09 07:20:23', '2026-08-09 07:20:23'),
('181ea155-40e1-487e-809c-6c76255fb611', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":26}}', NULL, '2026-08-07 22:19:08', '2026-08-07 22:19:08'),
('18252f65-ce87-4695-a658-9ae6971fdbbc', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-08\"}}', NULL, '2026-08-08 08:04:48', '2026-08-08 08:04:48'),
('18bfd8b0-a914-482d-a890-e397ec0ed373', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-14\"}}', NULL, '2026-08-14 02:54:45', '2026-08-14 02:54:45'),
('195c3026-daa6-408d-ab10-4aa74c8ac871', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-14\"}}', NULL, '2026-08-14 02:54:45', '2026-08-14 02:54:45'),
('19f0613e-01de-499c-ad7f-019632b36e47', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T12:18:59.412648Z\"}}', NULL, '2026-08-06 04:18:59', '2026-08-06 04:18:59'),
('1b848006-a6ad-4450-b7c7-2675ab3879e4', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:35:52.464158Z\"}}', NULL, '2026-08-08 00:35:52', '2026-08-08 00:35:52'),
('1bb213ee-1412-4e3c-8e84-f92d7eded935', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:25:05', '2026-08-14 07:25:05'),
('1c4b4c0a-4bb0-4173-8fec-3c489e7981f2', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":40}}', NULL, '2026-08-08 04:51:09', '2026-08-08 04:51:09'),
('1c66f651-cf17-46c5-9674-d731f8f3bf81', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 07:19:24', '2026-08-09 07:19:24'),
('1c793051-1ebb-4dda-a91e-d91038c1669e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-04T09:26:35.413481Z\"}}', NULL, '2026-08-04 01:26:35', '2026-08-04 01:26:35'),
('1c9c3aeb-22cf-4b0f-9fad-308a1daee4bb', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 07:43:32', '2026-08-09 07:43:32'),
('1cdab149-6bec-4f81-a94a-abd5fcfa9017', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":1}}', NULL, '2026-08-03 08:01:47', '2026-08-03 08:01:47'),
('1d1fdbac-41c6-47c5-8550-0e677cb861f6', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-10 16:24:40', '2026-08-10 16:24:40'),
('1dbae8e6-1915-4a41-aaac-0df5851571a3', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 02:54:13', '2026-08-14 02:54:13'),
('1e503401-f4ee-40d8-a45c-27987245db55', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T14:23:30.629978Z\"}}', NULL, '2026-08-08 06:23:30', '2026-08-08 06:23:30'),
('1e9b75b0-19e9-4db1-bc00-178e4294f78d', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:45:40', '2026-08-08 16:45:40'),
('1f5d559c-a41b-4d5b-a693-6d6aa2113c3c', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-10 15:57:42', '2026-08-10 15:57:42'),
('226a480c-6fbb-4b4b-8f80-046192a98135', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:47:10.742559Z\"}}', NULL, '2026-08-08 16:47:10', '2026-08-08 16:47:10'),
('22bb1917-29a2-4f38-86c7-d87b07abfe69', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T07:20:45.983856Z\"}}', NULL, '2026-08-09 07:20:46', '2026-08-09 07:20:46'),
('23b0f370-ee0a-4556-9e26-9aa9a9db2bf5', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-04T09:37:16.713925Z\"}}', NULL, '2026-08-04 01:37:16', '2026-08-04 01:37:16'),
('24088d15-f51c-455a-a914-40ddbdf85575', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:25:06', '2026-08-14 07:25:06'),
('24322e92-9af5-485a-80ed-ae1d55fbdb9c', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-09-09 16:38:01', '2026-09-09 16:38:01'),
('24ab7db9-bbf3-41cd-9e71-0e0b6d8790fa', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T13:35:46.436078Z\"}}', NULL, '2026-08-06 05:35:46', '2026-08-06 05:35:46'),
('250c73d7-2119-43a1-8202-1ac0e11cec89', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:29:23', '2026-08-14 07:29:23'),
('256be0d5-7c0a-45d6-9699-593ca079630d', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 06:48:26', '2026-08-09 06:48:26'),
('2894e127-c78a-485d-833c-9626811ee808', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-18\"}}', NULL, '2026-08-18 04:44:42', '2026-08-18 04:44:42'),
('2a307afb-2d20-45fd-9528-7e95f99a30b7', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T07:20:45.983856Z\"}}', NULL, '2026-08-09 07:20:46', '2026-08-09 07:20:46'),
('2baf17c9-9c2f-42d1-8528-71220cddc47b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-03T17:49:02.730620Z\"}}', NULL, '2026-08-03 09:49:02', '2026-08-03 09:49:02'),
('2c868aab-18de-4cd3-b510-203d5821d524', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-04\"}}', NULL, '2026-08-16 11:15:50', '2026-08-16 11:15:50'),
('2d8041a1-c0e8-47c5-89b2-7ac932ec4ef6', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":9}}', NULL, '2026-08-05 03:36:56', '2026-08-05 03:36:56'),
('2dd6c4d4-e13c-460c-b32b-8bef0c28848b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-08 16:36:09', '2026-08-08 16:36:09'),
('2eb32d70-36b5-49de-b520-3c65706636cd', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-18\"}}', NULL, '2026-08-18 04:44:42', '2026-08-18 04:44:42'),
('2ec2f409-4e5d-45de-94bb-1a9996f1d892', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:37:52', '2026-08-08 16:37:52'),
('31bfc7e3-ccc4-4e60-b811-77c34839449f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 06:48:26', '2026-08-09 06:48:26'),
('31fa57b4-22e4-4801-be9e-5265707aec6f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-09 05:33:16', '2026-08-09 05:33:16'),
('32fcc456-eb5d-44fb-9ec7-55b7535ab8a9', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":39}}', NULL, '2026-08-08 04:47:26', '2026-08-08 04:47:26'),
('3383ef25-c8c9-42c1-9721-5404ed7a905d', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":41}}', NULL, '2026-08-08 06:18:11', '2026-08-08 06:18:11'),
('33b3fed0-92f7-47a0-87a3-4b2fb1bdf041', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T06:43:51.932855Z\"}}', NULL, '2026-08-09 06:43:51', '2026-08-09 06:43:51'),
('33d0235b-e46c-4a89-a0a8-046796db6b3e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:35:52.464158Z\"}}', NULL, '2026-08-08 00:35:52', '2026-08-08 00:35:52'),
('33f7bdd3-57ec-4407-a59f-68ca5d9f96a6', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:27:27.577707Z\"}}', NULL, '2026-08-08 00:27:27', '2026-08-08 00:27:27'),
('3524756f-cbc2-4357-b7d9-16b39d056347', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 07:19:24', '2026-08-09 07:19:24'),
('35b04cb6-8c72-4a2c-85be-85657d47769e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":31}}', NULL, '2026-08-08 00:37:32', '2026-08-08 00:37:32'),
('37952a89-8532-44eb-bc0a-ce1cd420fa68', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-04\"}}', NULL, '2026-08-16 11:17:01', '2026-08-16 11:17:01'),
('38438778-9444-47d6-a2c4-43817d08a557', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":37}}', NULL, '2026-08-08 04:43:38', '2026-08-08 04:43:38'),
('384c4883-0f9a-411e-b42e-7d2a61592c56', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-08\"}}', NULL, '2026-08-08 16:42:33', '2026-08-08 16:42:33'),
('393ff243-cddd-4253-be44-263803217eae', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-15 09:03:44', '2026-08-15 09:03:44'),
('39821dc2-1801-408b-83ba-f364982a54ec', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":1}}', NULL, '2026-08-03 08:01:47', '2026-08-03 08:01:47'),
('3bafbea7-b933-4d48-b3ef-7c49a37c0559', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:45:40', '2026-08-08 16:45:40'),
('3dc5955d-5d3c-4112-ba02-556f875c5255', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T06:37:08.973213Z\"}}', NULL, '2026-08-05 22:37:09', '2026-08-05 22:37:09'),
('3ed8702b-4cbe-4fd9-800c-2375af3eba2e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-08\"}}', NULL, '2026-08-08 16:42:33', '2026-08-08 16:42:33'),
('3f3b8128-2ef5-48d5-8510-1c28f353fb3f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:27:27.577707Z\"}}', NULL, '2026-08-08 00:27:27', '2026-08-08 00:27:27'),
('4010fd43-cab6-4933-86b3-a21c0f63b656', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T07:20:45.983856Z\"}}', NULL, '2026-08-09 07:20:46', '2026-08-09 07:20:46'),
('41a86a0e-fad4-4b5e-864b-b1285edd6c35', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-08 08:02:33', '2026-08-08 08:02:33'),
('41b5ea49-c8be-4afc-b75a-cc0258ede286', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T12:18:59.412648Z\"}}', NULL, '2026-08-06 04:18:59', '2026-08-06 04:18:59'),
('41dd567c-c219-43d4-9966-c1af0f2fba92', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-10 16:24:40', '2026-08-10 16:24:40'),
('4324cb51-4eac-45a1-b9bb-a5145ca68365', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 07:19:46', '2026-08-09 07:19:46'),
('4343cf03-7e16-4c80-997a-0b6b30b81bea', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:25:06', '2026-08-14 07:25:06'),
('44297291-8075-4448-8061-4e26a41d32cf', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":34}}', NULL, '2026-08-08 00:41:46', '2026-08-08 00:41:46'),
('4546bd37-cae4-4835-999f-dbf576c95b5e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-10T16:45:55.974394Z\"}}', NULL, '2026-08-10 16:45:56', '2026-08-10 16:45:56'),
('46069eb9-3da3-40c8-89be-4ad0c8982589', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-07-31\"}}', NULL, '2026-08-14 07:24:38', '2026-08-14 07:24:38'),
('467499b7-e27b-4701-bcee-22806c6c68e4', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T07:13:27.059563Z\"}}', NULL, '2026-08-05 23:13:27', '2026-08-05 23:13:27'),
('472a63b1-be59-4bed-ae19-7d64065680aa', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":40}}', NULL, '2026-08-08 04:51:09', '2026-08-08 04:51:09'),
('4844711c-fc64-43ef-8665-e56929d153af', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":17}}', NULL, '2026-08-06 04:36:12', '2026-08-06 04:36:12'),
('49455051-22c7-4d54-a823-142be89e1839', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 06:48:13', '2026-08-09 06:48:13'),
('49a67b64-2b32-47be-9b18-bd2e3be75d8c', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":25}}', NULL, '2026-08-07 22:12:34', '2026-08-07 22:12:34'),
('49e88826-541b-45c5-98b2-34bc20663d6a', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:29:23', '2026-08-14 07:29:23'),
('4a59a8cc-923e-4ef1-9a54-3b40535ab418', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-04T09:37:16.713925Z\"}}', NULL, '2026-08-04 01:37:16', '2026-08-04 01:37:16'),
('4cb35ca0-6e5c-473a-aeff-1323746e12c9', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:42:45.374481Z\"}}', NULL, '2026-08-08 00:42:45', '2026-08-08 00:42:45'),
('4cce9e9d-e0de-4b05-a46d-830d3dafee27', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":36}}', NULL, '2026-08-08 04:03:36', '2026-08-08 04:03:36'),
('4ce595b9-9640-4eb1-a504-a1a872c2112d', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-07-31\"}}', NULL, '2026-08-14 07:29:34', '2026-08-14 07:29:34'),
('4d5c7d4c-83b1-4938-b4f2-33a244eafd71', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 05:42:59', '2026-08-09 05:42:59'),
('4d65bd8c-f3c7-4ec6-847a-49e3f891fd32', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T14:23:30.629978Z\"}}', NULL, '2026-08-08 06:23:30', '2026-08-08 06:23:30'),
('4d8ffa61-c836-4667-98f1-aa298c6a2fd1', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":27}}', NULL, '2026-08-07 22:26:30', '2026-08-07 22:26:30'),
('4ed4766d-1821-4811-a4da-ecd99db10f85', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-08 17:07:17', '2026-08-08 17:07:17'),
('4f724c55-4674-4541-b8a5-afa3e5b9da68', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:53:25.437439Z\"}}', NULL, '2026-08-08 16:53:25', '2026-08-08 16:53:25'),
('4fd7c3a9-f913-4eed-9535-c374af97aea1', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:29:23', '2026-08-14 07:29:23'),
('51b10dcb-6ec7-425f-8cd9-bfcd4a43138c', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":34}}', NULL, '2026-08-08 00:41:46', '2026-08-08 00:41:46'),
('51cbcb16-301c-4a2e-8786-9d57c82bff7a', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":26}}', NULL, '2026-08-07 22:19:08', '2026-08-07 22:19:08'),
('52be9233-587b-4aaf-82c9-05d903f8511f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-04\"}}', NULL, '2026-08-16 11:17:01', '2026-08-16 11:17:01'),
('537064b1-314d-4afd-9955-bd18d6fb9622', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T06:43:51.932855Z\"}}', NULL, '2026-08-09 06:43:51', '2026-08-09 06:43:51'),
('53d04b80-fdca-44f7-ada8-999f46bdcd08', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-15T09:07:13.679791Z\"}}', NULL, '2026-08-15 09:07:13', '2026-08-15 09:07:13'),
('54b168cb-0be3-4ff1-89eb-e7ea90d7c711', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:58:12.183748Z\"}}', NULL, '2026-08-08 16:58:12', '2026-08-08 16:58:12'),
('5704555f-7058-4265-a313-7cb8a6e5bf99', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-15 09:03:26', '2026-08-15 09:03:26'),
('58a73d7e-9820-434e-b4df-e54dcf80dd74', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-07-31\"}}', NULL, '2026-08-14 07:29:34', '2026-08-14 07:29:34'),
('58dac287-8d3d-4c37-8699-6d0b63eae380', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 02:54:13', '2026-08-14 02:54:13'),
('59eedda5-5e74-40a0-abb4-8817a2f61a47', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":19}}', NULL, '2026-08-06 05:27:26', '2026-08-06 05:27:26'),
('5adf2d63-7b62-457a-ab5a-5f61f049ffe8', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T14:31:59.108270Z\"}}', NULL, '2026-08-06 06:31:59', '2026-08-06 06:31:59'),
('5b2d66a0-207a-49fc-93ce-3880f67d59b3', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T17:01:21.720637Z\"}}', NULL, '2026-08-08 17:01:21', '2026-08-08 17:01:21'),
('5c3ce1b0-a8db-48e8-b087-3cff0b9a9266', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:59:50.524681Z\"}}', NULL, '2026-08-08 16:59:50', '2026-08-08 16:59:50'),
('5c44cce3-29a3-4435-9ae8-7e5ce1070533', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":4}}', NULL, '2026-08-03 22:42:01', '2026-08-03 22:42:01'),
('5d963b15-b252-4132-8602-ceb7c83e1500', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T14:31:59.108270Z\"}}', NULL, '2026-08-06 06:31:59', '2026-08-06 06:31:59'),
('5de97893-b7c6-472a-8fbb-de01ab98dbff', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T07:13:27.059563Z\"}}', NULL, '2026-08-05 23:13:27', '2026-08-05 23:13:27'),
('5eaf781b-9f65-4768-b452-108412eb3850', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":26}}', NULL, '2026-08-07 22:19:08', '2026-08-07 22:19:08'),
('63a3e195-a62a-473b-b583-223947e72823', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-10 15:17:40', '2026-08-10 15:17:40'),
('64ca22d2-40e2-4b8a-8127-b2f54fbc1807', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-04\"}}', NULL, '2026-08-16 11:17:01', '2026-08-16 11:17:01'),
('64f4225c-ff4a-4a5c-b82e-1599650b3248', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 06:48:13', '2026-08-09 06:48:13'),
('65348e05-48f9-4743-b3b7-07b78148530a', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":16}}', NULL, '2026-08-06 04:35:02', '2026-08-06 04:35:02'),
('666a99c5-00a1-4dd8-9c24-859ec6d9e632', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-15T09:07:13.679791Z\"}}', NULL, '2026-08-15 09:07:13', '2026-08-15 09:07:13'),
('67872fd0-e9c7-41a1-8b5c-1ff8fe0591a5', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 07:19:46', '2026-08-09 07:19:46'),
('67d55256-b201-4603-bd7f-c4857b822889', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:28:58.095119Z\"}}', NULL, '2026-08-08 00:28:58', '2026-08-08 00:28:58'),
('68db37ce-941b-4d78-baea-15c3558dc762', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":25}}', NULL, '2026-08-07 22:12:34', '2026-08-07 22:12:34'),
('6b55bec0-a1fc-41df-839b-275ebd3c9420', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-04\"}}', NULL, '2026-08-16 11:15:50', '2026-08-16 11:15:50'),
('6b61ef35-22c3-4f89-ba7f-438e5218a73b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-08 08:00:23', '2026-08-08 08:00:23'),
('6b62af09-2fdd-473b-a497-cd0eabad7ec4', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:43:46', '2026-08-14 07:43:46'),
('6c711c0c-558a-4346-bf19-b68129ee8a45', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-08 08:02:33', '2026-08-08 08:02:33'),
('6db40d7e-2e2b-45d7-97e1-1fe5c9c08438', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":17}}', NULL, '2026-08-06 04:36:12', '2026-08-06 04:36:12'),
('6dc40492-3d63-4fad-a174-5c52e01fe8bf', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-07-31\"}}', NULL, '2026-08-14 07:24:38', '2026-08-14 07:24:38'),
('6edb5beb-8db9-44e9-83aa-ee1d11bb110a', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:33:49', '2026-08-08 16:33:49'),
('6fc33c92-6f21-46c8-a928-3b79e4027e51', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T17:08:43.440189Z\"}}', NULL, '2026-08-08 17:08:43', '2026-08-08 17:08:43'),
('6ffeee95-826a-428f-9e53-a568dfec67de', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":5}}', NULL, '2026-08-04 01:15:59', '2026-08-04 01:15:59'),
('700ff8ab-392c-490d-a483-7cf3d4a3f8c6', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":19}}', NULL, '2026-08-06 05:27:26', '2026-08-06 05:27:26'),
('70443f0a-a51f-446f-8f75-b88e6bc4ce8c', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:39:13', '2026-08-14 07:39:13'),
('71d3ab8f-e798-4048-814a-eb697abf50b5', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 05:35:55', '2026-08-09 05:35:55'),
('72103cf2-cbc8-4e1d-8313-9d05f331e8e7', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T13:33:21.657318Z\"}}', NULL, '2026-08-06 05:33:21', '2026-08-06 05:33:21'),
('726a1b76-54ad-488e-b451-fa5f17912bbf', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":33}}', NULL, '2026-08-08 00:41:15', '2026-08-08 00:41:15'),
('75377a0e-bdb2-404f-bc9a-5669f43b60af', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T06:12:23.055890Z\"}}', NULL, '2026-08-05 22:12:23', '2026-08-05 22:12:23'),
('7652bb45-949c-460d-81bb-c072856576f3', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:39:14.007804Z\"}}', NULL, '2026-08-08 00:39:14', '2026-08-08 00:39:14'),
('767e5504-47a3-4efa-a07f-0b64e340ff0f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:39:14.007804Z\"}}', NULL, '2026-08-08 00:39:14', '2026-08-08 00:39:14'),
('77306a98-1d38-44e4-9edd-5648d89a8def', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-09-09T16:40:28.767201Z\"}}', NULL, '2026-09-09 16:40:28', '2026-09-09 16:40:28'),
('77894936-6e58-4a0b-bc1c-b3a4eb166400', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-10T16:45:55.974394Z\"}}', NULL, '2026-08-10 16:45:56', '2026-08-10 16:45:56'),
('780c9971-ec8e-4076-8672-fa951e7e40c6', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:45:40', '2026-08-08 16:45:40'),
('7887e1f8-cb7c-4764-b11b-dbddd2446ef7', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T17:03:50.584832Z\"}}', NULL, '2026-08-08 17:03:50', '2026-08-08 17:03:50'),
('78acff99-2dae-49be-9eb8-c3daf1abd520', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T12:44:17.884013Z\"}}', NULL, '2026-08-08 04:44:17', '2026-08-08 04:44:17'),
('794de5a3-bcc0-4d46-8daa-abffecf494ea', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:58:12.183748Z\"}}', NULL, '2026-08-08 16:58:12', '2026-08-08 16:58:12'),
('798bfa70-1143-4a3c-b19a-ac90ba04885b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-10 15:17:40', '2026-08-10 15:17:40'),
('7a3eb5f7-e249-4dd3-a0a1-ddcaed905a0e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 07:19:24', '2026-08-09 07:19:24'),
('7a40000f-18af-440e-9ad2-7f385fd386ab', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-15 09:03:26', '2026-08-15 09:03:26'),
('7cb40e7a-b187-4cd0-886f-821b61b3d52e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-16T11:20:35.198831Z\"}}', NULL, '2026-08-16 11:20:35', '2026-08-16 11:20:35');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('7ccf729a-9396-46ea-a1c8-69499903918d', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":5}}', NULL, '2026-08-04 01:15:59', '2026-08-04 01:15:59'),
('7ceca62c-86c7-4aba-a3be-ff5db13f75c9', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-07-31\"}}', NULL, '2026-08-14 07:24:38', '2026-08-14 07:24:38'),
('7d590351-fcc0-4c0c-92cd-12f4e9eb091c', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T17:08:43.440189Z\"}}', NULL, '2026-08-08 17:08:43', '2026-08-08 17:08:43'),
('7ee8c492-1e5e-406c-a312-560995211c64', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:59:50.524681Z\"}}', NULL, '2026-08-08 16:59:50', '2026-08-08 16:59:50'),
('7f627850-4a66-490b-afcc-edf7b2139c63', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-03T17:49:02.730620Z\"}}', NULL, '2026-08-03 09:49:02', '2026-08-03 09:49:02'),
('822b2149-f12d-4e66-908e-cf37f2ac4bf1', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":1}}', NULL, '2026-08-03 08:01:47', '2026-08-03 08:01:47'),
('834d0e3c-5cf8-4ab9-a1e8-0dcbea6762ba', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T13:33:21.657318Z\"}}', NULL, '2026-08-06 05:33:21', '2026-08-06 05:33:21'),
('85263451-aa50-49e4-a973-0108a0b48675', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:43:59', '2026-08-14 07:43:59'),
('85c3bcaa-2316-4304-8e70-080825378f2b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-04T09:37:16.713925Z\"}}', NULL, '2026-08-04 01:37:16', '2026-08-04 01:37:16'),
('88739cad-e05b-4071-b3ad-0ecc356bb805', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":16}}', NULL, '2026-08-06 04:35:02', '2026-08-06 04:35:02'),
('8930b03c-8ce5-45fe-93b9-4136c2e70408', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-09 05:33:15', '2026-08-09 05:33:15'),
('89494bec-9df2-4d37-917a-3c22d907825c', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:43:59', '2026-08-14 07:43:59'),
('8a4d51b3-18ed-4319-b7cb-cdf3846bd29b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":31}}', NULL, '2026-08-08 00:37:32', '2026-08-08 00:37:32'),
('8aa80e2a-3d50-4525-b898-9a7d70c47f05', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-15 09:03:26', '2026-08-15 09:03:26'),
('8b4c2f83-be64-45a5-a2a1-f1324730ecd8', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":36}}', NULL, '2026-08-08 04:03:36', '2026-08-08 04:03:36'),
('8bf4e482-52d2-4869-a3ff-8dab7f3cc257', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:28:58.095119Z\"}}', NULL, '2026-08-08 00:28:58', '2026-08-08 00:28:58'),
('8c47cc5a-18c7-433b-98f4-d9515df30a32', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":22}}', NULL, '2026-08-06 06:28:46', '2026-08-06 06:28:46'),
('8d9c3d75-6672-44b1-9940-4a470453eaa4', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:30:25', '2026-08-14 07:30:25'),
('8f39bb3c-643c-4bc3-a0ef-b017f41ad1ed', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:59:50.524681Z\"}}', NULL, '2026-08-08 16:59:50', '2026-08-08 16:59:50'),
('90861662-5a76-4332-9ea1-3a70827b9156', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 02:54:13', '2026-08-14 02:54:13'),
('92d58d02-f567-424c-a773-9124be2726a9', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":9}}', NULL, '2026-08-05 03:36:56', '2026-08-05 03:36:56'),
('9371e161-4d5d-44e5-a9ca-cca25201192b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 05:35:55', '2026-08-09 05:35:55'),
('93ddf6cd-f74a-42a3-a34b-8a63f51cfe68', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:54:10.257605Z\"}}', NULL, '2026-08-08 16:54:10', '2026-08-08 16:54:10'),
('948b57a5-915f-4226-a8ae-5d8b876ac6bd', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-08 08:00:23', '2026-08-08 08:00:23'),
('94d0da21-3189-48f2-90fd-41118072d03e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":4}}', NULL, '2026-08-03 22:42:01', '2026-08-03 22:42:01'),
('94f69e96-bb96-4b52-9b6f-4c3abf6bdbcd', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-10 15:57:42', '2026-08-10 15:57:42'),
('9550681b-4371-4bf8-89f1-cb9584a90892', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T12:41:18.431188Z\"}}', NULL, '2026-08-06 04:41:18', '2026-08-06 04:41:18'),
('9562022b-a1eb-4f3a-b296-17217d326806', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:43:46', '2026-08-14 07:43:46'),
('9725537b-42da-4a58-bfdb-6917f271ed17', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":41}}', NULL, '2026-08-08 06:18:11', '2026-08-08 06:18:11'),
('973a38c1-0619-4712-8e08-9fc8e0753463', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 06:48:13', '2026-08-09 06:48:13'),
('9a7d3d1f-7110-4b36-9751-78520cf93df0', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:30:25', '2026-08-14 07:30:25'),
('9ae53d75-1787-4b02-8361-a5158c0f7d4a', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:37:52', '2026-08-08 16:37:52'),
('9b2ce0d1-5049-4541-b092-22e1e27d1a3e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-15 09:03:44', '2026-08-15 09:03:44'),
('9ba2e3d2-c622-401e-bd1c-ac864ddf01dc', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T13:35:46.436078Z\"}}', NULL, '2026-08-06 05:35:46', '2026-08-06 05:35:46'),
('9c77d5db-ae9b-49a5-8df0-827ba4a8143b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:47:10.742559Z\"}}', NULL, '2026-08-08 16:47:10', '2026-08-08 16:47:10'),
('9e129d5f-e603-4f8d-ab05-bbac5da6edbf', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:54:10.257605Z\"}}', NULL, '2026-08-08 16:54:10', '2026-08-08 16:54:10'),
('9f2232b1-828b-40e3-8488-5cf64f4e2c4e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T12:44:17.884013Z\"}}', NULL, '2026-08-08 04:44:17', '2026-08-08 04:44:17'),
('9f987a4e-3941-492f-b96c-eee4ca6b1ec6', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":37}}', NULL, '2026-08-08 04:43:38', '2026-08-08 04:43:38'),
('9fcdbd5a-2305-4254-949b-a4e8c6535f75', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":16}}', NULL, '2026-08-06 04:35:02', '2026-08-06 04:35:02'),
('a1a47e28-aa94-4231-9b0d-71195742b1fe', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 06:41:04', '2026-08-09 06:41:04'),
('a1d2d47a-a667-4725-b59a-dd2fbb62833b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T11:53:59.864129Z\"}}', NULL, '2026-08-06 03:53:59', '2026-08-06 03:53:59'),
('a2ac1b92-d673-4f8b-81d6-6201971503dc', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T17:01:21.720637Z\"}}', NULL, '2026-08-08 17:01:21', '2026-08-08 17:01:21'),
('a346a232-7311-4364-8974-1b0d85719ad6', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T07:13:27.059563Z\"}}', NULL, '2026-08-05 23:13:27', '2026-08-05 23:13:27'),
('a3bd530d-3ee5-4329-aa37-e3b088cfe8ae', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":4}}', NULL, '2026-08-03 22:42:01', '2026-08-03 22:42:01'),
('a40d5ed4-d074-4790-b24e-adfe27484d30', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-16T11:20:35.198831Z\"}}', NULL, '2026-08-16 11:20:35', '2026-08-16 11:20:35'),
('a4524b34-f497-47b8-8e40-69f19d0ec57c', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-09-09 16:38:01', '2026-09-09 16:38:01'),
('a534477f-4811-4471-b83f-19cc17367bbe', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 06:40:40', '2026-08-09 06:40:40'),
('a67aaa03-f7ed-49f9-86c1-829ca3ba5bcf', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":39}}', NULL, '2026-08-08 04:47:26', '2026-08-08 04:47:26'),
('a7315354-6b9b-44d0-8fa1-10833891fc71', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-04T09:26:35.413481Z\"}}', NULL, '2026-08-04 01:26:35', '2026-08-04 01:26:35'),
('a986e0ba-7bae-486c-af27-acf1db9c657b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:39:13', '2026-08-14 07:39:13'),
('a9f1394b-4791-4596-997c-0037a660e377', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T11:53:59.864129Z\"}}', NULL, '2026-08-06 03:53:59', '2026-08-06 03:53:59'),
('aa566e77-503b-4205-97c2-6b23de64c6a0', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:33:49', '2026-08-08 16:33:49'),
('aae16da5-a565-4092-b434-b8a0f5731869', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 07:43:32', '2026-08-09 07:43:32'),
('aae746b0-7029-4e31-8f66-157628d07709', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-15 09:03:44', '2026-08-15 09:03:44'),
('ab2231ae-348f-4790-bb94-5105975ec841', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-14\"}}', NULL, '2026-08-14 02:54:45', '2026-08-14 02:54:45'),
('ab2805c8-7425-43fa-b12a-f5da3ef606a4', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 06:41:04', '2026-08-09 06:41:04'),
('abe26812-e90c-4044-9624-6484af876375', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:58:54.980028Z\"}}', NULL, '2026-08-08 16:58:55', '2026-08-08 16:58:55'),
('ac447169-dd51-45a3-b874-b8d23a2a2865', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-18\"}}', NULL, '2026-08-18 04:44:42', '2026-08-18 04:44:42'),
('acb9e8c7-7c59-484d-9e62-290bd2d4f670', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T07:20:23.180246Z\"}}', NULL, '2026-08-09 07:20:23', '2026-08-09 07:20:23'),
('ace28070-c571-41ef-b85a-6f84315f2673', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T13:33:21.657318Z\"}}', NULL, '2026-08-06 05:33:21', '2026-08-06 05:33:21'),
('ad4a88ba-11cc-4274-9ade-5a16fcb096c3', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 06:40:40', '2026-08-09 06:40:40'),
('af269ca0-da80-49d2-80ef-214aa0512015', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":9}}', NULL, '2026-08-05 03:36:56', '2026-08-05 03:36:56'),
('af721605-e3f5-4a46-aaf0-0448b3b98ae8', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T17:03:50.584832Z\"}}', NULL, '2026-08-08 17:03:50', '2026-08-08 17:03:50'),
('b0ec3c33-8156-4673-9980-fb7a15c49b14', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":24}}', NULL, '2026-08-07 21:44:49', '2026-08-07 21:44:49'),
('b1414215-247a-4079-bd10-a1bc31092b5f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":24}}', NULL, '2026-08-07 21:44:49', '2026-08-07 21:44:49'),
('b271cca2-5770-4e2b-acd1-02ceef9e0184', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:58:54.980028Z\"}}', NULL, '2026-08-08 16:58:55', '2026-08-08 16:58:55'),
('b27466f5-9a54-4076-a3c8-949ac3f3d4f7', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":36}}', NULL, '2026-08-08 04:03:36', '2026-08-08 04:03:36'),
('b2840f7a-51e7-4b4d-8bbb-5e2739910ffb', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:39:13', '2026-08-14 07:39:13'),
('b39f0bdd-d411-4628-bebd-bae6279de09a', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":19}}', NULL, '2026-08-06 05:27:26', '2026-08-06 05:27:26'),
('b429dd78-5d42-4f88-a995-7059f1b1aa9c', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":22}}', NULL, '2026-08-06 06:28:46', '2026-08-06 06:28:46'),
('b4c79570-241c-4d08-84b0-b23559387717', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-08 08:00:23', '2026-08-08 08:00:23'),
('b4e82218-10ad-4891-b3da-86cb067a8a4f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T06:42:23.563454Z\"}}', NULL, '2026-08-09 06:42:23', '2026-08-09 06:42:23'),
('b7666256-765c-4925-8e2f-e56356b068c7', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-15T09:07:13.679791Z\"}}', NULL, '2026-08-15 09:07:13', '2026-08-15 09:07:13'),
('babebefe-729e-4004-ac34-c8d047b2d606', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:24:16', '2026-08-14 07:24:16'),
('bcb3a8d9-39a6-4156-bab1-c848a948e845', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:30:25', '2026-08-14 07:30:25'),
('bd814dbf-fc2d-430b-a139-a82e1b2c419f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-08 17:07:17', '2026-08-08 17:07:17'),
('bf4ecc19-4a3b-4a77-a23d-3cb388fb9bd0', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-09 05:33:15', '2026-08-09 05:33:15'),
('c1fd6345-c0d1-4d32-ad8d-e86e768ef1ed', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:37:52', '2026-08-08 16:37:52'),
('c318f0bb-d63c-4fc0-a09d-467791812cbf', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T14:31:59.108270Z\"}}', NULL, '2026-08-06 06:31:59', '2026-08-06 06:31:59'),
('c52e6680-dff5-4539-9c58-5b4e4c1d2ce9', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T12:44:17.884013Z\"}}', NULL, '2026-08-08 04:44:17', '2026-08-08 04:44:17'),
('c66e7efd-4b7e-47db-bb22-23ab501da451', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":37}}', NULL, '2026-08-08 04:43:38', '2026-08-08 04:43:38'),
('c8a70dee-204b-4752-8d5d-306b2e926092', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:43:59', '2026-08-14 07:43:59'),
('c96f25de-7d1d-423a-8ac7-4c0a5ee1951e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-07-31\"}}', NULL, '2026-08-14 07:29:34', '2026-08-14 07:29:34'),
('c9f2269a-05eb-43d5-8642-82af8ff67eda', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-10 15:17:40', '2026-08-10 15:17:40'),
('ca8e9805-4ab8-450d-848c-ce2871770c6a', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-08\"}}', NULL, '2026-08-08 08:04:48', '2026-08-08 08:04:48'),
('cae31292-1f05-4980-a63e-c2426ab4a80b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":25}}', NULL, '2026-08-07 22:12:34', '2026-08-07 22:12:34'),
('cb59a3a5-0ca3-4713-9a2f-61a9b3849e7f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-09-09T16:40:28.767201Z\"}}', NULL, '2026-09-09 16:40:28', '2026-09-09 16:40:28'),
('cbbaa4a8-9549-48d5-af01-0f1d0516146d', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":41}}', NULL, '2026-08-08 06:18:11', '2026-08-08 06:18:11'),
('cc13d9c0-7ae3-422c-8e99-45e52218a119', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:53:25.437439Z\"}}', NULL, '2026-08-08 16:53:25', '2026-08-08 16:53:25'),
('cc19fcf9-a69a-4142-a3fb-f7676da5f910', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 06:48:26', '2026-08-09 06:48:26'),
('d261e966-38f2-4232-a173-d63379d45017', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-08 17:07:17', '2026-08-08 17:07:17'),
('d45e9f2b-1fc0-4a2d-a57b-b644894ed81f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T17:03:50.584832Z\"}}', NULL, '2026-08-08 17:03:50', '2026-08-08 17:03:50'),
('d4683a27-84b5-4cad-adb2-b8a6f1d67af9', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T06:14:24.929615Z\"}}', NULL, '2026-08-05 22:14:24', '2026-08-05 22:14:24'),
('d4ed782a-6507-450c-aba4-d4a20a458fe0', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:24:16', '2026-08-14 07:24:16'),
('d4fcac1f-ca10-4d8a-af44-fa6b04681bb3', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:53:25.437439Z\"}}', NULL, '2026-08-08 16:53:25', '2026-08-08 16:53:25'),
('d5bd0c33-2458-4435-9216-3bb8ca943751', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 05:42:59', '2026-08-09 05:42:59'),
('d8779845-438b-4571-8fa0-26275a676993', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-16T11:20:35.198831Z\"}}', NULL, '2026-08-16 11:20:35', '2026-08-16 11:20:35'),
('d8c36069-29d0-41c8-96cc-60ad9ffcac7c', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T06:43:51.932855Z\"}}', NULL, '2026-08-09 06:43:51', '2026-08-09 06:43:51'),
('d8ece14d-e8af-4ff7-98cd-db54fa576310', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T11:53:59.864129Z\"}}', NULL, '2026-08-06 03:53:59', '2026-08-06 03:53:59'),
('da8e51a8-1a12-49ee-b7f8-8c8e03349c23', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T06:12:23.055890Z\"}}', NULL, '2026-08-05 22:12:23', '2026-08-05 22:12:23'),
('db248bc5-587f-40b4-b5bc-f7fb2bb0a12b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T17:08:43.440189Z\"}}', NULL, '2026-08-08 17:08:43', '2026-08-08 17:08:43'),
('db254b07-c96e-4f75-b6e4-7775ffc73a00', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T06:14:24.929615Z\"}}', NULL, '2026-08-05 22:14:24', '2026-08-05 22:14:24'),
('db8394fa-ebff-4e89-a5a9-55aaabeb10ed', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-10 15:57:42', '2026-08-10 15:57:42'),
('db850934-fbb2-4e12-a956-0177b3fbf6f2', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T17:01:21.720637Z\"}}', NULL, '2026-08-08 17:01:21', '2026-08-08 17:01:21'),
('dbff9639-7f91-4d49-a8a4-401baf95a5c3', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-13\"}}', NULL, '2026-08-13 02:26:18', '2026-08-13 02:26:18'),
('dc1bbefa-5006-45da-84a7-c8efefa15495', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:28:58.095119Z\"}}', NULL, '2026-08-08 00:28:58', '2026-08-08 00:28:58'),
('dcd59fa8-37f4-4125-bc56-32169dbc8556', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-09-09T16:40:28.767201Z\"}}', NULL, '2026-09-09 16:40:28', '2026-09-09 16:40:28'),
('dd29bf48-5bfc-4c97-9234-5468b71e7e36', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":22}}', NULL, '2026-08-06 06:28:46', '2026-08-06 06:28:46'),
('de54a3c7-d50a-4964-8710-96d5077c199b', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 07:37:45', '2026-08-09 07:37:45'),
('decc975d-cb99-45c2-9169-487efcd4d932', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 07:37:45', '2026-08-09 07:37:45'),
('df477fd8-24f4-47c9-b97b-5ade7762fb91', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":27}}', NULL, '2026-08-07 22:26:30', '2026-08-07 22:26:30'),
('e0084039-a72d-4826-b876-f0d5cb0eb7df', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T06:42:23.563454Z\"}}', NULL, '2026-08-09 06:42:23', '2026-08-09 06:42:23'),
('e05e74bc-f0a5-4d20-858a-1120c1b333a6', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-03T17:49:02.730620Z\"}}', NULL, '2026-08-03 09:49:02', '2026-08-03 09:49:02'),
('e065aa1d-ec29-4aa8-87ab-8d14abdd67b0', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:47:10.742559Z\"}}', NULL, '2026-08-08 16:47:10', '2026-08-08 16:47:10'),
('e22e11d7-373d-4714-9604-61ca36f8bdc9', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-14 07:24:16', '2026-08-14 07:24:16'),
('e353d14f-e3aa-4981-968d-651b91205338', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":31}}', NULL, '2026-08-08 00:37:32', '2026-08-08 00:37:32'),
('e53c41ee-91c5-4162-9bfc-6db039b5f484', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":27}}', NULL, '2026-08-07 22:26:30', '2026-08-07 22:26:30'),
('e6a3240e-b10b-42ee-a6e2-0969526cd799', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:44:48', '2026-08-08 16:44:48'),
('e7dd507d-d8fa-409b-a96f-a40caef650b3', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":40}}', NULL, '2026-08-08 04:51:09', '2026-08-08 04:51:09'),
('e85db877-55eb-417a-8ce7-11c9e465b018', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T06:14:24.929615Z\"}}', NULL, '2026-08-05 22:14:24', '2026-08-05 22:14:24'),
('ea368a1b-a21e-46f5-95e7-b4d8757fd8d7', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T12:41:18.431188Z\"}}', NULL, '2026-08-06 04:41:18', '2026-08-06 04:41:18'),
('eafb65bc-2f1a-4e63-a7e0-eee2281e4188', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":39}}', NULL, '2026-08-08 04:47:26', '2026-08-08 04:47:26'),
('ec761306-6d0c-40f5-b2b0-f2aa37bab4da', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T07:20:23.180246Z\"}}', NULL, '2026-08-09 07:20:23', '2026-08-09 07:20:23'),
('eca048dc-241e-402e-aae7-4b91391fb200', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:39:14.007804Z\"}}', NULL, '2026-08-08 00:39:14', '2026-08-08 00:39:14'),
('ee3fd088-bcd8-415d-9d5a-c54d7737ba52', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:27:27.577707Z\"}}', NULL, '2026-08-08 00:27:27', '2026-08-08 00:27:27'),
('ee62e1a6-b516-4f94-92db-cfce645d34bb', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:33:49', '2026-08-08 16:33:49'),
('ee92db1b-c6a4-4c2f-b7b6-8792a7952627', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 07:43:32', '2026-08-09 07:43:32'),
('efafcd44-f302-482c-b6de-00104965b02d', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:42:45.374481Z\"}}', NULL, '2026-08-08 00:42:45', '2026-08-08 00:42:45'),
('f007d91e-d995-4f9e-b7b7-989c93a41d9f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":17}}', NULL, '2026-08-06 04:36:12', '2026-08-06 04:36:12'),
('f00b1a73-f84a-4603-8309-ba80973d55c7', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-08\"}}', NULL, '2026-08-08 16:42:32', '2026-08-08 16:42:32'),
('f05696ae-944b-4176-9086-6d26a0a8ac50', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T06:37:08.973213Z\"}}', NULL, '2026-08-05 22:37:09', '2026-08-05 22:37:09'),
('f0738767-882d-44a7-aace-bf524ba0db33', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-04\"}}', NULL, '2026-08-16 11:15:50', '2026-08-16 11:15:50'),
('f088860e-6367-4b4c-b842-4e4d0d24b0d4', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 06:40:40', '2026-08-09 06:40:40'),
('f28dcb5c-bfdf-4013-843c-71510322eec4', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T16:54:10.257605Z\"}}', NULL, '2026-08-08 16:54:10', '2026-08-08 16:54:10'),
('f2b37333-bcb4-48b1-9866-6f4b3d2989c2', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-09 05:35:55', '2026-08-09 05:35:55'),
('f2f91d82-347b-4076-9b27-1b78e4e389ee', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 05:42:59', '2026-08-09 05:42:59'),
('f3d51d1f-cafc-4565-8e0d-5cff6cac019f', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":34}}', NULL, '2026-08-08 00:41:46', '2026-08-08 00:41:46'),
('f3e996e2-437a-4938-b847-94e1627ab335', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kirk Shien.\",\"metadata\":{\"reading_date\":\"2026-08-13\"}}', NULL, '2026-08-13 02:26:18', '2026-08-13 02:26:18'),
('f46135b2-68d6-4e79-8510-a62e5bb4933d', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-08T08:42:45.374481Z\"}}', NULL, '2026-08-08 00:42:45', '2026-08-08 00:42:45'),
('f46820a8-20d9-46a1-993e-aefc406d912e', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 06:41:04', '2026-08-09 06:41:04'),
('f4b8cae1-6d1b-4854-ad5f-b5a8dd123bbc', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-08-08 16:36:09', '2026-08-08 16:36:09'),
('f4ebde50-c230-4d2b-a940-833623bf2635', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-09 07:19:46', '2026-08-09 07:19:46'),
('f61df2b2-8df6-4585-b87f-a2450c3f2046', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-10T16:45:55.974394Z\"}}', NULL, '2026-08-10 16:45:56', '2026-08-10 16:45:56'),
('f6b05c34-814d-4694-b67b-561792658ac6', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"Batch Bills Generated\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-06T12:18:59.412648Z\"}}', NULL, '2026-08-06 04:18:59', '2026-08-06 04:18:59'),
('f6fdd878-314e-453e-a651-513d43bb0182', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":33}}', NULL, '2026-08-08 00:41:15', '2026-08-08 00:41:15'),
('f805a1e4-7509-4825-8e4c-b2ba454a2de0', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-01\"}}', NULL, '2026-09-09 16:38:01', '2026-09-09 16:38:01');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('fa333f0f-fa33-45eb-b599-cf94bf3c05fc', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 46, '{\"type\":\"billing\",\"title\":\"New Bill Generated\",\"message\":\"A manual reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"bill_id\":24}}', NULL, '2026-08-07 21:44:49', '2026-08-07 21:44:49'),
('fbb157a1-2cd1-4eab-9b76-7c16ab1816c3', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"Batch Meter Readings Imported\",\"message\":\"A batch of meter readings has been imported successfully.\",\"metadata\":{\"import_date\":\"2026-08-09T06:42:23.563454Z\"}}', NULL, '2026-08-09 06:42:23', '2026-08-09 06:42:23'),
('fd939ad7-7d3f-4065-8e1a-f4d0e8c5004a', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-02\"}}', NULL, '2026-08-10 16:24:40', '2026-08-10 16:24:40'),
('fe393bf0-d916-4bb3-a17d-3ce273512406', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 44, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:44:48', '2026-08-08 16:44:48'),
('ff8cacf9-8e11-4c65-ac49-98e462b986af', 'App\\Notifications\\AdminNotification', 'App\\Models\\User', 45, '{\"type\":\"billing\",\"title\":\"New Meter Reading Recorded\",\"message\":\"A meter reading was recorded for Kurt Shiedrick.\",\"metadata\":{\"reading_date\":\"2026-08-09\"}}', NULL, '2026-08-08 16:44:48', '2026-08-08 16:44:48');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint UNSIGNED NOT NULL,
  `customer_id` bigint UNSIGNED NOT NULL,
  `bill_id` bigint UNSIGNED NOT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` enum('gcash','paymaya','cash') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `checkout_url` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','paid','failed','pending_cash') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `push_subscriptions`
--

CREATE TABLE `push_subscriptions` (
  `id` bigint UNSIGNED NOT NULL,
  `subscribable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscribable_id` bigint UNSIGNED NOT NULL,
  `endpoint` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `public_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content_encoding` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('2Fl1TAGubX4GyOc8oujXg8ri5QAgvybUDx4kcRgg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOXprSHJWRXZPVHk2QjNKdmpZUThYdHFzMjQxRmk0N0ptNE9JZ3VWdyI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czo2MjoiaHR0cDovL3Nhbl9hbnRvbmlvX3dhdGVyX3N5c3RlbV9hc3NvY2lhdGlvbi50ZXN0L2FkbWluL3JlcG9ydHMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1794638244),
('4Zy1c0T8JV3XvE7TrabkwMKMaFios6YWAnOFf5p8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMXFhRDFRZTg0Mm9PYldwUTVwN0k5bGVST1JmblRlNWxwUHVDUVQ4SyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjY6Imh0dHA6Ly9zYW5fYW50b25pb193YXRlcl9zeXN0ZW1fYXNzb2NpYXRpb24udGVzdC9hcGkvYW5ub3VuY2VtZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794382902),
('ojn1G1V6zBuMU8FeG6FjOTq426jphO46asaOjYnM', 44, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiSVNuWEt2Nkp3MzB6TnZpVDBaRTVBdG1GZHJZc2dyTkNucjVQZTVCciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzI6Imh0dHA6Ly9zYW5fYW50b25pb193YXRlcl9zeXN0ZW1fYXNzb2NpYXRpb24udGVzdC9hcGkvYWRtaW4vbm90aWZpY2F0aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6NDQ7fQ==', 1794638247),
('TfloGjtU30hMCYOOTcXaR2FsbV6T2N165abx8TUE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUU9maFVvYnFhNkN0QmtLUm85dmFjU1FhTHlNdnU4TVdRek1TVUVJTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjY6Imh0dHA6Ly9zYW5fYW50b25pb193YXRlcl9zeXN0ZW1fYXNzb2NpYXRpb24udGVzdC9hcGkvYW5ub3VuY2VtZW50cyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794368302);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fcm_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','staff','customer') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `position` enum('administrator','encoder','meter_reader') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `address`, `phone`, `balance`, `email`, `email_verified_at`, `password`, `fcm_token`, `role`, `position`, `remember_token`, `created_at`, `updated_at`) VALUES
(44, NULL, NULL, 'admin', NULL, NULL, 0.00, NULL, NULL, '$2y$12$WPNg27uJdOpDggJF1YsM..8wO/HaNrDnke52Wc7wJBg3ssLtuV6/i', NULL, 'admin', 'administrator', 'sW86LjxIqIs8Jma7BaE64ZtRcA5IPQTdE9mcc50SM04NQYQTWMxBKjIZfjIf', '2026-06-14 07:28:37', '2026-06-14 07:28:37'),
(45, NULL, NULL, 'staff', NULL, NULL, 0.00, NULL, NULL, '$2y$12$99wam7l90KhxtUgZQYSX/..jfUehyBm356Zd8vg46vN9cepkyQ0/m', NULL, 'staff', 'encoder', '0GSaIRFzwLke5bWLLTM5FmN5gxsiMVBtL44JSBn5FYZeLsBwD3jyFnDr5yy4', '2026-06-14 07:28:37', '2026-06-14 07:28:37'),
(46, NULL, NULL, 'butoy', NULL, NULL, 0.00, NULL, NULL, '$2y$12$jN5gFXU.ZzL0WRV3ESF2XO39VGDw7OFWXXPCc8pA0Rgmi8MgFqk1.', NULL, 'staff', 'meter_reader', NULL, '2026-08-03 06:31:37', '2026-08-03 06:31:37');

-- --------------------------------------------------------

--
-- Table structure for table `water_rates`
--

CREATE TABLE `water_rates` (
  `id` bigint UNSIGNED NOT NULL,
  `base_rate` decimal(10,2) NOT NULL DEFAULT '200.00',
  `rate_per_cubic_meter` decimal(10,2) NOT NULL DEFAULT '15.00',
  `penalty_amount` decimal(10,2) NOT NULL DEFAULT '50.00',
  `billing_cycle_day` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `barangay_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Barangay San Antonio',
  `barangay_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'San Antonio, Philippines',
  `contact_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'N/A',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `water_rates`
--

INSERT INTO `water_rates` (`id`, `base_rate`, `rate_per_cubic_meter`, `penalty_amount`, `billing_cycle_day`, `barangay_name`, `barangay_address`, `contact_number`, `created_at`, `updated_at`) VALUES
(1, 200.00, 15.00, 50.00, 1, 'Barangay San Antonio', 'San Antonio, Philippines', '09000000000', '2026-05-09 01:00:34', '2026-05-09 01:00:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcements_posted_by_foreign` (`posted_by`);

--
-- Indexes for table `announcement_views`
--
ALTER TABLE `announcement_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcement_views_announcement_id_foreign` (`announcement_id`),
  ADD KEY `announcement_views_user_id_foreign` (`user_id`);

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bills_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customers_meter_number_unique` (`meter_number`),
  ADD KEY `customers_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `meter_readings`
--
ALTER TABLE `meter_readings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `meter_readings_customer_id_reading_date_unique` (`customer_id`,`reading_date`),
  ADD KEY `meter_readings_meter_reader_id_foreign` (`meter_reader_id`),
  ADD KEY `meter_readings_recorded_by_user_id_foreign` (`recorded_by_user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_bill_id_foreign` (`bill_id`),
  ADD KEY `payments_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `push_subscriptions_endpoint_unique` (`endpoint`),
  ADD KEY `push_subscriptions_subscribable_morph_idx` (`subscribable_type`,`subscribable_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_unique` (`phone`);

--
-- Indexes for table `water_rates`
--
ALTER TABLE `water_rates`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcement_views`
--
ALTER TABLE `announcement_views`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meter_readings`
--
ALTER TABLE `meter_readings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `water_rates`
--
ALTER TABLE `water_rates`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_posted_by_foreign` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcement_views`
--
ALTER TABLE `announcement_views`
  ADD CONSTRAINT `announcement_views_announcement_id_foreign` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `announcement_views_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `meter_readings`
--
ALTER TABLE `meter_readings`
  ADD CONSTRAINT `meter_readings_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meter_readings_meter_reader_id_foreign` FOREIGN KEY (`meter_reader_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `meter_readings_recorded_by_user_id_foreign` FOREIGN KEY (`recorded_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_bill_id_foreign` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
