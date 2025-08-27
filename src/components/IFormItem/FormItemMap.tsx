import React, { useMemo } from 'react'
import {
  Form,
  Input,
  InputAdornment,
  InputNumber,
  Cascader,
  Switch,
  TimePicker,
  TagInput,
  Textarea,
  DatePicker,
  DateRangePicker,
  Radio,
} from 'tdesign-react'
import { ModelQueryComp } from 'types/index.d'
import { InfoItem } from 'components/InfoItem'
import ITreeSelectItem from './ITreeSelectItem'
import ISelectItem from './ISelectItem'
import { ItemConfig } from './types'
import CommonStyle from 'styles/common.module.less'
import getFormItemRule from './getFormItemRule'

const { FormItem } = Form

export const IFormItemWrap = (props: React.PropsWithChildren<{ item: ItemConfig }>) => {
  const rules = useMemo(() => getFormItemRule(props.item), [props.item])

  return (
    <FormItem
      rules={rules}
      label={props.item.name}
      name={props.item.code}
      labelAlign='right'
      labelWidth={props.item.labelWidth ?? 108}
      className={props.item.autoWidth ? 'model_form_item auto' : 'model_form_item'}
      {...(props.item.orgProps || {})}
    >
      {props.children}
    </FormItem>
  )
}

export const CompTypeMap = {
  [ModelQueryComp.useless]: () => <></>,
  [ModelQueryComp.INPUT]: (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => (
    <IFormItemWrap {...props}>
      {props.item.orgProps?.append || props.item.orgProps?.prepend ? (
        <InputAdornment prepend={props.item.orgProps?.prepend} append={props.item.orgProps?.append}>
          <Input
            maxlength={props.item.length}
            placeholder={props.item.placeholder || props.item.validErrorMsg || `请输入${props.item.name}`}
            disabled={props.isEdit && props.item.canUpdate === 0}
            showLimitNumber
            {...(props.item.orgProps || {})}
          />
        </InputAdornment>
      ) : (
        <Input
          maxlength={props.item.length}
          placeholder={props.item.placeholder || props.item.validErrorMsg || `请输入${props.item.name}`}
          disabled={props.isEdit && props.item.canUpdate === 0}
          showLimitNumber
          {...(props.item.orgProps || {})}
        />
      )}
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.SELECT]: ISelectItem(false),
  [ModelQueryComp.MULTIPLESELECT]: ISelectItem(true),
  [ModelQueryComp.TEXTAREA]: (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => (
    <IFormItemWrap {...props}>
      <Textarea
        placeholder={props.item.placeholder || props.item.validErrorMsg || `请输入${props.item.name}`}
        className={props.item.orgProps?.autosize ? 'resize' : 'no-resize'}
        disabled={props.isEdit && props.item.canUpdate === 0}
        maxlength={props.item.length}
        allowInputOverMax={false}
        {...(props.item.orgProps || {})}
      />
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.DATE]: (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => (
    <IFormItemWrap {...props}>
      <DatePicker
        placeholder={props.item.placeholder || '请选择日期'}
        clearable
        disabled={props.isEdit && props.item.canUpdate === 0}
        format={props.item.orgProps?.enableTimePicker === false ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'}
        {...(props.item.orgProps || {})}
      />
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.DATETIME]: (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => (
    <IFormItemWrap {...props}>
      <DatePicker
        placeholder={props.item.placeholder || '请选择日期'}
        enableTimePicker
        clearable
        disabled={props.isEdit && props.item.canUpdate === 0}
        format={props.item.orgProps?.enableTimePicker === false ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'}
        {...(props.item.orgProps || {})}
      />
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.DATERANGE]: (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => (
    <IFormItemWrap {...props}>
      <DateRangePicker
        disabled={props.isEdit && props.item.canUpdate === 0}
        placeholder={props.item.placeholder || '请选择日期'}
        enableTimePicker
        format={props.item.orgProps?.enableTimePicker === false ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'}
        {...(props.item.orgProps || {})}
      />
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.INFOITEM]: (props: React.PropsWithChildren<{ item: ItemConfig }>) => (
    <IFormItemWrap {...props}>
      <InfoItem {...(props.item.orgProps || {})} />
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.TREESELECT]: ITreeSelectItem,
  [ModelQueryComp.MULTIPLETREESELECT]: ITreeSelectItem,
  [ModelQueryComp.CASCADER]: (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => (
    <IFormItemWrap {...props}>
      <Cascader {...(props.item.orgProps || {})} />
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.TAGINPUT]: (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => (
    <IFormItemWrap {...props}>
      <TagInput
        placeholder={props.item.placeholder || props.item.validErrorMsg || `请输入${props.item.name} 按回车键分隔`}
        disabled={props.isEdit && props.item.canUpdate === 0}
        {...(props.item.orgProps || {})}
      />
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.RADIO]: (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => (
    <IFormItemWrap {...props}>
      <Radio.Group allowUncheck disabled={props.isEdit && props.item.canUpdate !== 1} {...props.item.orgProps} />
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.H1TAG]: (props: React.PropsWithChildren<{ item: ItemConfig }>) => (
    <div className={CommonStyle.tagh1} {...props.item.orgProps}>
      {props.item.name}
      {props.children}
    </div>
  ),
  [ModelQueryComp.H2TAG]: (props: React.PropsWithChildren<{ item: ItemConfig }>) => (
    <div className={CommonStyle.tagh2} {...props.item.orgProps}>
      {props.item.name}
      {props.children}
    </div>
  ),
  [ModelQueryComp.TIME]: (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => (
    <IFormItemWrap {...props}>
      <TimePicker
        disabled={props.isEdit && props.item.canUpdate === 0}
        format='HH:mm:ss'
        hideDisabledTime
        size='medium'
        steps={[1, 1, 1]}
        {...props.item.orgProps}
      />
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.INPUTNUMBER]: (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => (
    <IFormItemWrap {...props}>
      <InputNumber
        allowInputOverLimit={false}
        largeNumber={false}
        min={0.01}
        max={999999999999}
        decimalPlaces={2}
        placeholder={props.item.placeholder || `请输入${props.item.name}`}
        readonly={props.isEdit && props.item.canUpdate !== 1}
        theme='normal'
        autoWidth
        {...props.item.orgProps}
      />
      {props.children}
    </IFormItemWrap>
  ),
  [ModelQueryComp.SWITCH]: (props: { item: ItemConfig; isEdit: boolean }) => (
    <IFormItemWrap {...props}>
      <Switch disabled={props.isEdit && props.item.canUpdate !== 1} {...props.item.orgProps} />
    </IFormItemWrap>
  ),
}
