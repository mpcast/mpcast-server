# ************************************************************
# PICKER SQL
# Version 1.0
#
# https://www.caixie.top/
#
# Host: 127.0.0.1 (MySQL 5.8)
# Database: picker_master
# Time: 2018-02-02
# ************************************************************

# 评论元数据表
# ------------------------------------------------------------
CREATE TABLE `picker_commentmeta` (
  `meta_id`    BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `comment_id` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
  `meta_key`   VARCHAR(255)                 DEFAULT NULL,
  `meta_value` LONGTEXT,
  PRIMARY KEY (`meta_id`),
  KEY `comment_id` (`comment_id`),
  KEY `meta_key` (`meta_key`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

# 评论表
# ------------------------------------------------------------
CREATE TABLE `picker_comments` (
  `id`                   BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `comment_post_id`      BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
  `comment_author`       TINYTEXT            NOT NULL,
  `comment_author_email` VARCHAR(100)        NOT NULL DEFAULT '',
  `comment_author_url`   VARCHAR(200)        NOT NULL DEFAULT '',
  `comment_author_ip`    VARCHAR(100)        NOT NULL DEFAULT '',
  `comment_date`         BIGINT(13)          NOT NULL DEFAULT '0',
  `comment_content`      TEXT                NOT NULL,
  `comment_karma`        INT(11)             NOT NULL DEFAULT '0',
  `comment_approved`     VARCHAR(20)         NOT NULL DEFAULT '1',
  `comment_agent`        VARCHAR(255)        NOT NULL DEFAULT '',
  `comment_type`         VARCHAR(20)         NOT NULL DEFAULT '',
  `comment_parent`       BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
  `user_id`              BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `comment_post_ID` (`comment_post_id`),
  KEY `comment_parent` (`comment_parent`),
  KEY `comment_author_email` (`comment_author_email`(10))
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

# 系统配置表
# ------------------------------------------------------------
CREATE TABLE `picker_options` (
  `key`   VARCHAR(255) NOT NULL DEFAULT '',
  `value` JSON                  DEFAULT NULL,
  `desc`  VARCHAR(255)          DEFAULT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `key` (`key`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
# -- 初始化权限数据
INSERT INTO `picker_options` (`key`, value, `desc`) VALUES ('_user_roles', '[
  {
    "administrator": {
      "name": "Administrator",
      "capabilities": [
        {
          "switch_themes": true
        },
        {
          "edit_themes": true
        },
        {
          "activate_plugins": true
        },
        {
          "edit_plugins": true
        },
        {
          "edit_users": true
        },
        {
          "edit_files": true
        },
        {
          "manage_options": true
        },
        {
          "moderate_comments": true
        },
        {
          "manage_categories": true
        },
        {
          "manage_links": true
        },
        {
          "upload_files": true
        },
        {
          "import": true
        },
        {
          "edit_posts": true
        },
        {
          "edit_others_posts": true
        },
        {
          "edit_published_posts": true
        },
        {
          "edit_pages": true
        },
        {
          "edit_other_pages": true
        },
        {
          "edit_published_pages": true
        },
        {
          "publish_pages": true
        },
        {
          "delete_pages": true
        },
        {
          "delete_others_pages": true
        },
        {
          "delete_published_pages": true
        },
        {
          "delete_posts": true
        },
        {
          "delete_others_posts": true
        },
        {
          "delete_published_posts": true
        },
        {
          "delete_private_posts": true
        },
        {
          "edit_private_posts": true
        },
        {
          "read_private_posts": true
        },
        {
          "delete_private_pages": true
        },
        {
          "edit_private_pages": true
        },
        {
          "read_private_pages": true
        },
        {
          "delete_users": true
        },
        {
          "create_users": true
        },
        {
          "unfiltered_upload": true
        },
        {
          "edit_dashboard": true
        },
        {
          "update_plugins": true
        },
        {
          "delete_plugins": true
        },
        {
          "install_plugins": true
        },
        {
          "update_themes": true
        },
        {
          "install_themes": true
        },
        {
          "update_core": true
        },
        {
          "list_users": true
        },
        {
          "remove_users": true
        },
        {
          "add_users": true
        },
        {
          "promote_users": true
        },
        {
          "edit_theme_options": true
        },
        {
          "delete_themes": true
        },
        {
          "export": true
        }
      ]
    }
  },
  {
    "contributor": {
      "name": "Contributor",
      "capabilities": [
        {
          "delete_pages": true
        },
        {
          "delete_others_pages": true
        },
        {
          "delete_published_pages": true
        },
        {
          "delete_posts": true
        }
      ]
    }
  },
  {
    "editor": {
      "name": "Editor",
      "capabilities": [
        {
          "read": true
        },
        {
          "moderate_comments": true
        },
        {
          "manage_categories": true
        },
        {
          "manage_links": true
        },
        {
          "upload_files": true
        },
        {
          "unfiltered_html": true
        },
        {
          "edit_posts": true
        },
        {
          "edit_others_posts": true
        },
        {
          "edit_published_posts": true
        },
        {
          "publish_posts": true
        },
        {
          "edit_pages": true
        },
        {
          "edit_others_pages": true
        },
        {
          "edit_published_pages": true
        },
        {
          "publish_pages": true
        },
        {
          "delete_pages": true
        },
        {
          "delete_others_pages": true
        },
        {
          "delete_published_pages": true
        },
        {
          "delete_posts": true
        },
        {
          "delete_others_posts": true
        },
        {
          "delete_published_posts": true
        },
        {
          "delete_private_posts": true
        },
        {
          "edit_private_posts": true
        },
        {
          "read_private_posts": true
        },
        {
          "delete_private_pages": true
        },
        {
          "edit_private_pages": true
        },
        {
          "read_private_pages": true
        }
      ]
    }
  },
  {
    "author": {
      "name": "Author",
      "capabilities": [
        {
          "read": true
        },
        {
          "upload_files": true
        },
        {
          "edit_posts": true
        },
        {
          "edit_published_posts": true
        },
        {
          "publish_posts": true
        },
        {
          "delete_posts": true
        },
        {
          "delete_published_posts": true
        }
      ]
    }
  },
  {
    "subscriber": {
      "name": "Subscriber",
      "capabilities": [
        {
          "read": true
        }
      ]
    }
  }
]', '用户角权与权限');

# POST 元数据表
# ------------------------------------------------------------
CREATE TABLE `picker_postmeta` (
  `meta_id`    BIGINT(20) UNSIGNED NOT NULL            AUTO_INCREMENT,
  `post_id`    BIGINT(20) UNSIGNED NOT NULL            DEFAULT '0',
  `meta_key`   VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_value` JSON                                    DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `post_id` (`post_id`),
  KEY `meta_key` (`meta_key`(191))
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

# POST 内容表
# ------------------------------------------------------------
CREATE TABLE `picker_posts` (
  `id`            INT(10) UNSIGNED    NOT NULL AUTO_INCREMENT,
  `author`        INT(10) UNSIGNED    NOT NULL,
  `status`        VARCHAR(20)         NOT NULL DEFAULT 'publish'
  COMMENT 'status of the post, e.g. ‘draft’, ‘pending’, ‘private’, ‘publish’.',
  `password`      VARCHAR(32)         NOT NULL DEFAULT '',
  `title`         VARCHAR(255)        NOT NULL DEFAULT '',
  `name`          VARCHAR(255)        NOT NULL DEFAULT '',
  `to_ping`       TEXT,
  `pinged`        TEXT,
  `guid`          VARCHAR(255)        NOT NULL DEFAULT '',
  `excerpt`       MEDIUMTEXT,
  `allow_comment` TINYINT(11)         NOT NULL DEFAULT '1',
  `date`          BIGINT(13) UNSIGNED NOT NULL DEFAULT '0',
  `modified`      BIGINT(13) UNSIGNED NOT NULL DEFAULT '0',
  `comment_count` INT(11)             NOT NULL DEFAULT '0',
  `menu_order`    INT(11)             NOT NULL DEFAULT '0',
  `type`          VARCHAR(20)         NOT NULL DEFAULT 'post',
  `mime_type`     VARCHAR(100)        NOT NULL DEFAULT '',
  `parent`        BIGINT(20)          NOT NULL DEFAULT '0',
  `content_json`  JSON                         DEFAULT NULL,
  `content`       LONGTEXT,
  `sort`          INT(11)             NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `post_author` (`author`),
  KEY `post_name` (`name`),
  KEY `type_status_date` (`type`, `status`, `date`, `id`),
  KEY `post_parent` (`parent`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

# 类别内容关系表
# ------------------------------------------------------------
CREATE TABLE `picker_term_relationships` (
  `object_id`        BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
  `term_taxonomy_id` BIGINT(20) UNSIGNED NOT NULL DEFAULT '1',
  `term_order`       INT(11)             NOT NULL DEFAULT '0',
  PRIMARY KEY (`object_id`, `term_taxonomy_id`),
  KEY `term_taxonomy_id` (`term_taxonomy_id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

# 分类方法关系表
# ------------------------------------------------------------
CREATE TABLE `picker_term_taxonomy` (
  `id`          BIGINT(20) UNSIGNED                    NOT NULL AUTO_INCREMENT,
  `term_id`     BIGINT(20) UNSIGNED                    NOT NULL DEFAULT '0',
  `taxonomy`    VARCHAR(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `description` LONGTEXT COLLATE utf8mb4_unicode_ci    NOT NULL,
  `parent`      BIGINT(20) UNSIGNED                    NOT NULL DEFAULT '0',
  `count`       BIGINT(20)                             NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `term_id_taxonomy` (`term_id`, `taxonomy`),
  KEY `taxonomy` (`taxonomy`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

# 分类元数据表
# ------------------------------------------------------------
CREATE TABLE `picker_termmeta` (
  `meta_id`    BIGINT(20) UNSIGNED NOT NULL            AUTO_INCREMENT,
  `term_id`    BIGINT(20) UNSIGNED NOT NULL            DEFAULT '0',
  `meta_key`   VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_value` LONGTEXT COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`meta_id`),
  KEY `term_id` (`term_id`),
  KEY `meta_key` (`meta_key`(191))
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

# 分类表
# ------------------------------------------------------------
CREATE TABLE `picker_terms` (
  `id`    BIGINT(20) UNSIGNED                     NOT NULL AUTO_INCREMENT,
  `name`  VARCHAR(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `slug`  VARCHAR(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `group` BIGINT(10)                              NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `slug` (`slug`(191)),
  KEY `name` (`name`(191))
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;