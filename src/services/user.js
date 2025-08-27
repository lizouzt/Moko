import axios from 'utils/request'

/*
 * 用户中心
 */

// 获取用户信息
export const getUserInfo = (params = {}) =>
  axios({
    url: '/user/login',
    method: 'post',
    data: params,
  })

// 修改密码
export const modifyPwd = (data = {}, config = {}) =>
  axios({
    url: `/user/modify`,
    method: 'post',
    data,
    config,
  })
// 授权配置接口
export const getAuthority = () =>
  axios({
    url: '/user/auth',
    method: 'post',
  })
