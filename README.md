# Kids Typing Practice

儿童英文打字练习网页（React + Vite），纯前端、无登录、无后端。当前为**零基础指法练习模式**：从主键位与键位组合开始，再进入单词与句子。

## 环境要求

- [Node.js](https://nodejs.org/) 18+（建议 LTS）
- npm（随 Node 安装）

## 安装与运行

在项目根目录执行：

```bash
npm install
```

开发模式（热更新）：

```bash
npm run dev
```

终端会显示本地地址（一般为 `http://localhost:5173`），在浏览器中打开即可。

生产构建：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## 功能说明

- 首页：英文引导文案与 **Start**，进入阶段选择。
- 六个阶段（文案与练习条在 `src/data/lessons.js`）：
  - Step 1: Home Row（默认选中）
  - Step 2: Top Row
  - Step 3: Bottom Row
  - Step 4: Numbers
  - Step 5: Words（界面标注为后续阶段）
  - Step 6: Sentences（界面标注为后续阶段）
- 练习页：顶部显示当前阶段名称、键位提示区、进度条、**Next Exercise** / **Repeat**，打字区保持绿/红高亮。
- 结束后：**Time Used**、**Accuracy**、**WPM**、鼓励语，以及 **Restart** / **Back Home**。

## 技术栈

- React 18
- Vite 5
