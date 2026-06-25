# 爱创发明 - 青少年编程天赋测评H5工具

## 项目简介

专为爱创发明教育机构定制的青少年编程天赋测评系统，通过科学的多维度测评，帮助3-16岁青少年发现编程天赋，提供个性化的学习建议和课程推荐。

## 核心功能

### 1. 多维度测评
- **逻辑思维** (25分)：问题分析、推理判断、模式识别
- **创意实现** (25分)：想象力、创新思维、解决方案设计
- **概念理解** (25分)：编程基础概念、原理认知
- **专注毅力** (25分)：注意力持久性、困难克服能力
- **协作沟通** (25分)：团队合作、交流表达能力

### 2. 智能题库系统
- 按年级段分类：1-3年级 / 4-6年级 / 初中
- 难度梯度：1-5级难度自动适配
- 题目类型：选择题 / 情景题 / 实践题
- 动态选题：根据学生特点智能推荐

### 3. 专业结果解读
- 雷达图可视化
- 各维度详细分析
- 个性化学习建议
- 课程推荐匹配

### 4. 品牌化UI设计
- 爱创发明VI配色（橙#FF6B35 + 青#4ECDC4）
- 活泼有趣的游戏化界面
- STEAM教育理念展示
- 移动端优先设计

## 技术架构

### 后端
- **运行环境**：Node.js 16+
- **Web框架**：Express 4.18+
- **数据库**：SQLite 3（轻量级，易部署）
- **API设计**：RESTful API

### 前端
- **技术栈**：原生HTML5 + CSS3 + JavaScript (ES6+)
- **UI设计**：响应式设计，移动端优先
- **动画效果**：CSS3 Animations
- **图表展示**：Canvas API（雷达图）

### 数据库
- **题型**：SQLite（无需单独安装数据库服务器）
- **表设计**：
  - `questions`：题目表
  - `assessments`：测评记录表
  - `answers`：答题详情表
  - `result_interpretations`：结果解读表
  - `course_recommendations`：课程推荐表
  - `system_config`：系统配置表

## 项目结构

```
src/
├── backend/                # 后端代码
│   ├── app.js            # 主应用文件
│   └── package.json     # 依赖配置
├── frontend/             # 前端代码
│   ├── index.html       # 首页
│   ├── css/             # 样式文件
│   │   ├── style.css   # 主样式
│   │   └── quiz-result.css  # 测评和结果页样式
│   ├── js/              # JavaScript文件
│   │   └── app.js      # 主交互逻辑
│   └── images/          # 图片资源（待补充）
├── database/             # 数据库相关
│   └── schema.sql      # 数据库初始化脚本
├── config/               # 配置文件（待扩展）
└── README.md            # 项目说明文档
```

## 快速开始

### 1. 环境准备

**必需环境**：
- Node.js 16.0+ 
- npm 8.0+

**检查环境**：
```bash
node -v
npm -v
```

### 2. 安装依赖

```bash
cd src/backend
npm install
```

主要依赖包：
- `express`：Web服务器框架
- `sqlite3`：SQLite数据库驱动
- `cors`：跨域资源共享
- `dotenv`：环境变量管理

### 3. 初始化数据库

```bash
# 方法1：通过Node.js初始化
cd src/backend
node -e "require('./app.js');"

# 方法2：使用SQLite命令行
sqlite3 ../database/assessment.db < ../database/schema.sql
```

### 4. 启动服务

```bash
cd src/backend
npm start
```

服务器将启动在 `http://localhost:3000`

### 5. 访问应用

在浏览器中打开：`http://localhost:3000`

## API接口文档

### 1. 获取题目列表
```
GET /api/questions?grade_level=1&dimension=logic&limit=10
```

**参数**：
- `grade_level`：年级段（1/2/3）
- `dimension`：测评维度（可选）
- `limit`：题目数量（默认10）

**响应**：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question_id": "Q1_G1_01",
      "grade_level": 1,
      "dimension": "logic",
      "difficulty": 2,
      "question_type": "choice",
      "question_text": "题目内容...",
      "option_a": "选项A",
      "option_b": "选项B",
      ...
    }
  ]
}
```

### 2. 创建测评记录
```
POST /api/assessments
Content-Type: application/json

{
  "student_name": "张三",
  "gender": "M",
  "birth_date": "2015-05-10",
  "grade_level": 1,
  "has_programming_exp": false,
  "programming_exp_desc": ""
}
```

### 3. 提交答案
```
POST /api/answers
Content-Type: application/json

{
  "assessment_id": 1,
  "question_id": 1,
  "selected_option": "A",
  "time_spent": 30
}
```

### 4. 完成测评
```
POST /api/assessments/:id/complete
```

### 5. 获取测评结果
```
GET /api/assessments/:id/result
```

### 6. 获取系统配置
```
GET /api/config
```

### 7. 获取测评统计
```
GET /api/stats
```

## 题库管理

### 添加题目

**方法1：通过SQL直接插入**
```sql
INSERT INTO questions (
  question_id, grade_level, dimension, difficulty, 
  question_type, question_text, 
  option_a, option_b, option_c, option_d,
  score_a, score_b, score_c, score_d,
  explanation, tags
) VALUES (
  'Q6_G1_06', 1, 'logic', 2, 'choice',
  '题目内容...',
  '选项A', '选项B', '选项C', '选项D',
  4, 2, 1, 0,
  '解析内容...', '标签1,标签2'
);
```

**方法2：通过管理后台（待开发）**

### 题目评分规则

- 每题选项得分范围：0-4分
- 每个维度总分：25分（归一化后）
- 总分计算：(各维度得分之和) / 5

## 结果解读配置

在 `result_interpretations` 表中配置各维度、各分数段的解读内容：

```sql
INSERT INTO result_interpretations (
  dimension, grade_level, 
  score_range_start, score_range_end,
  level, interpretation, suggestions, 
  course_recommendations
) VALUES (
  'logic', 1,
  0, 40,
  '待提高',
  '解读内容...',
  '建议内容...',
  '["课程1", "课程2"]'
);
```

## 课程推荐配置

在 `course_recommendations` 表中配置推荐课程：

```sql
INSERT INTO course_recommendations (
  course_code, course_name, category,
  suitable_grade, suitable_dimensions,
  description, features, outcomes,
  duration, price
) VALUES (
  'SCRATCH_002', 'Scratch趣味编程',
  'programming', 1,
  'logic,creativity',
  '课程描述...',
  '["特征1", "特征2"]',
  '["成果1", "成果2"]',
  24, 1680.00
);
```

## 品牌定制化

### 修改品牌色

在 `frontend/css/style.css` 的 `:root` 中修改：

```css
:root {
    --primary: #FF6B35;      /* 主题色（橙） */
    --secondary: #4ECDC4;    /* 辅助色（青） */
    --accent-yellow: #FFD166; /* 强调色（黄） */
    --accent-pink: #EF476F;   /* 强调色（粉） */
    --accent-purple: #9D4EDD; /* 强调色（紫） */
}
```

### 修改品牌信息

在 `frontend/index.html` 中修改：

```html
<span class="logo-text">爱创发明</span>
<p class="footer">© 2026 爱创发明 版权所有</p>
```

在 `src/database/schema.sql` 中修改：

```sql
INSERT OR IGNORE INTO system_config VALUES
('site_name', '爱创发明 - 青少年编程天赋测评', '站点名称'),
('logo_url', '/images/logo.png', 'Logo URL');
```

## 部署指南

### 生产环境部署

**1. 使用PM2管理进程**

```bash
# 安装PM2
npm install -g pm2

# 启动应用
cd src/backend
pm2 start app.js --name "youth-assessment"

# 查看状态
pm2 status

# 查看日志
pm2 logs youth-assessment

# 重启应用
pm2 restart youth-assessment
```

**2. 配置Nginx反向代理**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /images/ {
        alias /path/to/frontend/images/;
    }
}
```

**3. 配置HTTPS**

使用Let's Encrypt免费证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 性能优化

**1. 数据库优化**
- 为常用查询字段添加索引
- 定期执行 `VACUUM` 释放空间
- 使用 `WAL` 模式提高并发性能

**2. 前端优化**
- 压缩CSS和JavaScript文件
- 使用CDN加速静态资源
- 启用Gzip压缩

**3. 缓存策略**
- 题目数据缓存（Redis，待集成）
- 静态资源缓存

## 扩展开发

### 待实现功能

1. **管理后台**
   - 题目增删改查
   - 测评记录查看
   - 数据统计报表
   - 用户管理

2. **高级功能**
   - PDF报告生成
   - 微信分享集成
   - 短信/邮件通知
   - 多机构支持

3. **性能优化**
   - Redis缓存集成
   - 数据库读写分离
   - 负载均衡

### 二次开发指南

**添加新API接口**：

在 `src/backend/app.js` 中添加：

```javascript
app.get('/api/your-endpoint', (req, res) => {
    // 业务逻辑
    res.json({ success: true, data: {...} });
});
```

**添加新页面**：

1. 在 `frontend/` 创建HTML文件
2. 在 `frontend/css/` 添加样式
3. 在 `frontend/js/` 添加交互逻辑
4. 在 `src/backend/app.js` 中配置静态文件服务

## 常见问题

### 1. 数据库初始化失败

**问题**：执行 `schema.sql` 时报错

**解决**：
- 检查SQLite版本（需要3.0+）
- 确认文件路径正确
- 查看错误日志

### 2. 端口被占用

**问题**：启动时报 `EADDRINUSE` 错误

**解决**：
```bash
# 查看占用端口的进程
lsof -i:3000

# 修改端口
# 在 src/backend/app.js 中修改
const PORT = process.env.PORT || 3001;
```

### 3. 前端页面无法访问

**问题**：打开 `http://localhost:3000` 显示无法访问

**解决**：
- 确认后端服务已启动
- 检查防火墙设置
- 查看终端日志输出

### 4. 题目数据不足

**问题**：测评时题目数量不够

**解决**：
- 通过SQL插入更多题目
- 开发题目管理功能
- 调整每次测评的题目数量配置

## 技术支持

- **开发者**：钟广锐
- **机构**：爱创发明
- **技术栈**：Node.js + SQLite + Vanilla JavaScript
- **版本**：v1.0.0 (2026-05-05)

## 许可证

MIT License

---

**注意**：本项目专为爱创发明教育机构定制，未经授权不得用于商业用途。
