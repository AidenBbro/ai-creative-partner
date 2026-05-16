# My Project

基于 Vite + React + TypeScript 的项目模板

## 技术栈
- Vite 5
- React 18
- TypeScript
- React Router v6

## 目录结构

```
my-project/
├── src/
│   ├── components/       # 可复用组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   ├── pages/          # 页面组件
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## 使用说明

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 构建生产版本：

```bash
npm run build
```

4. 预览生产构建：

```bash
npm run preview
```

## 导入 Figma 设计稿

你可以使用 Figma 插件（如 Figma to Code、Figma to React）将设计稿转换为代码，然后放入 `components` 或 `pages` 目录中使用。
