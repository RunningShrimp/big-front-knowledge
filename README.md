# 前端领航员 · 大前端全栈成长地图

一个**纯静态**的前端学习站点：51 个知识点、7 大模块，从 HTML 语义化一路走到综合实战与面试。每个知识点页都内置可做题、可判题的练习，并附带一整套基于学习科学的功能，帮助你真正记住、真正会用。

## 站点简介

- **51 个知识点**：每个知识点一页，包含内容大纲、生活化类比、练习题与考点提示。
- **7 大模块**：
  - M1 语言基石 —— 一切前端的地基
  - M2 浏览器与网络 —— 打开网页那一刻发生了什么
  - M3 框架与工程化 —— 从手写 DOM 到 React/Vue
  - M4 性能与质量 —— 快与稳是体验的底线
  - M5 跨端开发 —— 一套代码跑遍小程序、App
  - M6 后端基础（Node 向）—— 前端工程师的后端视角
  - M7 综合实战与面试 —— 把知识串成能力
- **可做题、可判题**：知识点页内嵌测验，答题后即时判分与解析，无需任何后端。
- **学习科学功能**：
  - **错题本**：自动收集答错的题目，集中回顾（`wrongbook.html`）。
  - **遗忘曲线复习提醒**：按艾宾浩斯遗忘曲线为每个知识点安排复习时点，到期提醒。
  - **费曼笔记**：用自己的话写下对知识点的讲解，检验是否真的理解。
  - **掌握度自评**：对每个知识点自评掌握程度，与做题数据共同构成学习进度。
- **学习进度本地保存**：全部进度、笔记、错题均存储在浏览器 localStorage 中，数据留在你自己的设备上。

## 本地使用方式

无需安装任何东西：

1. 下载或克隆本仓库；
2. **双击 `index.html`** 即可在浏览器中打开学习地图。

- 支持 `file://` 协议直接打开，不依赖任何本地服务器；
- **断网完全可用**：站点不请求任何外部资源，所有数据、脚本、样式均为本地文件；
- 学习进度保存在浏览器 localStorage，清空浏览器数据会清空进度，请知悉。

> 推荐 Chrome / Edge / Safari 等现代浏览器。另有 `selftest.html` 页面可用于自检站点核心功能是否正常。

## 目录结构

```
big_front_knowledge/
├── index.html              # 学习地图首页（入口）
├── wrongbook.html          # 错题本
├── selftest.html           # 站点自检页
├── QA_REPORT.md            # 站点 QA 检查报告
├── assets/
│   ├── css/site.css        # 全站样式
│   ├── data/curriculum.js  # 课程总数据（51 个知识点的唯一数据源，挂载 window.CURRICULUM）
│   └── js/
│       ├── site.js         # 站点通用逻辑（导航、渲染等）
│       ├── quiz-engine.js  # 做题与判题引擎
│       └── progress-store.js # 学习进度 / 错题 / 笔记 / 复习计划本地存储
└── pages/
    ├── _template.html      # 知识点页面模板
    ├── m1/ … m7/           # 七大模块，共 51 个知识点页面
    └── …
```

## 技术约束说明

本站遵循**零构建、零依赖、零外链**原则：

- **零构建**：没有任何打包、编译步骤，源码即产物，HTML/CSS/JS 原样可运行；
- **零依赖**：不使用任何第三方库、框架或包管理器，不依赖 Node.js / npm；
- **零外链**：不引用任何 CDN、字体、图片、统计脚本等外部资源，**断网可用**，无隐私外泄风险。

课程数据集中在 `assets/data/curriculum.js`（挂载 `window.CURRICULUM`，无 import/export），新增或修改知识点只需编辑该文件与对应页面。

## GitHub Pages 部署

本站是纯静态站点，可直接部署到 GitHub Pages。

### 方式一：GitHub 网页 UI（手动）

1. 在 GitHub 上新建一个仓库（例如 `big-front-knowledge`），不要初始化 README；
2. 在本地站点根目录执行：
   ```bash
   git init -b main
   git add .
   git commit -m "首次提交：大前端全栈成长地图静态学习站"
   git remote add origin git@github.com:<你的用户名>/big-front-knowledge.git
   git push -u origin main
   ```
3. 打开仓库页面，进入 **Settings → Pages**；
4. 在 **Build and deployment → Source** 选择 **Deploy from a branch**；
5. **Branch** 选择 `main`，目录选择 `/ (root)`，点击 **Save**；
6. 等待 1~2 分钟构建完成，访问 `https://<你的用户名>.github.io/big-front-knowledge/` 即可。

### 方式二：gh CLI（命令行）

前提：已安装并登录 [GitHub CLI](https://cli.github.com/)（`gh auth login`）。

```bash
# 在站点根目录执行：创建公开仓库并推送当前目录
gh repo create big-front-knowledge --public --source=. --push

# 开启 GitHub Pages（main 分支根目录作为站点来源）
gh api repos/<你的用户名>/big-front-knowledge/pages \
  -X POST \
  -f "source[branch]=main" \
  -f "source[path]=/"

# 查看部署状态
gh api repos/<你的用户名>/big-front-knowledge/pages
```

部署完成后访问 `https://<你的用户名>.github.io/big-front-knowledge/`。

> 后续更新站点时，只需修改文件后 `git add . && git commit -m "更新内容" && git push`，Pages 会自动重新部署。
