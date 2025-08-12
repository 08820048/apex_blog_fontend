# ApexBlog 管理后台

基于 Vue 3 + Element-Plus 构建的博客管理后台系统，提供文章、分类、标签、作品集、友链等内容管理功能。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **UI 组件库**: Element-Plus
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **HTTP 客户端**: Axios
- **构建工具**: Vite

## 功能特性

### 📝 内容管理
- **文章管理**: 支持文章的增删改查、发布/取消发布、置顶等操作
- **分类管理**: 文章分类的创建、编辑、删除
- **标签管理**: 文章标签的管理，支持自定义颜色

### 🎨 其他管理
- **作品集管理**: 个人作品展示管理
- **友链管理**: 友情链接的维护
- **订阅管理**: 邮箱订阅用户管理

### 📊 数据统计
- **访问统计**: 网站访问量、独立访客等数据展示
- **热门页面**: 页面访问排行
- **访问趋势**: 最近访问量趋势图

### 🎯 设计特点
- **轻量设计**: 简洁清爽的界面，避免复杂动画
- **响应式布局**: 支持桌面和移动端访问
- **浅色主题**: 白色背景配合蓝色点缀

## 项目结构

```
apex-admin/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── config.js      # Axios 配置
│   │   ├── article.js     # 文章接口
│   │   ├── category.js    # 分类接口
│   │   ├── tag.js         # 标签接口
│   │   ├── portfolio.js   # 作品集接口
│   │   ├── friendLink.js  # 友链接口
│   │   ├── subscriber.js  # 订阅接口
│   │   └── stats.js       # 统计接口
│   ├── components/        # 组件
│   │   ├── Layout.vue     # 主布局
│   │   ├── Header.vue     # 顶部导航
│   │   └── Sidebar.vue    # 侧边栏
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   ├── styles/            # 样式文件
│   ├── views/             # 页面组件
│   │   ├── Login.vue      # 登录页
│   │   ├── Dashboard.vue  # 仪表盘
│   │   ├── articles/      # 文章管理
│   │   ├── categories/    # 分类管理
│   │   ├── tags/          # 标签管理
│   │   ├── portfolios/    # 作品集管理
│   │   ├── friend-links/  # 友链管理
│   │   ├── subscribers/   # 订阅管理
│   │   └── Stats.vue      # 统计页面
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── index.html            # HTML 模板
├── package.json          # 依赖配置
├── vite.config.js        # Vite 配置
└── README.md            # 项目说明
```

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
cd apex-admin
npm install
```

### 开发环境运行
```bash
npm run dev
```

访问 http://localhost:3001

### 📋 默认登录信息
- 用户名：xuyi
- 密码：5247xff

项目已配置真实的后端API接口，可直接连接后端服务使用。

### 生产环境构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 配置说明

### API 配置
在 `src/api/config.js` 中配置后端 API 地址：

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8888/api', // 修改为你的后端地址
  timeout: 10000
})
```

### 路由配置
路由配置在 `src/router/index.js` 中，包含路由守卫和权限验证。

### 状态管理
使用 Pinia 进行状态管理，主要管理用户登录状态和用户信息。

## 功能说明

### 登录系统
- 支持用户名密码登录
- JWT Token 认证
- 自动跳转和权限验证

### 文章管理
- 支持 Markdown 格式
- 草稿和发布状态切换
- 分类和标签关联
- 文章置顶功能

### 响应式设计
- 桌面端：侧边栏固定显示
- 移动端：侧边栏可收起，支持遮罩层

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 开发规范

### 代码风格
- 使用 Vue 3 Composition API
- 组件采用 `<script setup>` 语法
- 样式使用 scoped CSS

### 命名规范
- 组件名使用 PascalCase
- 文件名使用 kebab-case
- 变量名使用 camelCase

## 部署说明

### 构建项目
```bash
npm run build
```

### 部署到服务器
将 `dist` 目录下的文件部署到 Web 服务器即可。

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-backend-server:8888;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
