class SidebarComments {
  constructor() {
    this.init();
    this.bindEvents();
    this.loadTwikooComments();
  }

  init() {
    this.commentsContainer = document.getElementById('comments-scroll-container');
    this.twikooContainer = document.getElementById('sidebar-twikoo');
    this.commentInput = document.getElementById('sidebar-comment-input');
    this.submitBtn = document.getElementById('submit-comment-btn');
    this.charCount = document.querySelector('.char-count');
    
    this.comments = [];
    this.isSubmitting = false;
  }

  bindEvents() {
    if (this.commentInput) {
      this.commentInput.addEventListener('input', (e) => {
        const length = e.target.value.length;
        this.charCount.textContent = `${length}/500`;
        
        if (length > 0 && !this.isSubmitting) {
          this.submitBtn.disabled = false;
        } else {
          this.submitBtn.disabled = true;
        }
      });
    }

    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => this.submitComment());
    }

    if (this.commentInput) {
      this.commentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.submitComment();
        }
      });
    }
  }

  loadTwikooComments() {
    if (!window.twikoo) {
      const script = document.createElement('script');
      script.src = 'https://lib.baomitu.com/twikoo/1.6.8/twikoo.all.min.js';
      script.onload = () => {
        this.initTwikoo();
      };
      document.head.appendChild(script);
    } else {
      this.initTwikoo();
    }
  }

  initTwikoo() {
    if (!window.twikoo || !this.twikooContainer) return;

    twikoo.init({
      el: '#sidebar-twikoo',
      envId: 'https://twikoo-copilot.bytedance.net',
      region: 'ap-shanghai',
      path: window.location.pathname,
      onCommentLoaded: (data) => {
        this.onCommentsLoaded(data);
      },
      onCommentPosted: () => {
        this.onCommentPosted();
      }
    });
  }

  onCommentsLoaded(data) {
    if (data && data.comments) {
      this.comments = data.comments;
      this.renderComments();
    }
  }

  onCommentPosted() {
    this.commentInput.value = '';
    this.charCount.textContent = '0/500';
    this.submitBtn.disabled = true;
    
    setTimeout(() => {
      twikoo.getComments({
        path: window.location.pathname,
        success: (data) => {
          this.onCommentsLoaded(data);
          this.scrollToBottom();
        }
      });
    }, 500);
  }

  renderComments() {
    if (!this.twikooContainer) return;
    
    this.twikooContainer.innerHTML = '';
    
    this.comments.forEach((comment) => {
      const item = this.createCommentItem(comment);
      this.twikooContainer.appendChild(item);
    });
  }

  createCommentItem(comment) {
    const div = document.createElement('div');
    div.className = 'sidebar-comment-item';
    div.innerHTML = `
      <div class="sidebar-comment-author">
        <div class="sidebar-comment-avatar">
          <img src="${comment.avatar || '/img/avatar.png'}" alt="${comment.nick}">
        </div>
        <span class="sidebar-comment-name">${this.escapeHtml(comment.nick || '匿名用户')}</span>
      </div>
      <p class="sidebar-comment-content">${this.escapeHtml(comment.comment)}</p>
      <span class="sidebar-comment-time">${this.formatTime(comment.created)}</span>
    `;
    return div;
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  submitComment() {
    const content = this.commentInput.value.trim();
    if (!content || this.isSubmitting) return;

    this.isSubmitting = true;
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = '发送中...';

    if (window.twikoo) {
      twikoo.submit({
        comment: content,
        success: () => {
          this.isSubmitting = false;
          this.submitBtn.textContent = '发送';
        },
        error: () => {
          this.isSubmitting = false;
          this.submitBtn.textContent = '发送';
          alert('评论失败，请重试');
        }
      });
    }
  }

  scrollToBottom() {
    if (this.commentsContainer) {
      this.commentsContainer.scrollTop = this.commentsContainer.scrollHeight;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('sidebar-twikoo')) {
    window.SidebarCommentsInstance = new SidebarComments();
  }
});