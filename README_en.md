## Moko is a free Markdown editor and preview tool based on Electron + Vite + React. It supports multi-platform packaging, features a clean interface, and practical functions, making it ideal for developers and content creators.

## Features

- **Markdown Editing & Live Preview**  
  Supports standard Markdown syntax, real-time rendering preview, and code block highlighting (`highlight.js`).
- **Auto Save & File Management**  
  Automatically saves editing content and supports file list management.
- **Theme Switching**  
  Supports light and dark themes, with customizable code highlight styles.
- **Security**  
  Uses CSP to restrict script sources and prevent XSS attacks.
- **Multi-Platform Packaging**  
  Supports one-click packaging and publishing for major platforms including Windows (Squirrel), macOS (ZIP), and Linux (Deb/Rpm).

## Project Structure

```
.
├── forge.config.ts           # Electron Forge configuration for packaging, plugins, publishing, etc.
├── package.json              # Project dependencies and scripts
├── index.html                # App entry HTML
├── src/                      # Source code directory
│   ├── main.ts               # Electron main process entry
│   ├── preload.ts            # Preload script
│   ├── renderer.tsx          # Renderer process entry (React)
│   ├── app/                  # Core application modules
│   │   ├── components/       # React components
│   │   ├── configs/          # Configuration files
│   │   ├── services/         # Business services
│   │   ├── utils/            # Utility functions
│   │   └── ...               
│   └── utils/                # General utilities
│       ├── serialize.js      # Serialization utilities
│       ├── request.ts        # Network request wrapper
│       └── sm3/              # SM3 cryptographic algorithm implementation
├── .vite/                    # Vite build output
└── public/                   # Static assets
```

## Main Configuration Files

- forge.config.ts:  
  Configures Electron Forge packaging, plugins (such as Vite, Fuses), publishing (e.g., GitHub Release), etc.
- vite.renderer.config.ts:  
  Configures Vite build parameters for the renderer process (React).
- config.tsx:  
  Editor auto-save, code highlighting, markdown-it configuration, etc.

## Development Workflow

1. **Install Dependencies**

   ```sh
   npm install
   ```

2. **Local Development**

   Start Electron + Vite with hot reload:

   ```sh
   npm run start
   ```

   Or start only the renderer process (React):

   ```sh
   npm run dev
   ```

3. **Build**

   Build for production:

   ```sh
   npm run build
   ```

   Package the Electron app with Electron Forge:

   ```sh
   npm run package
   npm run make
   ```

4. **Release**

   Automatically publish to GitHub Release:

   ```sh
   npm run publish
   ```

5. **Code Style & Linting**

   Use ESLint to check code style:

   ```sh
   npm run lint
   ```

## Dependencies

- [Electron](https://www.electronjs.org/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Electron Forge](https://www.electronforge.io/)
- [highlight.js](https://highlightjs.org/)
- [markdown-it](https://github.com/markdown-it/markdown-it)

## Contribution Guide

Contributions are welcome! Please follow the MIT License and community guidelines.

1. Fork this repository and create a branch
2. Commit your code and submit a Pull Request
3. Wait for the maintainers to review and merge

## License

MIT

---

**Project Entry Files:**  
- Main process: src/main.ts  
- Renderer process: src/renderer.tsx  
- Configuration: forge.config.ts  
- Main configuration: src/app/config.tsx