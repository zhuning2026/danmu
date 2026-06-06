---
title: Z-blog官方安装教程
tags: [zblog 教程 安装]
excerpt: 博客程序Zblog安装教程..
categories:
index_img: /img/79.jpg
banner_img: /img/79.jpg
date: 2026-05-25 16:00:00
---

## 下载安装

### 环境要求

PHP：PHP 7.2 - 8.5

数据库：MySQL（兼容 MariaDB） SQLite PostgreSQL

## 下载地址

下载入口页：https://www.zblogcn.com/zblogphp/ 下面方式都可以选择，不懂的可以提供支持

* [Z-BlogPHP 1.7 Tenet](https://update.zblogcn.com/zip/Z-BlogPHP_1_7_5_3540_Optimus.zip)（最新版本直链下载）
* 单文件在线安装程序
* 宝塔面板一键部署
* [阿里云一键部署](https://aliyun.com)（基于 Serverless 架构）

## 安装

* 1.将下载后的程序代码解压到你的网站根目录，如/home/wwwroot/example.com/，运行你的网站，会自动跳转到安装页面：http://example.com/zb_install/index.php。

* 2.在安装页面输入您的数据库信息、博客名称、用户名、密码等信息后程序将会自动安装。

## 升级

* 「后台管理」→ 应用中心 → 系统更新与校验 → 升级新版程序；

  * 当新版本发布时会出现升级新版程序按钮；

  * 「后台管理」→ 应用中心 → 设置 → 开启检查 Beta 版程序选项，可以获取到 Beta 版更新推送；


## 配置管理

### 配置文件

正确安装 Z-BlogPHP 后会以如路径 path/zb_users/c_option.php 生成一份配置文件，记录有数据库连接信息等基础信息，进行空间迁移，数据库更换等操作时，可能需要手动修改此文件来完成操作。

{% note success %}
path：当前博客程序所放置的路径，比如/home/wwwroot/www.80tz.cn；
{% endnote %} 

### 后台登陆

host/zb_system/cmd.php?act=login 会跳转到：host/zb_system/login.php

{% note success %}
host：用于浏览器访问的网址路径，比如https://www.80tz.cn/；
{% endnote %} 

可以在 网站设置 选项中对站点进行设置管理；

重要：网站设置→全局设置→开发模式 ←在网站出现错误提示时可以启用该选项来排查

## Composer 安装 PHP 包

自 Z-BlogPHP 1.7.2 版本起，系统可以自动加载 vendor 目录里的包

所以只需要安装 composer 包到 verndor，不需要引入 vendor 下的 autoload.php 文件

## 先创建 c_option.php 后执行安装过程 (1.7.2 开始支持)

一般是在安装程序完成后会自动生成 c_option.php 配置文件在 zb_users 目录下

如何提前配置好 c_option.php 再执行安装过程？

需要在新建文件 c_option.php 加入 'ZC_INSTALL_AFTER_CONFIG' => true ,再填入其它的数据库配置,这样打开网站就会自动转入安装页面进行安装过程(前提是数据库配置正确能连接上)

```php
// c_option.php 示例如下
return array (
  'ZC_INSTALL_AFTER_CONFIG' => true,
  'ZC_DATABASE_TYPE' => 'mysqli',
  'ZC_MYSQL_SERVER' => 'localhost',// 数据库地址
  'ZC_MYSQL_USERNAME' => '账号名',
  'ZC_MYSQL_PASSWORD' => '账号密码',
  'ZC_MYSQL_NAME' => '数据库名',
  'ZC_MYSQL_CHARSET' => 'utf8mb4',
  'ZC_MYSQL_COLLATE' => 'utf8mb4_general_ci',
  'ZC_MYSQL_PRE' => 'zbp_',
  'ZC_MYSQL_ENGINE' => 'MyISAM',
  'ZC_MYSQL_PORT' => '3306',// 数据库端口号
  'ZC_MYSQL_PERSISTENT' => false,
);

```

## 从环境变量中读取数据库配置

c_option.php 配置文件中参数的值为Zbp_GetEnv('环境变量名')，就会用 Zbp_GetEnv 函数读取环境变量的值 (1.7.3 开始支持)

```php
-// c_option.php 示例如下
<?php
return array (
  'ZC_DATABASE_TYPE' => 'mysqli',
  'ZC_MYSQL_SERVER' => Zbp_GetEnv('DB_HOST'),// 环境变量名
  'ZC_MYSQL_USERNAME' => Zbp_GetEnv('DB_USER'),// 环境变量名
  'ZC_MYSQL_PASSWORD' => Zbp_GetEnv('DB_PASSWORD'),// 环境变量名
  'ZC_MYSQL_NAME' => Zbp_GetEnv('DB_DATABASE'),// 环境变量名
  'ZC_MYSQL_PORT' => '3306',
  'ZC_MYSQL_CHARSET' => 'utf8mb4',
  'ZC_MYSQL_COLLATE' => 'utf8mb4_general_ci',
  'ZC_MYSQL_PRE' => 'zbp_',
  'ZC_MYSQL_ENGINE' => 'MyISAM',
  'ZC_MYSQL_PERSISTENT' => false,
);

```

那么 ZC_MYSQL_SERVER, ZC_MYSQL_USERNAME, ZC_MYSQL_PASSWORD, ZC_MYSQL_NAME 这 4 个参数的值就会从 Zbp_GetEnv('DB_HOST') 等中获取

注：

Zbp_GetEnv 函数是 1.7.3 加入的，Zbp_GetEnv 调用的是 ZbpEnv 类的 Get 方法，Get 方法会按 $_ENV，getenv 顺序获取环境变量

ZbpEnv 类在初始化时会自动加载 .env 文件（如果存在的话），会将 .env 文件里的配置的项和值加入环境变量中，如果您在系统根目录放置和使用 .env 文件，请一定要注意保护好该文件不被 web 端下载造成意外风险

注 2：

1.7.2 及以上版本也可以填入 env:DB_HOST，env:DB_USER，env:PASSWORD，env:DB_DATABASE 以获取环境变量的值

```php
  //示例如下：
  'ZC_MYSQL_SERVER' => 'env:DB_HOST',// 环境变量名:DB_HOST
  'ZC_MYSQL_USERNAME' => 'env:DB_USER',// 环境变量名:DB_USER
  'ZC_MYSQL_PASSWORD' => 'env:DB_PASSWORD',// 环境变量名:DB_PASSWORD
  'ZC_MYSQL_NAME' => 'env:DB_DATABASE',// 环境变量名:DB_DATABASE

```

其它版本也可以通过 getenv 函数获取环境变量的值