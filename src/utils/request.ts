import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { MessagePlugin, DialogPlugin, NotificationPlugin } from 'tdesign-react'
import xhmConfigures from 'configs/xhmHeaders'
import envHosts from 'configs/host'
import { LOCAL_REFTOKEN, APP_VERSION, TOKEN_EXPIRE, TOKEN_REFEXPIRE } from 'configs/const'
import { setToken, getToken, removeToken, isTokenExpire } from 'utils/auth'

export interface IAxiosRequestConfig extends AxiosRequestConfig {
  url: string
  async?: boolean
  config?: object
}

export interface IResponse {
  code?: any
  success?: boolean
  message?: string
  statusText: string
}

export interface IAxiosResponse extends IResponse, AxiosResponse {
  message?: string
  data: any
}

export interface IErrorAxiosResponse extends IResponse {
  data?: any
}

const env = import.meta.env.MODE || 'development'

// 请求Base
export const API_HOST = envHosts[env].API
console.log('env', env, API_HOST)
// 请求代理转发拼接路径
export const URI_ENV_PRE = envHosts[env].PRE || ''

// 是否正在刷新的标志
let isTokenRefreshing = false
// 存储请求的数组
let subscribesArr: Function[] = []
// 请求push到数组中
function subscribesArrRefresh(cb: Function) {
  subscribesArr.push(cb)
}
// 用新token发起请求
function reloadSubscribesArr(newToken: string) {
  while (subscribesArr.length) {
    const cb = subscribesArr.shift()
    cb?.(newToken)
  }
}

function reconstructData(resp: any = {}): Partial<IAxiosResponse> {
  const { state, code, msg, message } = resp?.status?.constructor === Object ? resp.status : resp
  const tCode = parseInt(code || state, 10) || 2000

  return {
    code: tCode,
    success: tCode === 2000,
    message: msg || message || '',
    data: resp.data || {},
  }
}

// 退出
function logOut({ message }: Partial<{ message: string }> = {}) {
  // 请求失败，清空缓存，弹出提示返回登录页
  isTokenRefreshing = false
  subscribesArr = []
  window.sessionStorage.clear()
  window.localStorage.clear()
  removeToken()

  const handleLogout = () => {
    if (/\/login$/i.test(window.location.pathname) === false) {
      /** 不破坏数据结构 登录态清除移到登录界面去进行 */
      const { BASE_URL, VITE_SUBMODE } = import.meta.env
      const loginUri = `${BASE_URL}login`

      if (VITE_SUBMODE === 'true') {
        window.history.pushState(null, '', loginUri)
      } else {
        window.location.href = loginUri
      }
    }
  }
  setTimeout(handleLogout, 2e3)

  if (message) {
    MessagePlugin.warning(message)
  }
}

export const instance = axios.create({
  baseURL: API_HOST,
  headers: xhmConfigures.headers,
  timeout: xhmConfigures.timeout,
  withCredentials: xhmConfigures.withCredentials,
})

// request 拦截器
instance.interceptors.request.use(
  (config: any) => {
    const token = getToken()
    const serverTokenExpire = localStorage.getItem(TOKEN_EXPIRE)
    const clientVersion = localStorage.getItem(APP_VERSION)

    config.headers['X-Client-Version'] = clientVersion
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 3. 合并hearder头参数
    if (config.config) {
      config.headers = {
        ...config.headers,
        ...config.config,
      }
    }
    if (config.params && config.params.responseType) {
      config.headers.responseType = config.params.responseType
      delete config.params.responseType
    }

    if (/^get$/i.test(config.method)) {
      if (config.data && !config.params) {
        config.params = config.data
      }
    }

    // 判断token是否过期
    if (
      serverTokenExpire &&
      isTokenExpire(serverTokenExpire) &&
      !config.url.includes(`/ms/user/refresh`) &&
      !config.url.includes(`/randomCode`) &&
      !config.url.includes(`/login`)
    ) {
      const serviceRefreshToken = localStorage.getItem(LOCAL_REFTOKEN)
      const serverRefreshTokenExpire = localStorage.getItem(TOKEN_REFEXPIRE)

      // 判断refreshToken是否过期
      if (serviceRefreshToken && isTokenExpire(serverRefreshTokenExpire) === false) {
        if (!isTokenRefreshing) {
          isTokenRefreshing = true
          axios.defaults.baseURL = API_HOST

          axios
            .post(
              '/ms/user/refresh',
              {
                refreshToken: serviceRefreshToken,
              },
              {
                headers: config.headers,
              },
            )
            .then((response) => {
              isTokenRefreshing = false
              const { code, data } = reconstructData(response.data)
              if (code === 2000) {
                // 重新存储token，以及过期时间
                setToken(data.accessToken)
                localStorage.setItem(LOCAL_REFTOKEN, data.refreshToken)
                localStorage.setItem(TOKEN_EXPIRE, data.accessTokenTimeout)
                localStorage.setItem(TOKEN_REFEXPIRE, data.refreshTokenTimeout)
                reloadSubscribesArr(data.accessToken)
              } else {
                // 请求失败，清空缓存，弹出提示返回登录页
                isTokenRefreshing = false
                logOut({ message: '登录已失效 请重新登录' })
              }
            })
            .catch((error) => {
              // 请求失败，清空缓存，弹出提示返回登录页
              isTokenRefreshing = false
              logOut(error)
            })
        } else {
          const retry = new Promise((resolve) => {
            subscribesArrRefresh((newToken: string) => {
              config.headers.Authorization = `Bearer ${newToken}`
              resolve(config)
            })
          })
          return retry
        }
      } else {
        logOut({ message: '登录已失效 请重新登录' })
        return Promise.reject(new Error('interrupt'))
      }
    }
    return config
  },

  (error) => {
    // 请求错误时
    console.log('接口响应:', error)
    // 1. 请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      console.log('timeout请求超时')
    }

    return Promise.reject(error)
  },
)

// response 拦截器
instance.interceptors.response.use(
  // eslint-disable-next-line consistent-return
  (response) => {
    let resp
    // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
    if (response.data === undefined) {
      resp = JSON.parse(response.request.responseText)
    } else {
      resp = response.data
    }

    // 假如返回的是文件流格式，直接返回
    if (response.config.responseType === 'blob') {
      return { blob: resp, headers: response.headers }
    }
    if (response.config.responseType === 'json') {
      return resp
    }

    const respObj = reconstructData(resp)

    if (respObj.code !== 2000) {
      MessagePlugin.closeAll()
      /**
       * 2001: 服务异常
       * 2003: 无token
       * 2004: 未知访问
       * 2005: token无效或过期
       * 2006: 无权限
       * 2007: 账号停用
       */
      if (respObj.code === 2005 || respObj.code === 2003) {
        logOut({ message: /\/login/i.test(window.location.pathname) ? '' : respObj.message })
      } else if (respObj.code === 2007) {
        logOut({ message: respObj.message })
      } else if (respObj.code === 2006) {
        DialogPlugin({
          header: '无操作权限',
          body: `请联系管理员在「组织管理」/「账号管理」/「关联角色」中添加权限「${respObj.data?.authCode}」`,
          attach: 'div[class^="pageContent"] *',
          showInAttachedElement: true,
          footer: false,
          closeBtn: null,
          zIndex: 9999,
        })
      } else if (respObj.data?.desc) {
        NotificationPlugin.error({
          title: respObj.message,
          content: respObj.data.desc,
          offset: ['calc(180px - 50vw)', 20],
          footer: false,
          closeBtn: null,
        })
      } else {
        MessagePlugin.error(respObj.message || '服务异常 请稍后重试', 5e3)
      }

      return Promise.reject(new Error(respObj.message || '服务异常 请稍后重试'))
    }

    return respObj
  },
  (err) => {
    if (err && err.response) {
      /** 404接口服务端返回数据兼容 */
      err.code = err.response.data?.code || err.response.status || err.code
      err.response.status = err.code

      switch (err.response.status) {
        case 401:
          err.message = /\/login/i.test(window.location.pathname) ? '' : '未授权，请登录'
          logOut()
          break
        case 403:
          err.message = '拒绝访问，联系管理员授权'
          break
        case 404:
          err.message = `请求地址出错: ${err.config.url}`
          break
        default:
          break
      }
    }

    if (err.message && err.message !== 'interrupt') {
      // 如果是手动中断请求就不提示
      MessagePlugin.error(err.message, 5e3)
    }

    return Promise.reject(err)
  },
)

export default (options: IAxiosRequestConfig) => {
  // @ts-ignore  环境变量
  if (!/^http(s?):\/\//.test(options.url)) {
    options.url = URI_ENV_PRE + options.url
  }

  if ('async' in options === false) {
    options.async = true
  }

  return instance(options)
    .then((res: IAxiosResponse): Promise<IAxiosResponse> | any =>
      options.responseType ? res : Promise.resolve({ ...res, code: parseInt(res.code || 2000, 10) }),
    )
    .catch(
      (error: IErrorAxiosResponse): Promise<IErrorAxiosResponse> =>
        options.async
          ? Promise.resolve({
              code: parseInt(error.code || 2001, 10),
              success: false,
              statusText: error.statusText,
              message: error.message || error.statusText,
            })
          : Promise.reject(error),
    )
}
