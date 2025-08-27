import { rmSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('defineConfig', command, mode, env)
  const sourcemap = command === 'serve' || !!process.env.VSCODE_DEBUG

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        assets: path.resolve(__dirname, './src/assets'),
        components: path.resolve(__dirname, './src/components'),
        configs: path.resolve(__dirname, './src/configs'),
        modules: path.resolve(__dirname, './src/modules'),
        layouts: path.resolve(__dirname, './src/layouts'),
        app: path.resolve(__dirname, './src/app'),
        styles: path.resolve(__dirname, './src/styles'),
        utils: path.resolve(__dirname, './src/utils'),
        services: path.resolve(__dirname, './src/services'),
        types: path.resolve(__dirname, './src/types'),
        hooks: path.resolve(__dirname, './src/hooks'),
      }
    },

    css: {
      devSourcemap: true,
      preprocessorOptions: {
        less: {
          modifyVars: {
            // 如需自定义组件其他 token, 在此处配置
          },
        },
      }
    },
    plugins: [
      svgr({include: "**/*.svg?component"}),
      react(),
    ],
    build: {
      manifest: true,
      sourcemap: sourcemap,
      cssCodeSplit: false,
      assetsInlineLimit: 2046,
      reportCompressedSize: true,
    },
    clearScreen: false,
  }
})
