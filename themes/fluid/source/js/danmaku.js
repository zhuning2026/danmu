document.addEventListener('DOMContentLoaded', () => {
  const danmakuList = document.getElementById('danmaku-list');
  const danmakuInput = document.getElementById('danmaku-input');
  const danmakuSubmit = document.getElementById('danmaku-submit');
  const danmakuHeader = document.querySelector('.danmaku-header');
  const emojiBtn = document.getElementById('emoji-btn');
  const emojiPicker = document.getElementById('emoji-picker');
  const scrollBtn = document.getElementById('danmaku-scroll-btn');
  
  if (!danmakuList || !danmakuInput || !danmakuSubmit) return;
  
  const ADMIN_PASSWORD = 'zhuning';
  const EXIT_PASSWORD = 'jiehun';
  
  const getApiBase = () => {
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }
    // 自动适应当前域名，支持带 www 和不带 www
    return `${window.location.protocol}//${window.location.host}/api`;
  };
  
  const API_BASE = getApiBase();
  let comments = [];
  let isScrolling = true;
  let isAdminMode = false;
  let userLocation = '神秘';
  let pollInterval = null;
  
  // 省份英文转中文映射
  const provinceMap = {
    'Beijing': '北京',
    'Tianjin': '天津',
    'Hebei': '河北',
    'Shanxi': '山西',
    'Inner Mongolia': '内蒙古',
    'Liaoning': '辽宁',
    'Jilin': '吉林',
    'Heilongjiang': '黑龙江',
    'Shanghai': '上海',
    'Jiangsu': '江苏',
    'Zhejiang': '浙江',
    'Anhui': '安徽',
    'Fujian': '福建',
    'Jiangxi': '江西',
    'Shandong': '山东',
    'Henan': '河南',
    'Hubei': '湖北',
    'Hunan': '湖南',
    'Guangdong': '广东',
    'Guangxi': '广西',
    'Hainan': '海南',
    'Chongqing': '重庆',
    'Sichuan': '四川',
    'Guizhou': '贵州',
    'Yunnan': '云南',
    'Tibet': '西藏',
    'Shaanxi': '陕西',
    'Gansu': '甘肃',
    'Qinghai': '青海',
    'Ningxia': '宁夏',
    'Xinjiang': '新疆',
    'Hong Kong': '香港',
    'Macao': '澳门',
    'Taiwan': '台湾'
  };

  // 获取用户IP定位
  const fetchUserLocation = async () => {
    try {
      // 使用更稳定的IP定位服务
      const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=free');
      const data = await response.json();
      
      if (data && data.state_prov) {
        userLocation = provinceMap[data.state_prov] || data.state_prov;
      } else if (data && data.region_name) {
        userLocation = provinceMap[data.region_name] || data.region_name;
      } else if (data && data.city) {
        userLocation = data.city;
      } else if (data && data.country_name) {
        userLocation = data.country_name === 'China' ? '中国' : data.country_name;
      }
    } catch (err) {
      console.log('使用备用IP定位服务');
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data && data.region) {
          userLocation = provinceMap[data.region] || data.region;
        } else if (data && data.country_name) {
          userLocation = data.country_name === 'China' ? '中国' : data.country_name;
        }
      } catch (fallbackErr) {
        console.log('获取位置失败，使用默认位置');
      }
    }
  };
  
  const createCommentItem = (comment) => {
    const item = document.createElement('div');
    item.className = 'danmaku-item';
    
    const contentHtml = renderContentWithEmoji(comment.content);
    const locationText = comment.location || '神秘';
    
    item.innerHTML = `
      <span class="danmaku-content">
        <span class="danmaku-location">${locationText}网友说：</span>${contentHtml}
      </span>
      <div class="danmaku-actions">
        <span class="danmaku-like" data-id="${comment.id}" data-liked="${comment.liked ? 'true' : 'false'}">
          <i class="iconfont icon-love"></i>
          <span class="like-count">${comment.likes}</span>
        </span>
        ${isAdminMode ? `<span class="danmaku-delete" data-id="${comment.id}">删除</span>` : ''}
      </div>
    `;
    
    const likeBtn = item.querySelector('.danmaku-like');
    likeBtn.addEventListener('click', () => {
      const isLiked = likeBtn.getAttribute('data-liked') === 'true';
      const id = likeBtn.getAttribute('data-id');
      const commentObj = comments.find(c => c.id == id);
      
      if (!commentObj) return;
      
      if (isLiked) {
        likeBtn.classList.remove('liked');
        likeBtn.setAttribute('data-liked', 'false');
        commentObj.likes = Math.max(0, (commentObj.likes || 0) - 1);
        commentObj.liked = false;
      } else {
        likeBtn.classList.add('liked');
        likeBtn.setAttribute('data-liked', 'true');
        commentObj.likes = (commentObj.likes || 0) + 1;
        commentObj.liked = true;
      }
      likeBtn.querySelector('.like-count').textContent = commentObj.likes;
      
      fetch(`${API_BASE}/comments/${id}/like`, {
        method: 'PUT'
      }).catch(() => {});
    });
    
    const deleteBtn = item.querySelector('.danmaku-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteComment(comment.id);
      });
    }
    
    return item;
  };
  
  const renderContentWithEmoji = (content) => {
    if (!content) return '';
    
    let html = content;
    
    const emojiRegex = /\[emoji:([a-z0-9_]+)\]/g;
    html = html.replace(emojiRegex, (match, emojiName) => {
      return `<img src="/img/QQ/${emojiName}.gif" alt="${emojiName}" class="comment-emoji" onerror="this.style.display='none'">`;
    });
    
    return html;
  };
  
  const renderComments = () => {
    danmakuList.innerHTML = '';
    
    const innerWrapper = document.createElement('div');
    innerWrapper.className = 'danmaku-inner';
    
    comments.forEach((comment) => {
      innerWrapper.appendChild(createCommentItem(comment));
    });
    
    if (comments.length > 3) {
      comments.forEach((comment) => {
        innerWrapper.appendChild(createCommentItem(comment));
      });
    }
    
    danmakuList.appendChild(innerWrapper);
  };
  
  const loadComments = async () => {
    try {
      const response = await fetch(`${API_BASE}/comments`);
      const data = await response.json();
      comments = data;
      renderComments();
    } catch (err) {
      console.error('Failed to load comments:', err);
      
      comments = [
        { id: 1, content: '测试弹幕，如需部署联系QQ：623869193', likes: 128, location: '北京' }
      ];
      renderComments();
    }
  };
  
  const deleteComment = async (id) => {
    // 先立即从本地删除并更新界面，让用户感觉瞬间删除
    const index = comments.findIndex(c => c.id === id);
    if (index !== -1) {
      comments.splice(index, 1);
      renderComments();
    }
    
    // 再异步发送删除请求到服务器，不阻塞界面
    try {
      await fetch(`${API_BASE}/comments/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete comment from server:', err);
    }
  };
  
  const toggleAdminMode = () => {
    isAdminMode = !isAdminMode;
    updateAdminUI();
    renderComments();
  };
  
  const updateAdminUI = () => {
    if (isAdminMode) {
      danmakuHeader.classList.add('admin-mode');
      danmakuInput.placeholder = '输入内容发表评论，或输入 "exit" 退出管理模式';
    } else {
      danmakuHeader.classList.remove('admin-mode');
      danmakuInput.placeholder = '发表你的看法';
    }
  };
  
  // 轮询更新评论
  const pollComments = async () => {
    try {
      const response = await fetch(`${API_BASE}/comments`);
      const newComments = await response.json();
      // 只有当评论有变化时才重新渲染
      if (JSON.stringify(newComments.map(c => ({ id: c.id, likes: c.likes }))) !== 
          JSON.stringify(comments.map(c => ({ id: c.id, likes: c.likes })))) {
        comments = newComments;
        renderComments();
      }
    } catch (err) {
      console.error('轮询更新失败:', err);
    }
  };
  
  // 初始化
  fetchUserLocation();
  loadComments();
  // 每3秒轮询一次
  pollInterval = setInterval(pollComments, 3000);
  
  // 页面卸载时清除轮询
  window.addEventListener('beforeunload', () => {
    if (pollInterval) {
      clearInterval(pollInterval);
    }
  });
  
  danmakuSubmit.addEventListener('click', async () => {
    const content = danmakuInput.value.trim();
    if (!content) return;
    
    if (!isAdminMode && content.toLowerCase() === ADMIN_PASSWORD) {
      toggleAdminMode();
      danmakuInput.value = '';
      return;
    }
    
    if (isAdminMode && content.toLowerCase() === EXIT_PASSWORD) {
      toggleAdminMode();
      danmakuInput.value = '';
      return;
    }
    
    const tempId = Date.now();
    const newComment = {
      id: tempId,
      content: content,
      location: userLocation,
      likes: 0
    };
    
    comments.unshift(newComment);
    if (comments.length > 10) {
      comments.pop();
    }
    renderComments();
    danmakuInput.value = '';
    
    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, location: userLocation })
      });
      
      if (response.ok) {
        const savedComment = await response.json();
        const index = comments.findIndex(c => c.id === tempId);
        if (index !== -1) {
          comments[index].id = savedComment.id;
        }
      }
    } catch (err) {
      console.error('Failed to sync comment:', err);
    }
  });
  
  danmakuInput.addEventListener('input', () => {
    const content = danmakuInput.value.trim().toLowerCase();
    
    if (isAdminMode && content === EXIT_PASSWORD) {
      toggleAdminMode();
      danmakuInput.value = '';
    }
  });
  
  danmakuInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      danmakuSubmit.click();
    }
  });
  
  const toggleEmojiPicker = () => {
    emojiPicker.classList.toggle('show');
  };
  
  emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleEmojiPicker();
  });
  
  const emojiItems = emojiPicker.querySelectorAll('.emoji-item');
  emojiItems.forEach(item => {
    item.addEventListener('click', () => {
      const emojiName = item.getAttribute('data-emoji');
      if (emojiName) {
        danmakuInput.value += `[emoji:${emojiName}]`;
        emojiPicker.classList.remove('show');
        danmakuInput.focus();
      }
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
      emojiPicker.classList.remove('show');
    }
  });
  
  const updateScrollButton = () => {
    const text = scrollBtn.querySelector('.scroll-btn-text');
    if (isScrolling) {
      text.textContent = '停止滚动';
    } else {
      text.textContent = '继续滚动';
    }
  };
  
  const toggleScroll = () => {
    isScrolling = !isScrolling;
    const inner = danmakuList.querySelector('.danmaku-inner');
    if (inner) {
      inner.style.animationPlayState = isScrolling ? 'running' : 'paused';
    }
    updateScrollButton();
  };
  
  if (scrollBtn) {
    scrollBtn.addEventListener('click', toggleScroll);
  }
  
  danmakuList.addEventListener('mouseenter', () => {
    const inner = danmakuList.querySelector('.danmaku-inner');
    if (inner && isScrolling) {
      inner.style.animationPlayState = 'paused';
    }
  });
  
  danmakuList.addEventListener('mouseleave', () => {
    const inner = danmakuList.querySelector('.danmaku-inner');
    if (inner && isScrolling) {
      inner.style.animationPlayState = 'running';
    }
  });
  
  updateScrollButton();
});