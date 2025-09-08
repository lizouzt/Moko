declare module '*.avif' {
  export default src as string
}

declare module '*.bmp' {
  export default src as string
}

declare module '*.gif' {
  export default src as string
}

declare module '*.jpg' {
  export default src as string
}

declare module '*.jpeg' {
  export default src as string
}

declare module '*.png' {
  export default src as string
}

declare module '*.webp' {
  export default src as string
}

declare module '*.svg' {
  export default src as string
}
declare module '*.svg?component' {
  export default src as string
}
declare module '*.module.css' {
  export default classes as { readonly [key: string]: string }
}

declare module '*.module.less' {
  export default classes as { readonly [key: string]: string }
}

declare module '*.less' {
  export default classes as { readonly [key: string]: string }
}

declare module 'tvision-color'

declare type Styles = CSSProperties

declare type FormResetEvent = FormEvent<HTMLFormElement>
declare type FormSubmitEvent = FormEvent<HTMLFormElement>
declare type ImageEvent<T = any> = import('react').SyntheticEvent<T>
declare type IObject = Record<string, any>

declare type OptionData = {
  label?: string
  value?: string | number
} & { [key: string]: any }

declare type TreeOptionData = {
  children?: Array<TreeOptionData>
} & OptionData

declare type ClassName = { [className: string]: any } | ClassName[] | string

declare type CSSSelector = string

/** 一个状态属性的状态值对应的Tag主题色字典 */
declare type StateThemeMap = Record<number, import('tdesign-react').TdTagProps['theme']>
/** 一个状态属性的状态值对应的中文字典 */
declare type StateLabelMap = Record<number, string>

/** 各状态属性 对应的 StateThemeMap 字典 */
declare type StateThemeMapDict = Record<string, StateThemeMap>

/** 各状态属性 对应的 中文 字典 */
declare type StateLabelMapDict = Record<string, StateLabelMap>

import { app, ipcRenderer } from 'electron'

declare global {
  interface Window {
    electron: {
      process: NodeJS.Process,
      getAppVersion: () => string,
      quitApp: () => void,
      ipcRenderer: typeof ipcRenderer,
    }
  }
}

interface ImportMeta {
  env: {
    url: string
    MODE: 'development' | 'test' | 'production'
    BASE_URL: string
    /** true表示是从主应用开发 */
    VITE_SUBMODE?: string
  }
}