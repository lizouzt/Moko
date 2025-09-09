import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ETheme } from 'types/index.d'
import { Color } from 'tvision-color'
import { CHART_COLORS, defaultColor, colorMap } from 'configs/color'
import { generateColorMap, insertThemeStylesheet } from 'utils/color'
import { RootState } from '../store'
import i18next from 'i18n/config'

const namespace = 'global'

export enum ELayout {
  side = 1,
  top,
  mix,
  fullPage,
}

export enum Platform {
  PC,
  MOBILE,
}

export interface IGlobalState {
  platform: Platform

  loading: boolean
  collapsed: boolean
  /**
   * 是否显示面包屑导航
   */
  setting: boolean
  color: string
  /**
   * 主题：深色 浅色
   */
  theme: ETheme
  /**
   * 是否开启跟随系统主题
   */
  systemTheme: boolean
  layout: ELayout
  isFullPage: boolean
  showHeader: boolean
  showBreadcrumbs: boolean
  showFooter: boolean
  /** @type {boolean} 任务中心显控 */
  showTaskCenter: boolean
  /** @type {boolean} 下载中心 */
  showDCenter: boolean
  chartColors: Record<string, string>
  /** Menu module移过来的 */
  siteMap: Record<string, boolean>
  btnAuthMap: Record<string, boolean>
  /**
   * DTO表格配置
   */
  dtoTable: {
    /**
     * 表格尺寸
     * @default small
     */
    size?: 'small' | 'medium' | 'large'
    /**
     * 是否显示斑马纹
     * @default false
     */
    stripe?: boolean
    /**
     * 是否显示表格边框
     * @default false
     */
    bordered?: boolean
  },
  language: 'zh' | 'en',
}

const defaultTheme = ETheme.light

const isSubMode = import.meta.env.VITE_SUBMODE === 'true'

const isMobile = () => window.document?.documentElement?.clientWidth <= 450

const initialState: IGlobalState = {
  platform: isMobile() ? Platform.MOBILE : Platform.PC,
  loading: true,
  collapsed: true || window.innerWidth < 900, // 宽度小于1000 菜单闭合
  setting: false,
  theme: defaultTheme,
  systemTheme: false,
  layout: isSubMode ? ELayout.fullPage : ELayout.mix,
  isFullPage: true,
  color: defaultColor?.[0],
  showHeader: true,
  showBreadcrumbs: true,
  showFooter: false,
  showTaskCenter: false,
  showDCenter: false,
  chartColors: CHART_COLORS[defaultTheme],
  language: 'zh',
  siteMap: {},
  btnAuthMap: {},
  dtoTable: {
    bordered: true,
    stripe: true,
    size: 'small',
  },
}

const SETTINGCACHEKEY = '_tenfake_starter_global_settings'

// 创建带有命名空间的 reducer
const globalSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    setSiteMap: (state, { payload }: { payload: any }) => {
      state.siteMap = payload.siteMap
    },
    cacheSetting: (state) => {
      localStorage.setItem(SETTINGCACHEKEY, JSON.stringify({ ...state, showHeader: true }))
    },
    restoreSetting: (state) => {
      const cacheData = localStorage.getItem(SETTINGCACHEKEY)

      let setting: Partial<IGlobalState> = {}

      if (cacheData) {
        try {
          setting = JSON.parse(cacheData)
        } catch {
          localStorage.removeItem(SETTINGCACHEKEY)
        }
      }

      if (setting.color) {
        state.color = setting.color
      }

      if (setting.theme) {
        state.theme = setting.theme
      }

      if (setting.dtoTable) {
        state.dtoTable = { ...state.dtoTable, ...setting.dtoTable }
      }

      if (setting.language) {
        state.language = setting.language
      }
    },
    toggleMenu: (state, action) => {
      if (action.payload === null) {
        state.collapsed = !state.collapsed
      } else {
        state.collapsed = !!action.payload
      }
    },
    toggleSetting: (state) => {
      state.setting = !state.setting
    },
    toggleShowHeader: (state, action: { type: string; payload?: boolean }) => {
      state.showHeader = action.payload !== undefined ? action.payload : !state.showHeader
    },
    toggleShowBreadcrumbs: (state) => {
      state.showBreadcrumbs = !state.showBreadcrumbs
    },
    toggleShowFooter: (state) => {
      state.showFooter = !state.showFooter
    },
    switchDTO: (state, action) => {
      if (action?.payload) {
        state.dtoTable = { ...state.dtoTable, ...action?.payload }
      }
    },
    switchTheme: (state, action: PayloadAction<ETheme>) => {
      const finalTheme = action?.payload
      // 切换 chart 颜色
      state.chartColors = CHART_COLORS[finalTheme]
      // 切换主题颜色
      state.theme = finalTheme
      // 关闭跟随系统
      state.systemTheme = false
      document.documentElement.setAttribute('theme-mode', finalTheme)
    },
    openSystemTheme: (state) => {
      const media = window.matchMedia('(prefers-color-scheme:dark)')
      if (media.matches) {
        const finalTheme = media.matches ? ETheme.dark : ETheme.light
        state.chartColors = CHART_COLORS[finalTheme]
        // 切换主题颜色
        state.theme = finalTheme
        state.systemTheme = true
        document.documentElement.setAttribute('theme-mode', finalTheme)
      }
    },
    switchColor: (state, action) => {
      if (action?.payload) {
        const { payload } = action
        state.color = payload
        const mode = state.theme

        let colorType = colorMap?.[payload]
        if (!colorType) {
          colorType = payload
          const newPalette = Color.getPaletteByGradation({
            colors: [colorType],
            step: 10,
          })[0]
          const newColorMap = generateColorMap(colorType, newPalette, mode)
          insertThemeStylesheet(colorType, newColorMap, mode)
        }

        document.documentElement.setAttribute('theme-color', colorType || '')
      }
    },
    switchLayout: (state, action) => {
      if (action?.payload) {
        state.layout = action?.payload
      }
    },
    switchFullPage: (state, action) => {
      state.isFullPage = !!action?.payload
    },
    switchTaskCenter: (state, action: PayloadAction<boolean>) => {
      state.showTaskCenter = !!action.payload
    },
    switchDCenter: (state, action: PayloadAction<boolean>) => {
      state.showDCenter = !!action.payload
    },
    updatePlatform: (state) => {
      state.platform = isMobile() ? Platform.MOBILE : Platform.PC
    },
    toggleLanguage: (state) => {
      const nextLanguage = state.language === 'zh' ? 'en' : 'zh'
      state.language = nextLanguage
    }
  },
  extraReducers: () => {},
})

export const selectGlobal = (state: RootState) => state[namespace]

export const {
  toggleMenu,
  toggleSetting,
  toggleShowHeader,
  toggleShowBreadcrumbs,
  toggleShowFooter,
  switchTaskCenter,
  switchDCenter,
  switchTheme,
  switchColor,
  switchLayout,
  switchFullPage,
  openSystemTheme,
  cacheSetting,
  restoreSetting,
  updatePlatform,
  switchDTO,
  setSiteMap,
  toggleLanguage,
} = globalSlice.actions

export default globalSlice.reducer
