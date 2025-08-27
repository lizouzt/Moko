type ApiConf = {
  API: string
  PRE?: string
}

const isSubMode = import.meta.env.VITE_SUBMODE === 'true'

export default {
  mock: <ApiConf>{
    // 本地mock数据
    API: '/api',
    PRE: 'wms/ms',
  },
  development: <ApiConf>{
    // 开发环境接口请求
    API: isSubMode ? '/subapi/' : '/api/',
    PRE: 'wms/ms',
  },
  test: <ApiConf>{
    // 测试环境接口地址
    API: 'https://apps.yowubuy.com',
    PRE: 'wms/ms',
  },
  production: <ApiConf>{
    // 正式环境接口地址
    API: 'https://apps.yowubuy.com',
    PRE: 'wms/ms',
  },
  // 不需要登录验证的页面
  authWhiteList: ['/login'],
}
