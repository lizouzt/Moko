import { TdFormProps } from 'tdesign-react'
import { ModelForm } from 'types/index.d'

export type ItemConfig = ModelForm

export type IFormItemAttribute = {
  [attribute: string]: any
}

export interface IFormItemProps extends IFormItemAttribute {
  item: ItemConfig
  isEdit?: boolean
}

export interface IFormProps extends TdFormProps {
  items: ModelForm[]
  isEdit?: boolean
}
