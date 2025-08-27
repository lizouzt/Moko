/** 独立小函数 */
import React from 'react'
import { Tag, TableRowData, TdTagProps } from 'tdesign-react'

const getStatusCell =
  (
    attrThemeMap: StateThemeMapDict,
    attrLabelMap: StateLabelMapDict,
    attrIconMap?: Record<string, Record<number, React.ReactElement<any, string | React.JSXElementConstructor<any>>>>,
  ) =>
  ({
    row,
    key,
    orgProps,
  }: {
    row: TableRowData
    key: string
    orgProps?: Partial<Omit<TdTagProps, 'theme' | 'size'>>
  }) => {
    const val = row[key]

    if (val === undefined || val === null || val === '') {
      return ''
    }

    const themeMap = attrThemeMap[key] ?? {}
    const labelMap = attrLabelMap[key] ?? {}

    return (
      <Tag
        theme={themeMap[val] ?? 'default'}
        icon={attrIconMap?.[key]?.[val] ?? undefined}
        size='small'
        variant={'light-outline'}
        {...orgProps}
      >
        {labelMap[val]}
      </Tag>
    )
  }

export default getStatusCell
