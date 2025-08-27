import request from 'utils/request'

/*
 * 系统登录模块
 */
// 获取图片验证码   走本地代理写法
export function getImgCode(data = {}, config = {}) {
  return request({
    url: '/user/randomCode',
    method: 'post',
    data,
    config,
  })
}

// 登录
export const doLogin = (data = {}, config = {}) =>
  request({
    url: '/user/login',
    method: 'post',
    async: false,
    data,
    config,
  })

// 登出
export const logout = (data = {}, config = {}) =>
  request({
    url: '/user/logout',
    method: 'get',
    data,
    config,
  })

// 获取用户信息
export const getUserInfo = (params = {}) =>
  request({
    url: '/user/get',
    method: 'post',
    data: params,
  })
