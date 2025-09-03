import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from 'modules/store'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'tdesign-react'
import zhConfig from 'tdesign-react/es/locale/zh_CN'
import enConfig from 'tdesign-react/es/locale/en_US'
import merge from 'lodash/merge'
import App from './layouts/index'

import 'tdesign-react/es/style/index.css'
import './styles/theme.less'
import './styles/index.less'
import './index.less'

const defaultLanguageConfig = navigator.language === 'zh-CN' ? zhConfig : enConfig

let appRoot: Root
const renderApp = (mainProps: any = {}) => {
  const htmlContainer = document.getElementById('root') as Element
  appRoot = createRoot(htmlContainer)

  appRoot.render(
    <Provider store={store}>
      <Router basename={'/'}>
          <ConfigProvider globalConfig={merge(defaultLanguageConfig, {})}>
            <App />
          </ConfigProvider>
      </Router>
    </Provider>,
  )
}

renderApp()

// MacOS 上红绿灯默认在标题栏左侧，因此需要将窗口标题文字让开以避免遮挡，这里设为居中。
// 需要注意这里使用了 electron-vite 框架，如果你没有使用该框架，可在 Node 后端将 process.platform 传递给前端进行判断。
// 'darwin' 代表 MacOS
if (window.electron?.process?.platform === 'darwin') {
  document.querySelector('body')?.classList.add('darwin')
}
if (window.electron?.process?.platform === 'linux') {
  document.querySelector('body')?.classList.add('linux')
}