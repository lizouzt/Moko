import { FormRule } from 'tdesign-react'
import { ModelForm } from 'types/index.d'

type ItemConfig = ModelForm

const ruleLogWarn = (msg: string) => console.log(`表单规则配置错误 %c ${msg}`, 'color: red')

const getFormItemRule = (item: ItemConfig): FormRule[] => {
  const rules: Array<object> = [{ whitespace: true, message: '值不能为空格' }]

  if (item.required !== undefined) {
    rules.push({ required: item.required === 1 })
  }

  if (item.length) {
    if (Number.isNaN(item.length)) {
      ruleLogWarn(`字段 ${item.name} length错误`)
    } else {
      rules.push({
        pattern: new RegExp(`^(.|\\n){0,${item.length}}$`),
        message: `长度不能超过${item.length}位`,
      })
    }
  }

  if (item.scale) {
    if (Number.isNaN(item.scale)) {
      ruleLogWarn(`字段 ${item.name} scale错误`)
    } else {
      rules.push({
        pattern: new RegExp(`^\\d+\\.\\d{${item.scale}}$`),
        message: `请保留${item.scale}位小数`,
        trigger: 'blur',
      })
    }
  }

  if (item.checkRule) {
    try {
      rules.push({
        pattern: item.checkRule?.constructor === RegExp ? item.checkRule : RegExp(item.checkRule),
        message: item.validErrorMsg,
        trigger: 'blur',
      })
    } catch (err) {
      ruleLogWarn(`字段 ${item.name} checkRule错误`)
    }
  }

  return rules
}

export default getFormItemRule
