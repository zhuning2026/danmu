---
title: 修改主页记录
tags: [编程 修改 主页]
excerpt: 念念不忘 必有回响
categories:
  - [系统]
index_img: /kali/5.jpeg
banner_img: /kali/5.jpeg
date: 2026-04-03 12:00:00
---
> 改了一下主页的效果 不太好 希望慎重引用

### 目录
- [1-添加鼠标移动小星星特效](#1-添加鼠标移动小星星特效)
- [2-博客底部添加运行时间](#2-博客底部添加运行时间)
- [3-替换Mac风格代码块](#3-替换mac风格代码块)
- [4-首屏图片添加上升气泡特效](#4-首屏图片添加上升气泡特效)
- [5-增加打赏模块](#5-增加打赏模块)
- [6-首页文章滑动效果](#6-首页文章滑动效果)
  - [scrollAnimation.css代码如下：](#scrollanimationcss代码如下)
  - [scrollAnimation.js代码如下:](#scrollanimationjs代码如下)
- [7-背景音乐最小化切换停止](#7-背景音乐最小化切换停止)
- [8-优化版权说明](#8-优化版权说明)
- [9-背景动态效果](#9-背景动态动态线条效果)
## 1-添加鼠标移动小星星特效
在主题文件themes\fluid\source\js目录下新建样式文件，如stars.js
## 2-博客底部添加运行时间
修改footer.ejs，在第一行后面追加：
```javascript
<div>
  <span id="timeDate">正在载入天数...</span>
  <span id="times">载入时分秒...</span>
  <script>
  var now = new Date();
  function createtime(){
      var grt= new Date("08/17/2020 00:00:00");
      now.setTime(now.getTime()+250);
      days = (now - grt ) / 1000 / 60 / 60 / 24;
      dnum = Math.floor(days);
      hours = (now - grt ) / 1000 / 60 / 60 - (24 * dnum);
      hnum = Math.floor(hours);
      if(String(hnum).length ==1 ){
          hnum = "0" + hnum;
      }
      minutes = (now - grt ) / 1000 /60 - (24 * 60 * dnum) - (60 * hnum);
      mnum = Math.floor(minutes);
      if(String(mnum).length ==1 ){
                mnum = "0" + mnum;
      }
      seconds = (now - grt ) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum);
      snum = Math.round(seconds);
      if(String(snum).length ==1 ){
                snum = "0" + snum;
      }
      document.getElementById("timeDate").innerHTML = "🚀已持续航行&nbsp"+dnum+"&nbsp天";  
      document.getElementById("times").innerHTML = hnum + "&nbsp时&nbsp" + mnum + "&nbsp分&nbsp" + snum + "&nbsp秒";
  }
  setInterval("createtime()",250);
  </script>
</div>
```
## 3-替换Mac风格代码块
在主题文件themes\fluid\source\css目录下新建样式文件，如macpanel.styl，内容参考：
```css
.highlight
    background: #21252b
    border-radius: 5px
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, .4)
    padding-top: 30px

    &::before
      background: #fc625d
      border-radius: 50%
      box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b
      content: ' '
      height: 12px
      left: 12px
      margin-top: -20px
      position: absolute
      width: 12px
```
## 4-首屏图片添加上升气泡特效
修改banner.ejs在底部加入以下代码
```javascript
<% if(in_scope('home')) { %>
  <div style="height:500px" id="bubbles"></div>
  <script>
    circleMagic();
    function circleMagic(options) {
        let width;
        let height;
        let canvas;
        let ctx;
        let animateHeader = true;
        const circles = [];

        const settings = options || {
            color: 'rgba(255,255,255,.3)',
            radius: 10,
            density: 0.1,
            clearOffset: 0.7
        }

        const container = document.getElementById('bubbles');
        initContainer();
        addListeners();

        function initContainer() {
            width = container.offsetWidth;
            height = container.offsetHeight - 120;

            initCanvas();
            canvas = document.getElementById('homeTopCanvas');
            canvas.width = width;
            canvas.height = height;
            canvas.style.position = 'absolute';
            canvas.style.left = '0';
            canvas.style.bottom = '0';
            ctx = canvas.getContext('2d');

            for (let x = 0; x < width * settings.density; x++) {
                const c = new Circle();
                circles.push(c);
            }
            animate();
        }

        function initCanvas() {
            const canvasElement = document.createElement('canvas');
            canvasElement.id = 'homeTopCanvas';
            canvasElement.style.pointerEvents = 'none';
            container.appendChild(canvasElement);
            canvasElement.parentElement.style.overflow = 'hidden';
        }

        function addListeners() {
            window.addEventListener('scroll', scrollCheck, false);
            window.addEventListener('resize', resize, false);
        }

        function scrollCheck() {
            if (document.body.scrollTop > height) {
                animateHeader = false;
            } else {
                animateHeader = true;
            }
        }

        function resize() {
            width = container.clientWidth;
            height = container.clientHeight;
            container.height = height + 'px';
            canvas.width = width;
            canvas.height = height;
        }

        function animate() {
            if (animateHeader) {
                ctx.clearRect(0, 0, width, height);
                for (const i in circles) {
                    circles[i].draw();
                }
            }
            requestAnimationFrame(animate);
        }

        function randomColor() {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            const alpha = Math.random().toPrecision(2);
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
        }

        function Circle() {
            const that = this;
            (function () {
                that.pos = {};
                init();
            })();
            function init() {
                that.pos.x = Math.random() * width;
                that.pos.y = height + Math.random() * 100;
                that.alpha = 0.1 + Math.random() * settings.clearOffset;
                that.scale = 0.1 + Math.random() * 0.3;
                that.speed = Math.random();
                if (settings.color === 'random') {
                    that.color = randomColor();
                } else {
                    that.color = settings.color;
                }
            }
            this.draw = function () {
                if (that.alpha <= 0) {
                    init();
                }
                that.pos.y -= that.speed;
                that.alpha -= 0.0005;
                ctx.beginPath();
                ctx.arc(
                    that.pos.x,
                    that.pos.y,
                    that.scale * settings.radius,
                    0,
                    2 * Math.PI,
                    false
                );
                ctx.fillStyle = that.color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
  </script>
<% } %>
```
## 5-增加打赏模块
将下面代码复制粘贴，添加到 post.ejs 文章模板的 div和 hr 之间就可以了，记得保存！

```html
<div style="text-align: center; margin: auto;">
              <!--自己添加的打赏模块：开始-->
              <% if (theme.donate.enable) { %><!--如果主题的 _config.yml 中开启打赏-->
              <hr style="margin: 30px 0;"><!--放一条水平线与文章正文内容区分-->
              <div style="font-size: 16px; margin-bottom: 20px; color: #666;">
                “<%= theme.donate.message %>”
              </div>
              
              <!-- 横排显示的二维码容器 -->
              <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-bottom: 20px; max-width: 700px; margin-left: auto; margin-right: auto;">
                <!-- 支付宝二维码 -->
                <div style="text-align: center;">
                  <div style="font-size: 14px; margin-bottom: 10px; color: #333;">支付宝</div>
                  <img src="<%= theme.donate.alipay %>" 
                       style="width: 300px; height: 300px; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); object-fit: contain;" 
                       alt="支付宝收款码">
                </div>
                
                <!-- 微信二维码 -->
                <div style="text-align: center;">
                  <div style="font-size: 14px; margin-bottom: 10px; color: #333;">微信支付</div>
                  <img src="<%= theme.donate.wechatpay %>" 
                       style="width: 300px; height: 300px; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); object-fit: contain;" 
                       alt="微信收款码">
                </div>
              </div>
              
              <div style="background-color: #000000; border: none; color: rgb(235, 155, 7); padding: 12px 30px; text-align: center; text-decoration: none; display: inline-block; border-radius: 25px; margin-top: 10px; margin-bottom: 20px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;">
                <% if (config.language == 'zh-CN') { %>
                  ❤️ 其实按钮没有用
                <% } else { %>
                  ❤️ Donate
                <% } %>
              </div>
              <% } %>
            </div>
            <!--自己添加的打赏模块：结束-->
```
按钮变小后的
```html
<div style="text-align: center; margin: auto;">
  <!--自己添加的打赏模块：开始-->
  <% if (theme.donate.enable) { %><!--如果主题的 _config.yml 中开启打赏-->
  <hr style="margin: 30px 0;"><!--放一条水平线与文章正文内容区分-->
  <div style="font-size: 16px; margin-bottom: 20px; color: #666;">
    <!-- “<%= theme.donate.message %>” -->
  </div>

  <!-- 二维码容器：优化排版，图片添加间距 -->
  <div style="max-width: 600px; margin: 0 auto; text-align: center;">
    <img src="<%= theme.donate.alipay %>" style="width: 45%; max-width: 280px; margin: 0 5px; vertical-align: middle;">
    <img src="<%= theme.donate.wechatpay %>" style="width: 45%; max-width: 280px; margin: 0 5px; vertical-align: middle;">
    
    <!-- 【美化缩小版打赏按钮】核心修改 -->
    <div style="
      font-size: 13px;           /* 缩小字体 */
      padding: 5px 12px;         /* 缩小内边距（按钮核心变小） */
      background: #333;           /* 柔和深色背景 */
      color: #ff9500;             /* 暖色调文字 */
      border-radius: 18px;        /* 小巧圆角 */
      font-weight: 600;           /* 适中加粗 */
      margin-top: 15px;           /* 与二维码间距 */
      cursor: pointer;
      transition: all 0.2s ease;  /* 流畅过渡 */
      display: inline-block;
    "
    onmouseover="this.style.background='#222';this.style.transform='scale(0.96)';"
    onmouseout="this.style.background='#333';this.style.transform='scale(1)';">
      <% if (config.language == 'zh-CN') { %>
        ❤️ 扫码支持
      <% } else { %>
        ❤️ Donate
      <% } %>
    </div>
  </div>
  <% } %>
  <!--自己添加的打赏模块：结束-->
</div>
```
打开博客源文件所在的文件夹下的 _config.fluid.yml 文件（如果没有使用覆盖配置，就要打开博客源文件所在的文件夹下的 theme/fluid/_config.yml 文件），在最后添加如下内容：
```yarm
# Donate 自己为 Fluid 主题增加的打赏功能
# `message` 是打赏提示语，可自定义
# `alipay` 是支付宝付款码， `wechatpay` 是微信付款码。
donate:
  enable: true
  message: '随缘扫码'
  alipay: /img/x.png
  wechatpay: /img/x.png
```
## 6-首页文章滑动效果
创建一个scrollAnimation.css文件，scrollAnimation.js效果，文件名可自定义（亲测，电脑端无碍，手机端滑到顶端后下拉菜单选择不显示所以放弃）所以说大道至简，博客和个人主页越简单越好，随着年龄增长越来越不喜欢复杂的东西，包括人和事....
### scrollAnimation.css代码如下：
```CSS
.index-card {
  transition: all 0.5s;
  transform: scale(calc(1.5 - 0.5 * var(--state)));
  opacity: var(--state);
  margin-bottom: 2rem;
}

.index-img img {
  margin: 20px 0;
}
```
### scrollAnimation.js代码如下:
```js
const cards = document.querySelectorAll('.index-card')
if (cards.length) {
  document.querySelector('.row').setAttribute('style', 'overflow: hidden;')
  const coefficient = document.documentElement.clientWidth > 768 ? .5 : .3
  const origin = document.documentElement.clientHeight - cards[0].getBoundingClientRect().height * coefficient

  function throttle(fn, wait) {
    let timer = null;
    return function () {
      const context = this;
      const args = arguments;
      if (!timer) {
        timer = setTimeout(function () {
          fn.apply(context, args);
          timer = null;
        }, wait)
      }
    }
  }

  function handle() {
    cards.forEach(card => {
      card.setAttribute('style', `--state: ${(card.getBoundingClientRect().top - origin) < 0 ? 1 : 0};`)
    })
    console.log(1)
  }


  document.addEventListener("scroll", throttle(handle, 100));
}
```
## 7-背景音乐最小化切换停止
实现打开网页后自动播放背景音乐，并且最小化或者切换浏览器页面自动停止播放，在header最后面加入以下代码即可实现,本站打开就是实测效果
```html
<!-- 修复音频标签，闭合标签 -->
<audio id="bg-music">
  Your browser does not support the audio element.
</audio>

<script>
// 1. 自定义音乐播放列表（添加/修改你的音乐路径）
const playlist = [
  "/mp3/hua.mp3",
  "/mp3/song1.mp3",
  "/mp3/song2.mp3",
  "/mp3/song3.mp3"
];

let currentIndex = 0; // 当前播放索引
const audio = document.getElementById('bg-music');

// 2. 核心：生成随机索引（避免连续播放同一首歌）
function getRandomIndex() {
  let randomIndex;
  do {
    // 生成 0 ~ 列表长度-1 的随机数
    randomIndex = Math.floor(Math.random() * playlist.length);
  } while (randomIndex === currentIndex); // 确保和当前索引不同
  return randomIndex;
}

// 3. 播放函数：随机切换音乐并播放
function playRandomAudio() {
  currentIndex = getRandomIndex(); // 获取随机索引
  audio.src = playlist[currentIndex]; // 设置随机音乐路径
  audio.play().catch(() => {}); // 播放（兼容浏览器限制）
}

// 4. 监听歌曲播放完毕：自动随机切歌
audio.addEventListener('ended', playRandomAudio);

// 5. 初始化：页面加载后随机播放第一首
playRandomAudio();

// 6. 保留原有核心功能：页面切换控制播放/暂停
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    audio.pause(); // 页面隐藏 → 暂停
  } else {
    playRandomAudio(); // 页面返回 → 继续随机播放
  }
});
</script>
```
改良后的代码
```html
<audio id="bg-music">

  <script>
  // 音乐列表
  const playlist = [
    "/mp3/zhu.mp3",
    "/mp3/hua.mp3",
  ];
  
  let currentIndex = 0;
  const audio = document.getElementById('bg-music');
  audio.volume = 0.5;
  
  // 播放当前歌曲
  function playSong() {
    audio.src = playlist[currentIndex];
    audio.play().catch(() => {});
  }
  
  // 一首歌播放完自动下一首
  audio.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    playSong();
  });
  
  // 页面加载自动播放
  window.addEventListener('DOMContentLoaded', playSong);
  
  // 页面隐藏暂停，显示时**继续播放（不重头）**
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      audio.pause();
    } else {
      // 这里只 play，不重新设置 src，就会接着暂停位置继续播
      audio.play().catch(() => {});
    }
  });
  </script>
```
## 8-优化版权说明
在主题目录下的 layout/_partials/post/copyright.ejs 文件中搜索license = license.toUpperCase()在下面加入以下代码

```html
<style>
.license-box {
  background-color: #000 !important;
  color: #ff9500;
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 149, 0, 0.2);
  position: relative;
  margin: 16px 0;
}

/* 文章标题 + 链接 统一橙色 */
.license-title {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 149, 0, 0.15);
}
.license-title > div {
  color: #ff9500 !important;
}
.license-title > div:first-child {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}
.license-title > div:last-child {
  font-size: 14px;
  word-break: break-all;
}

.license-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 30px;
}
.license-meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
/* 标签文字：作者 / 发布于 / 更新于 / 许可协议 白色 */
.license-meta-item > div:first-child {
  font-size: 12px;
  color: #ffffff !important;
  opacity: 0.9;
}
/* 内容值：橙色 */
.license-meta-item > div:last-child {
  font-size: 15px;
  color: #ff9500;
}

/* 图标白色 + 发光 */
.license-meta .iconfont,
.license-icon.iconfont {
  color: #ffffff !important;
  text-shadow: 
    0 0 4px #fff,
    0 0 10px rgba(255,149,0,0.6);
  font-size: 20px;
  margin-right: 6px;
  vertical-align: middle;
}

/* 保留链接样式 */
.print-no-link {
  text-decoration: none;
}
.print-no-link:hover .iconfont {
  text-shadow: 
    0 0 6px #fff,
    0 0 14px #ff9500;
}
</style>

<div class="license-box my-3">
    <div class="license-title">
      <div><%= page.title %></div>
      <div><%= decode_url(full_url_for(page.path)) %></div>
    </div>
    <div class="license-meta">
      <% if (theme.post.copyright.author.enable && (page.author || config.author)) { %>
        <div class="license-meta-item">
          <div><%- __('post.copyright.author') %></div>
          <div><%- page.author || config.author %></div>
        </div>
      <% } %>
      <% if (theme.post.copyright.post_date.enable && page.date) { %>
        <div class="license-meta-item license-meta-date">
          <div><%- __('post.copyright.posted') %></div>
          <div><%= full_date(page.date, theme.post.copyright.post_date.format || 'LL') %></div>
        </div>
      <% } %>
      <% if (theme.post.copyright.update_date.enable && page.updated && compare_date(page.date, page.updated)) { %>
        <div class="license-meta-item license-meta-date">
          <div><%- __('post.copyright.updated') %></div>
          <div><%= full_date(page.updated, theme.post.copyright.update_date.format || 'LL') %></div>
        </div>
      <% } %>
      <% if (license) { %>
        <div class="license-meta-item">
          <div><%- __('post.copyright.licensed') %></div>
          <div>
            <% if (['BY', 'BY-SA', 'BY-ND', 'BY-NC', 'BY-NC-SA', 'BY-NC-ND'].indexOf(license) !== -1) { %>
              <% var items = license.split('-') %>
              <% for (var idx = 0; idx < items.length; idx++) { %>
                <a class="print-no-link" target="_blank" href="https://creativecommons.org/licenses/<%= license.toLowerCase() %>/4.0/">
                  <span class="hint--top hint--rounded" aria-label="<%- __('post.copyright.' + items[idx]) %>">
                    <i class="iconfont icon-cc-<%= items[idx].toLowerCase() %>"></i>
                  </span>
                </a>
              <% } %>
            <% } else if (license === 'ZERO') {  %>
              <a class="print-no-link" target="_blank" href="https://creativecommons.org/publicdomain/zero/1.0/">
                <span class="hint--top hint--rounded" aria-label="<%- __('post.copyright.ZERO') %>">
                  <i class="iconfont icon-cc-zero"></i>
                </span>
              </a>
            <% } else { %>
              <%- license %>
            <% } %>
          </div>
        </div>
      <% } %>
    </div>
    <div class="license-icon iconfont"></div>
  </div>
```
除了倒数第一行,然后覆盖即可.

## 9-背景动态动态线条效果

在 \Hexo\themes\hexo-theme-Fluid\layout\layout.ejs 文件中添加如下代码：

```js
<!--动态线条背景-->
<script type="text/javascript"
color="220,220,220" opacity='0.7' zIndex="-2" count="200" src="//cdn.bootcss.com/canvas-nest.js/1.0.0/canvas-nest.min.js">
</script>
```