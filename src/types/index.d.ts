import { BaseTableCol } from 'tdesign-react'

export enum ETheme {
  light = 'light',
  dark = 'dark',
}

export enum ESettingTheme {
  system,
}

export type ButtonAuthMap = Record<string, string>

export enum FuncType {
  MENU = 0,
  PAGE,
  BUTTON,
}

export interface Auhtority {
  /** 权限码 */
  key: string
  /** 权限名 */
  name: string
  /** 权限类型 0一级路由 1二级路由 2操作 */
  type: FuncType
}

export interface AuhtorityTree extends Auhtority {
  children?: AuhtorityTree[]
}

export type MenuAuthMap = Record<string, AuhtorityTree>

export enum ModelQueryComp {
  useless = 0,
  INPUT = 1,
  SELECT = 2,
  TEXTAREA = 3,
  DATE = 4,
  DATETIME,
  DATERANGE,
  MULTIPLESELECT = 7,
  INFOITEM,
  TREESELECT,
  MULTIPLETREESELECT = 10,
  CASCADER,
  TAGINPUT,
  RADIO,
  H1TAG = 14,
  H2TAG,
  TIME,
  INPUTNUMBER = 17,
  SWITCH,
}

export type IOption = {
  value?: string | number
  label: string
  disabled?: boolean
  children?: IOption[]
}

export interface AppInfoConfig {
  name: string
  version: string
  decs: string
  load: boolean
}

/** 数据模型Code 表名 */
export type ModelCode = string

export type ModelQuery = {
  name: string
  code: ModelCode | ModelCode[]
  /** 1-文本框 2-下拉框 3-富文本框 4-日期 5-日期时间 6-日期时间区间 7-多选下拉框 8-Info 9-树选择框 10-树多选 */
  widgetType?: ModelQueryComp
  /** 业务非通用数据请求函数 Promise<SelectOption[]> 优先级高于dictKey */
  asyncQuery?: (params: any) => Promise<SelectOption[]>
  /** 字典接口key */
  dictKey?: string
  /** 字典过滤 */
  dictFilter?: (item: Record<string, any>) => boolean
  /** 关联简直 */
  connected?: string[]
  /** 组件透传Props */
  orgProps?: any
  /** 输入框placeholder */
  placeholder?: string
  /** label宽度 默认108 */
  labelWidth?: number | string
  /** 不限制 FormItem content 的宽度 */
  autoWidth?: boolean
}

export interface ModelForm extends ModelQuery {
  /** 是否可编辑 */
  canUpdate?: number
  /** 数据项描述 */
  comment?: string
  /** 是否必填 */
  required?: number
  /** Reg String */
  checkRule?: string | RegExp
  /** 值长度 */
  length?: number
  /** 精度 */
  scale?: number
  /** 错误提示文案 */
  validErrorMsg?: string
}

export enum DtoCellType {
  /** 文字 */
  TEXT = 0,
  /** 图片地址 */
  IMAGE = 1,
  /** 枚举值 */
  DICT = 2,
  /** 链接地址 */
  LINK = 3,
  TAG = 4,
  /**
   * 切换开关.需配合 ModeDto[statusEnum|operation] 属性使用
   * */
  SWITCH = 5,
}

export type ModelDto = {
  /** 表title */
  name: string
  /** 字段key */
  code: string
  /** 展示类型 优先级低于cell 默认: 0 */
  type?: DtoCellType
  /** 枚举值类型的 IOption列表 */
  options?: IOption[]
  /** 字典接口key */
  dictKey?: string

  /**
   * 状态值枚举 只支持ACTIVE|NEGATIVE两个状态值的类型
   * 目前适配[DtoCellType.SWITCH]类型使用
   * */
  statusEnum?: Record<'ACTIVE' | 'NEGATIVE', number>
  /**
   * 单元操作标识
   * 目前适配[DtoCellType.SWITCH]类型使用
   */
  operation?: string | Record<number, string>
} & BaseTableCol

export interface ModelTableConfig {
  /** 数据查询功能 */
  query: ModelQuery[]
  /** 编辑数据项 */
  form: ModelForm[]
  /** 展示数据项 */
  dto: ModelDto[]
}

export type ModelConfigure = {
  /** table名 */
  code: ModelCode
  /** 名称 */
  name: string
  /** 数据模型form/dto/query */
  modelData: ModelTableConfig
}

interface FlowConfigure {
  /** 业务模型添加到应用中后的唯一标示 */
  code: string
  /** 业务模型添加到应用中后的唯一标示 前端只需要保证唯一性的前提下知道这个业务模块被启用了就行 */
  name: string
  /** 一级功能图标 */
  icon?: string
  /** 业务数据表 */
  models?: ModelConfigure[]
}
