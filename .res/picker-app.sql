# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.17)
# Database: picker_resume
# Generation Time: 2017-04-08 14:05:19 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



# Dump of table picker_options
# ------------------------------------------------------------

DROP TABLE IF EXISTS `picker_options`;

CREATE TABLE `picker_options` (
  `key` varchar(255) DEFAULT '',
  `value` json DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `picker_options` (`key`, value, `desc`) VALUES ('_user_roles', '[{"administrator": {"name": "Administrator", "capabilities": [{"switch_themes": true}, {"edit_themes": true}, {"activate_plugins": true}, {"edit_plugins": true}, {"edit_users": true}, {"edit_files": true}, {"manage_options": true}, {"moderate_comments": true}, {"manage_categories": true}, {"manage_links": true}, {"upload_files": true}, {"import": true}, {"edit_posts": true}, {"edit_others_posts": true}, {"edit_published_posts": true}, {"edit_pages": true}, {"edit_other_pages": true}, {"edit_published_pages": true}, {"publish_pages": true}, {"delete_pages": true}, {"delete_others_pages": true}, {"delete_published_pages": true}, {"delete_posts": true}, {"delete_others_posts": true}, {"delete_published_posts": true}, {"delete_private_posts": true}, {"edit_private_posts": true}, {"read_private_posts": true}, {"delete_private_pages": true}, {"edit_private_pages": true}, {"read_private_pages": true}, {"delete_users": true}, {"create_users": true}, {"unfiltered_upload": true}, {"edit_dashboard": true}, {"update_plugins": true}, {"delete_plugins": true}, {"install_plugins": true}, {"update_themes": true}, {"install_themes": true}, {"update_core": true}, {"list_users": true}, {"remove_users": true}, {"add_users": true}, {"promote_users": true}, {"edit_theme_options": true}, {"delete_themes": true}, {"export": true}]}}, {"contributor": {"name": "Contributor", "capabilities": [{"delete_pages": true}, {"delete_others_pages": true}, {"delete_published_pages": true}, {"delete_posts": true}]}}, {"editor": {"name": "Editor", "capabilities": [{"read": true}, {"moderate_comments": true}, {"manage_categories": true}, {"manage_links": true}, {"upload_files": true}, {"unfiltered_html": true}, {"edit_posts": true}, {"edit_others_posts": true}, {"edit_published_posts": true}, {"publish_posts": true}, {"edit_pages": true}, {"edit_others_pages": true}, {"edit_published_pages": true}, {"publish_pages": true}, {"delete_pages": true}, {"delete_others_pages": true}, {"delete_published_pages": true}, {"delete_posts": true}, {"delete_others_posts": true}, {"delete_published_posts": true}, {"delete_private_posts": true}, {"edit_private_posts": true}, {"read_private_posts": true}, {"delete_private_pages": true}, {"edit_private_pages": true}, {"read_private_pages": true}]}}, {"author": {"name": "Author", "capabilities": [{"read": true}, {"upload_files": true}, {"edit_posts": true}, {"edit_published_posts": true}, {"publish_posts": true}, {"delete_posts": true}, {"delete_published_posts": true}]}}, {"subscriber": {"name": "Subscriber", "capabilities": [{"read": true}]}}]', '用户角权与权限');

# Dump of table picker_postmeta
# ------------------------------------------------------------

DROP TABLE IF EXISTS `picker_postmeta`;

CREATE TABLE `picker_postmeta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `meta_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_value` json DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `post_id` (`post_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


# Dump of table picker_posts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `picker_posts`;

CREATE TABLE `picker_posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author` int(10) unsigned NOT NULL,
  `status` varchar(20) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'publish',
  `password` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `guid` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `excerpt` text COLLATE utf8_unicode_ci,
  `allow_comment` tinyint(11) NOT NULL DEFAULT '1',
  `date` bigint(13) unsigned NOT NULL DEFAULT '0',
  `modified` bigint(13) unsigned NOT NULL DEFAULT '0',
  `comment_num` int(11) NOT NULL DEFAULT '0',
  `menu_order` int(11) NOT NULL DEFAULT '0',
  `type` varchar(20) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'article',
  `mime_type` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `parent` bigint(20) NOT NULL DEFAULT '0',
  `content_json` json DEFAULT NULL,
  `content` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


# Dump of table picker_term_relationships
# ------------------------------------------------------------

DROP TABLE IF EXISTS `picker_term_relationships`;

CREATE TABLE `picker_term_relationships` (
  `object_id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `term_taxonomy_id` bigint(20) unsigned NOT NULL DEFAULT '1',
  `term_order` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`object_id`,`term_taxonomy_id`),
  KEY `term_taxonomy_id` (`term_taxonomy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

# Dump of table picker_term_taxonomy
# ------------------------------------------------------------

DROP TABLE IF EXISTS `picker_term_taxonomy`;

CREATE TABLE `picker_term_taxonomy` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `term_id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `taxonomy` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent` bigint(20) unsigned NOT NULL DEFAULT '0',
  `count` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `term_id_taxonomy` (`term_id`,`taxonomy`),
  KEY `taxonomy` (`taxonomy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


# Dump of table picker_termmeta
# ------------------------------------------------------------

DROP TABLE IF EXISTS `picker_termmeta`;

CREATE TABLE `picker_termmeta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `term_id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `meta_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_value` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`meta_id`),
  KEY `term_id` (`term_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `picker_termmeta` WRITE;
/*!40000 ALTER TABLE `picker_termmeta` DISABLE KEYS */;


# Dump of table picker_terms
# ------------------------------------------------------------

DROP TABLE IF EXISTS `picker_terms`;

CREATE TABLE `picker_terms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `group` bigint(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `slug` (`slug`(191)),
  KEY `name` (`name`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;




