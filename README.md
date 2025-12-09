## Moko 是一个基于 Electron + Vite + React 的免费 Markdown 编辑与预览工具，支持多平台打包，界面简洁，功能实用，适合开发者和内容创作者使用。

## 功能特性

- **Markdown 编辑与实时预览**  
  支持标准 Markdown 语法，实时渲染预览，支持高亮显示代码块（`highlight.js`）。
- **自动保存与文件管理**  
  自动保存编辑内容，支持文件列表管理。
- **主题切换**  
  支持浅色和深色主题，代码高亮样式可自定义。
- **安全性**  
  采用 CSP 限制脚本来源，防止 XSS 攻击。
- **多平台打包**  
  支持 Windows（Squirrel）、macOS（ZIP）、Linux（Deb/Rpm）等主流平台一键打包发布。

## 项目结构

```
.
├── forge.config.ts           # Electron Forge 配置，定义打包、插件、发布等
├── package.json              # 项目依赖与脚本
├── index.html                # 应用入口 HTML
├── src/                      # 源码目录
│   ├── main.ts               # Electron 主进程入口
│   ├── preload.ts            # 预加载脚本
│   ├── renderer.tsx          # 渲染进程入口（React）
│   ├── app/                  # 应用核心模块
│   │   ├── components/       # React 组件
│   │   ├── configs/          # 配置项
│   │   ├── services/         # 业务服务
│   │   ├── utils/            # 工具函数
│   │   └── ...               
│   └── utils/                # 通用工具
│       ├── serialize.js      # 序列化相关
│       ├── request.ts        # 网络请求封装
│       └── sm3/              # 国密 SM3 加密算法实现
├── .vite/                    # Vite 构建输出
└── public/                   # 静态资源
```

## 主要配置说明

- forge.config.ts：  
  配置 Electron Forge 打包、插件（如 Vite、Fuses）、发布（如 GitHub Release）等。
- vite.renderer.config.ts：  
  配置渲染进程（React）的 Vite 构建参数。
- config.tsx：  
  编辑器自动保存、代码高亮、Markdown-it 配置等。

## 开发流程

1. **安装依赖**

   ```sh
   npm install
   ```

2. **本地开发**

   启动 Electron + Vite 热重载开发环境：

   ```sh
   npm run start
   ```

   或仅启动渲染进程（React）：

   ```sh
   npm run dev
   ```

3. **打包构建**

   构建生产环境包：

   ```sh
   npm run build
   ```

   Electron Forge 打包应用：

   ```sh
   npm run package
   npm run make
   ```

4. **发布 Release**

   自动发布到 GitHub Release：

   ```sh
   npm run publish
   ```

5. **代码规范与检查**

   使用 ESLint 检查代码风格：

   ```sh
   npm run lint
   ```

## 依赖技术

- [Electron](https://www.electronjs.org/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Electron Forge](https://www.electronforge.io/)
- [highlight.js](https://highlightjs.org/)
- [markdown-it](https://github.com/markdown-it/markdown-it)

## 贡献指南

欢迎提交 Issue 和 PR！请遵循 MIT License 及社区规范。

1. Fork 本仓库并创建分支
2. 提交代码并发起 Pull Request
3. 等待维护者审核合并

## License

Apache

---

**项目入口文件：**  
- 主进程：src/main.ts  
- 渲染进程：src/renderer.tsx  
- 配置：forge.config.ts  
- 主要配置项：src/app/config.tsx