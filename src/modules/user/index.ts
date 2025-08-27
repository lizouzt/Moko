import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { doSM3 } from 'utils/sm3/js/index.js'
import { setToken, removeToken } from 'utils/auth'
import { LOCAL_REFTOKEN, TOKEN_EXPIRE, TOKEN_REFEXPIRE } from 'configs/const'
import { RootState } from '../store'
import { doLogin, getUserInfo } from 'services/login'

const namespace = 'user'

/**
 * 登录账号信息数据字段
 */
type UserInfoKeys =
  | 'id'
  | 'avatar'
  | 'mobile'
  | 'name'

type UserBaseInfo = Partial<Record<UserInfoKeys, any>>

export enum UserStatus {
  /** 正常 */
  '正常' = 0,
  /** 冻结 */
  '停用' = 1,
}

/** 账号类型 */
export enum UserLevel {
  '普通用户',
  '超级管理员',
}

export interface UserInfo extends UserBaseInfo {
  status: UserStatus
  level: UserLevel
}

interface InitialState {
  loading: boolean
  userInfo: Partial<UserInfo>
}

export interface LoginFormData {
  /** @type {string} 登录名 */
  username: string
  /** 登录密码 */
  password: string
  /** @type {number} 验证码 */
  code: number
  /** @type {string} sessionId */
  randomId?: string
  /** @type {string} PC版本号 */
  version?: string
}

const initialState: InitialState = {
  loading: false,
  userInfo: {
    id: 111,
    mobile: 1988998888,
    name: '天气热'
  },
}

export const login = createAsyncThunk(`${namespace}/login`, async (userInfo: LoginFormData) => {
  const { password } = userInfo

  const { data: tokenInfo, code, message } = await doLogin({ ...userInfo, password: doSM3(password) })

  if (code === 2000) {
    return tokenInfo
  }

  throw new Error(message)
})

export const getUser = createAsyncThunk(`${namespace}/getUserInfo`, async () => {
  const res = await getUserInfo()

  if (res.code === 2000) {
    return res.data
  }
  throw new Error(res.message)
})

export const getPermission = createAsyncThunk(`${namespace}/getPermission`, async () => true)

const userSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    logout: (state) => {
      removeToken()
      state.userInfo = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        const { payload } = action

        setToken(payload.accessToken)
        localStorage.setItem(LOCAL_REFTOKEN, payload.refreshToken)
        localStorage.setItem(TOKEN_EXPIRE, payload.accessTokenTimeout)
        localStorage.setItem(TOKEN_REFEXPIRE, payload.refreshTokenTimeout)
      })
      .addCase(login.rejected, (state) => {
        state.loading = false
        removeToken()
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userInfo = action.payload
      })
      .addCase(getUser.rejected, (state) => {
        state.userInfo = {}
        removeToken()
      })
  },
})

export const selectUser = (state: RootState) => state[namespace]

export const { logout } = userSlice.actions

export default userSlice.reducer
