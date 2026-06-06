const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5001;

const DATA_FILE = path.join(__dirname, 'comments.json');

const initData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = [
      { id: 1, content: '这篇文章写得太棒了！', likes: 128, created_at: new Date().toISOString() },
      { id: 2, content: '学到了很多新知识', likes: 89, created_at: new Date().toISOString() },
      { id: 3, content: '感谢作者的分享', likes: 67, created_at: new Date().toISOString() },
      { id: 4, content: '期待更多精彩内容', likes: 54, created_at: new Date().toISOString() }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
};

const loadData = () => {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  return [];
};

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

initData();

// 配置 CORS 允许所有域名请求
const corsOptions = {
  origin: true,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/comments', (req, res) => {
  const comments = loadData();
  res.json(comments);
});

app.post('/api/comments', (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: '内容不能为空' });
  }
  
  const comments = loadData();
  const newComment = {
    id: Date.now(),
    content: content.trim(),
    likes: 0,
    created_at: new Date().toISOString()
  };
  comments.unshift(newComment);
  saveData(comments);
  res.json(newComment);
});

app.put('/api/comments/:id/like', (req, res) => {
  const { id } = req.params;
  const comments = loadData();
  const comment = comments.find(c => c.id == id);
  if (!comment) {
    return res.status(404).json({ error: '评论不存在' });
  }
  comment.likes++;
  saveData(comments);
  res.json({ likes: comment.likes });
});

app.delete('/api/comments/:id', (req, res) => {
  const { id } = req.params;
  const comments = loadData();
  const index = comments.findIndex(c => c.id == id);
  if (index === -1) {
    return res.status(404).json({ error: '评论不存在' });
  }
  comments.splice(index, 1);
  saveData(comments);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`博客 + 评论系统已启动！`);
  console.log(`地址: http://localhost:${PORT}`);
  console.log(`数据文件: ${DATA_FILE}`);
  console.log(`========================================`);
});
