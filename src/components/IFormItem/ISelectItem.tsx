import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { Form, Select, SelectOption } from 'tdesign-react'
import { getDictInfo } from 'services/model.common'
import getFormItemRule from './getFormItemRule'
import { IOption } from 'types/index.d'
import { ItemConfig } from './types'

const fetchDict = async (dictKey: string): Promise<IOption[]> => {
  const { code, data } = await getDictInfo(dictKey)

  let opts: IOption[] = []
  if (code === 2000) {
    opts = data[dictKey]?.children
  }

  return opts
}

const ISelect = (isMultiple: boolean) => (props: React.PropsWithChildren<{ item: ItemConfig; isEdit: boolean }>) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const [pagin, setPagin] = useState({ page: 1, search: '', limit: 10 })
  const [options, setOptions] = useState<IOption[]>(props.item.orgProps?.options || [])
  const searchStrRef = useRef<{ inputElement: HTMLInputElement }>(null)
  const formItemRef = useRef<HTMLInputElement>(null)

  const rules = useMemo(() => getFormItemRule(props.item), [props.item])
  const placeholder = useMemo(() => props.item.placeholder || `请选择${props.item.name}`, [props.item])

  /** 自定义异步请求函数 */
  const doQuery = useCallback(
    async ({ search = pagin.search, page }: { search?: string; page?: number }) => {
      if (!props.item.asyncQuery) {
        return false
      }

      const params = {
        limit: pagin.limit,
        page: page || pagin.page,
        search,
      }

      setIsLoading(true)

      const nOptions = await props.item.asyncQuery(params)

      if (nOptions.length < pagin.limit) {
        setIsEnd(true)
      }

      setPagin(params)

      if (params.page > 1) {
        setOptions(options.concat(nOptions))
      } else {
        setOptions(nOptions)
      }

      setIsLoading(false)
    },
    [pagin],
  )

  /** 字典请求函数 */
  const doFetch = useCallback(async (): Promise<void> => {
    setIsLoading(true)

    const opts = await fetchDict(props.item.dictKey as string)

    if (props.item.dictFilter?.constructor === Function) {
      setOptions(opts.filter(props.item.dictFilter))
    } else {
      setOptions(opts)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!options.length) {
      if (props.item.asyncQuery) {
        doQuery({ search: '' })
      } else if (props.item.dictKey) {
        doFetch()
      }
    }
  }, [])

  return (
    <Form.FormItem
      rules={rules}
      label={props.item.name}
      name={props.item.code}
      labelAlign='right'
      labelWidth={props.item.labelWidth ?? 108}
      className={props.item.autoWidth ? 'model_form_item auto' : 'model_form_item'}
    >
      <Select
        clearable
        filterable
        minCollapsedNum={3}
        multiple={isMultiple}
        loading={isLoading}
        placeholder={placeholder}
        options={options}
        disabled={props.isEdit && props.item.canUpdate === 0}
        onSearch={(val) => {
          let search = false

          if (!options?.length) {
            // 无数据搜索
            search = true
          } else if (val === '') {
            // 清空FormItem值
            search = true
          } else if (formItemRef.current?.value === null || formItemRef.current?.value === undefined) {
            // FormItem无值的情况 修改过输入框
            search = true
          } else if (searchStrRef.current?.inputElement?.placeholder !== placeholder) {
            // FormItem有值的情况 修改过输入框
            search = true
          }

          if (search === true) {
            setIsEnd(false)
            doQuery({ page: 1, search: val })
          }
        }}
        popupProps={{
          overlayInnerStyle: { minHeight: 'var(--td-comp-size-m)' },
          onScrollToBottom: () => {
            if (!isLoading && !isEnd) {
              doQuery({ page: pagin.page + 1 })
            }
          },
        }}
        {...(props.item?.orgProps ? { onChange: undefined, ...props.item.orgProps } : {})}
        onChange={(val: any, event: { selectedOptions: SelectOption[] }) => {
          props.item.orgProps?.onChange?.(val, event?.selectedOptions?.[0])
        }}
      />
      {props.children}
    </Form.FormItem>
  )
}

export default ISelect
