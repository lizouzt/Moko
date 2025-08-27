import React, { useMemo } from 'react'
import { Form } from 'tdesign-react'
import { ModelQueryComp } from 'types/index.d'
import { CompTypeMap } from './FormItemMap'
import { IFormItemProps, IFormProps } from './types'
import './IFormItem.less'

export const IFormItem = ({ item, isEdit = false, children, ...options }: React.PropsWithChildren<IFormItemProps>) => {
  const itemObj = useMemo(() => {
    let orgProps

    if (!item.orgProps) {
      orgProps = options
    } else {
      orgProps = { ...item.orgProps, ...options }
    }

    return { ...item, orgProps }
  }, [item, options])

  const Component = useMemo(() => CompTypeMap[item.widgetType || ModelQueryComp.useless], [item.widgetType])

  return (
    <Component item={itemObj} isEdit={isEdit}>
      {' '}
      {children}{' '}
    </Component>
  )
}

export const IForm = React.forwardRef(
  ({ items, children, labelWidth, isEdit = false, ...orgFormOptions }: React.PropsWithChildren<IFormProps>, ref) => {
    const formItems = useMemo(
      () =>
        items.map((item) => (
          <IFormItem
            key={item.code.constructor === Array ? item.code.join('-') : (item.code as string)}
            item={{ labelWidth, ...item }}
            isEdit={isEdit}
          />
        )),
      [items],
    )

    return (
      <Form ref={ref} {...orgFormOptions}>
        {formItems}
        {children}
      </Form>
    )
  },
)
