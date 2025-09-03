import { FormRule } from 'tdesign-react'

/** 通用状态值字典 */
export enum COMMONSTATUS {
  ACTIVE = 0,
  NEGATIVE,
}
export const CommonStatusLabel = {
  [COMMONSTATUS.ACTIVE]: '启用',
  [COMMONSTATUS.NEGATIVE]: '停用',
}
/** 通用状态Options */
export const CommonStatusOptions = [
  {
    value: COMMONSTATUS.ACTIVE,
    label: CommonStatusLabel[COMMONSTATUS.ACTIVE],
  },
  {
    value: COMMONSTATUS.NEGATIVE,
    label: CommonStatusLabel[COMMONSTATUS.NEGATIVE],
  },
]

const BaseName = import.meta.env.BASE_URL

/** @type {String} refreshToken */
export const LOCAL_REFTOKEN = `${BaseName}tdesign_refreshToken`
/** @type {String} token */
export const LOCAL_TOKEN = `${BaseName}tdesign_authorization`
/** @type {String} token过期时间 */
export const TOKEN_EXPIRE = `${BaseName}tdesign_expiration`
/** @type {String} 刷新token过期时间 */
export const TOKEN_REFEXPIRE = `${BaseName}tdesign_refreshTokenTimeout`
/** @type {String} PC版本号 appConf文件读取 */
export const APP_VERSION = `${BaseName}tdesign_app_version`

export const ALLSPECIALSTR = '[^\\u4e00-\\u9fa5a-z0-9A-Z]'
export const NOSPECIALSTR = '[0-9a-zA-Z\\u4e00-\\u9fa5]'
export const ZHCNSTR = '[\\u4e00-\\u9fa5]'
export const NAMESTR = '[\\u4e00-\\u9fa5.•]'
export const NOZHCNSTR = '[^\\u4e00-\\u9fa5]'
export const NORMALSTR = '.'
export const NUMLITTERSTR = '[0-9a-zA-Z]'
export const MOBILE = '^1[0-9]{10}$'
export const TELNUMSTR = '^\\d{8,12}$'
export const REMARKRULEREGSTR = `^${NORMALSTR}{0,50}$`
export const PWDREGSTR = `^${NOZHCNSTR}{6,18}$`
export const REGIONRULESTR = `^${ZHCNSTR}{1,20}(-${ZHCNSTR}{1,20}){0,2}?$`

export const TELNUMRULE: FormRule[] = [{ pattern: new RegExp(TELNUMSTR), message: '请输入正确的电话号码' }]
export const REGIONRULE = [{ pattern: new RegExp(REGIONRULESTR), message: '地区格式错误' }]
export const BANKNORULE = [{ pattern: /^[0-9]{0,20}$/, message: '银行卡号错误' }]
export const OBJECTIDRULE = [{ pattern: /^[0-9a-z]{24}$/, message: 'ObjectId格式错误' }]
export const DATERULE = [{ pattern: /^\d{4}-\d{2}-\d{2}$/, message: '日期格式错误YYYY-MM-DD' }]
export const TIMERULE = [
  { pattern: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, message: '时间格式错误YYYY-MM-DD hh:mm:ss' },
]
export const REMARKRULE: FormRule[] = [
  { pattern: new RegExp(REMARKRULEREGSTR), message: '输入字母/数字/中文/特殊字符，最多50位' },
]
export const PASSWORDRULE: FormRule[] = [
  { pattern: new RegExp(PWDREGSTR), message: '请输入6-18位数字/大小写字母/特殊符号' },
]
export const REQUIRED = [{ required: true }]

export const FDERRMSG: FormRule[] = [
  { pattern: /^[0-9.]+$/, trigger: 'blur' },
  { pattern: /^\d+(.\d{1,2})?$/, message: '最多填写两位小数', trigger: 'blur' },
]
export const PHONERULE: FormRule[] = [{ pattern: new RegExp(MOBILE), trigger: 'blur', message: '手机号格式错误' }]
export const NAMERULE: FormRule[] = [
  { pattern: new RegExp(`^${NAMESTR}{2,10}$`), trigger: 'blur', message: '请输入2-10位中文/.•' },
]
export const CARNORULEREGSTR =
  '^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z][-]?(([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[-]?[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$'
export const PARTIALCARNORULEREGSTR =
  '^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{0,1}[a-zA-Z]{0,1}[-]?(([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{0,4})|([0-9]{0,5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{0,1}[A-Z]{0,1}[-]?[A-Z0-9]{0,4}[A-Z0-9挂学警港澳]{0,1})$'
const OSSURLRULESTR = '^(http(s{0,1}):){0,1}//gbuy\\.oss-cn-shanghai\\.aliyuncs\\.com/'

export const CARNORULE: FormRule[] = [
  {
    pattern: new RegExp(CARNORULEREGSTR),
    message: '车牌号格式不正确！',
  },
]
export const IDCARDNORULE: FormRule[] = [
  {
    pattern: /^\d{15}$|^\d{17}([0-9]|X)$/,
    message: '请输入正确的身份证号码',
  },
]
export const IMAGEURLRULE: FormRule[] = [
  {
    pattern: new RegExp(OSSURLRULESTR),
    message: '图片地址错误',
  },
]
