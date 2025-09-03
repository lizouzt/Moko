import React from 'react'
import { Button, Textarea, FormRule, FormInstanceFunctions, Popconfirm, Form, PopconfirmProps } from 'tdesign-react'
import { IResponse } from 'utils/request'

const { FormItem } = Form

const tFormRules: Record<string, FormRule[]> = {
  reason: [{ required: true }],
}

/**
 * Popconfirm 组件输入框异步回调
 */
export default (
  props: React.PropsWithChildren<{
    title: string
    label?: string
    visibleCheck?: () => boolean
    onConfirm: ({ reason }: { reason: string }) => Promise<Partial<IResponse>>
  } & Omit<PopconfirmProps, 'onConfirm' | 'content'>>,
) => {
  const { title, label = '请输入', onConfirm, visibleCheck, ...rest } = props
  const [isPosting, setPosting] = React.useState(false)
  const [visible, setVisible] = React.useState(false)

  const formRef = React.useRef<FormInstanceFunctions>(null)
  const onSubmit = React.useCallback(async () => {
    const valid = await formRef.current?.validateOnly()
    const formData = formRef.current?.getFieldsValue(true)

    if (valid !== true || !props.onConfirm) {
      return false
    }

    setPosting(true)
    const ret = await onConfirm({ reason: formData?.reason })
    setPosting(false)

    if (ret && ret.code === 2000) {
      setVisible(false)
    }
  }, [formRef])

  return (
    <Popconfirm
      visible={visible}
      content={
        <>
          <div className='ftitle small mb-2'>{title}</div>
          <Form rules={tFormRules} ref={formRef} onSubmit={onSubmit}>
            <FormItem name='reason' labelAlign='top'>
              <Textarea maxLength={64} placeholder={label} />
            </FormItem>
          </Form>
        </>
      }
      destroyOnClose
      theme={'danger'}
      placement={'bottom-left'}
      confirmBtn={
        <Button theme='primary' loading={isPosting} size='small' onClick={() => formRef.current?.submit()}>
          确认
        </Button>
      }
      onCancel={() => {
        if (!isPosting) {
          setVisible(false)
        }
      }}
      {...rest}
    >
      <span
        onClick={() => {
          if (!visibleCheck) {
            setVisible(true)
          } else if (visibleCheck() === true) {
            setVisible(true)
          }
        }}
      >
        {props.children}
      </span>
    </Popconfirm>
  )
}
