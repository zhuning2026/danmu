---
title: 弹幕评论系统 v3.0
tags: [评论 哲学 技术]
excerpt: 一个功能完善的Hexo博客弹幕评论系统，支持QQ表情、点赞等功能，欢迎测试..
index_img: /kali/5.jpeg
banner_img: /kali/5.jpeg
date: 2026-05-30 01:00:00
# sticky: 98
---

# 弹幕评论系统

## 体验地址

[测试网站](https://www.80tz.cn)(本站首页)

## 下载地址

[github下载地址](https://github.com/zhuning2026/danmu.git)
[gitee下载地址](https://gitee.com/ddddddddasdfasdfasdf/xiaozhu2026.git)

## 版本信息

- **版本号**：3.0.0
- **作者**：小朱
- **联系方式**：QQ：623869193（微信同号）
- **注意**：目前只支持fluid主题（基于此主题开发）
## 功能特性

- 评论发布与展示
- QQ表情支持
- 点赞/取消点赞
- 评论删除（管理模式）
- CORS跨域支持
- 自动适配主域名和WWW域名
- PM2进程管理
- 开机自启

## 快速部署

文件全部下载后，执行命令就两步：

1. 本地运行： npm run clean && npm run build
2. 把 public/ 文件夹里的所有内容上传到服务器网站根目录

### 后端部署

- 把根目录下的这4个文件上传到服务器 /www/wwwroot/backend/：
server.js
package.json
package-lock.json
comments.json

- 在服务器运行：cd /www/wwwroot/backend && npm install

- 用PM2启动：pm2 start server.js --name comment-api

- 配置Nginx反向代理 /api 到 # 127.0.0.1:5001 