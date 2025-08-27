import React, { useMemo, useId, CSSProperties, useInsertionEffect } from 'react'
import classnames from 'classnames'
import styled, { css } from 'styled-components'
import Style from './index.module.less'

interface InfoRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** flex行中各单元比例数组 */
  flex?: number[]
  /** 禁止弹性flexGrow
   * @default false
   * */
  noGrow?: boolean
}

const InfoRowWrap = styled.div.attrs((props: InfoRowProps) => ({
  flex: props.flex || [],
  noGrow: props.noGrow ?? false,
}))`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  > [class*='info'] {
    flex: 1 1;
  }
  ${({ flex, noGrow }) => {
    const total = flex.reduce((sum, item) => sum + item, 0)
    const rowLen = flex.length
    const childrenStyle: string[] = [
      `> :nth-child(${rowLen}n) {
        margin-right: 0;
        [class*="valueWrap"] {
          margin-right: 0;
        }
      }`,
    ]

    flex.forEach((basis: number, index: number) => {
      const childIndex = index + 1
      childrenStyle.push(
        `> :nth-child(${rowLen}n+${childIndex}) { 
          flex-basis: ${(basis / total) * 100}%; 
          flex-grow: ${noGrow ? 0 : basis};
          width: ${(basis / total) * 100}%
        }`,
      )
    })

    return css`
      ${childrenStyle.join('')}
    `
  }}
`

export const InfoRow = ({ flex, children, ...rest }: InfoRowProps) => (
  <InfoRowWrap flex={flex} {...rest}>
    {children}
  </InfoRowWrap>
)

interface InfoProps extends React.HTMLAttributes<HTMLDivElement>, React.PropsWithChildren {
  data: IObject
  /** info内部children row flex wrap显示 */
  inline?: boolean
  /** Label和Value上下显示 */
  alternate?: boolean
  /** 单列排列 */
  vertical?: boolean
  /** 行高 */
  lineHeight?: number
  /**
   * 分列展示时展示的列数
   * 用于控制InfoItem的flexBasis和边框缩进
   * */
  columnCount?: number
  /** Label基础FlexBasis 默认116px */
  labelBasis?: string
}

const findVal = (data: any, name: string): any => {
  if (!data || !name) {
    return undefined
  }
  if (data[name] || data[name] === 0) {
    return data[name]
  }
  const [parent, ...rest] = name.split('.')
  return findVal(data[parent.replace('?', '')], rest.join('.'))
}

const ChildrenWalk: any = (props: InfoProps) => {
  const { inline = false, labelBasis, alternate = false, lineHeight, vertical = false, data = {} } = props

  return React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      if (
        child.props.children &&
        (React.isValidElement(child.props.children) || React.isValidElement(child.props.children[0]))
      ) {
        return React.cloneElement(child, {
          ...child.props,
          children: ChildrenWalk({
            ...child.props,
            data,
            labelBasis,
            lineHeight,
            inline,
            alternate,
            vertical,
          }),
        })
      }
      if (child.type.constructor === String) {
        return React.cloneElement(child, {
          ...child.props,
        })
      }

      if (child.type.constructor === Function && (child.type as any).displayName === 'InfoItem') {
        const keys = child.props?.name instanceof Array ? child.props.name : [child.props.name]
        const value = keys.map((name: string) => findVal(data, name)) || ''

        return React.cloneElement(child, {
          inline,
          alternate,
          lineHeight,
          value,
          vertical,
          labelBasis,
          ...child.props,
        })
      }
      return React.cloneElement(child, { ...child.props })
    }
    return child
  })
}

/**
 * Info data|inline?
 */
export const Info = (props: InfoProps) => {
  const { inline = false, columnCount, className = '', style } = props
  const createdStyles = useMemo(() => new Set<HTMLStyleElement>(), [])

  useInsertionEffect(() => {
    let style: HTMLStyleElement

    if (columnCount && typeof columnCount === 'number') {
      const flexBasis = (100 / columnCount).toFixed(2)

      style = document.createElement('style')
      style.type = 'text/css'
      style.innerHTML = `
        [class*="info-column-${columnCount}"] [class*="info"] {
          flex: 1 1 ${flexBasis}%;
        }
        [class*="info-column-${columnCount}"] [class*="info"]:nth-child(${columnCount}n) {
          margin-right: 0;
        }
      `
      document.head.appendChild(style)
      createdStyles.add(style)
    }

    return () => {
      createdStyles.forEach((style) => document.head.removeChild(style))
      createdStyles.clear()
    }
  }, [])

  return (
    <div
      style={style}
      className={classnames({
        [Style.inlineList]: !!inline,
        [className]: !!className,
        [`info-column-${columnCount}`]: !!columnCount,
      })}
    >
      <ChildrenWalk {...props} />
    </div>
  )
}

/**
 * InfoItem
 */
type InfoItemValue = string | number | React.ReactElement

const iItem = (props: {
  label?: string | React.ReactElement
  inline?: boolean
  /** 上下显示 */
  alternate?: boolean
  /** 行高 */
  lineHeight?: number
  value?: InfoItemValue | InfoItemValue[]
  /** info标签内的数据字段名 配合Info标签使用有效 */
  name?: string | string[]
  /** 后置内容 */
  suffix?: string | React.ReactElement
  /** 单列垂直排列 */
  vertical?: boolean
  /** Label基础FlexBasis */
  labelBasis?: string
  /** 居中显示 */
  center?: boolean
  /** 内容多行 */
  multiple?: boolean
  /** 占位符 默认- */
  placeholder?: string
  className?: string
  style?: CSSProperties
}) => {
  const tkey = useId()

  const valueItems = useMemo(() => {
    const valueArr = props.value?.constructor === Array ? props.value : [props.value]

    return valueArr.map((item, index) => (
      <div key={`${tkey}-${index}`} className={Style.value}>
        {item || item === 0 ? item : props.placeholder || '-'} {props.suffix}
      </div>
    ))
  }, [props.value])

  return (
    <div
      className={classnames({
        [Style.info]: true,
        [Style.inline]: props.inline,
        [Style.alternate]: props.alternate,
        [Style.txtCenter]: props.center ?? false,
        [Style.vertical]: props.vertical ?? false,
        [Style.multiple]: props.multiple ?? false,
        ...(props.className ? { [props.className]: !!props.className } : {}),
      })}
      style={{ ...props.style, lineHeight: props.lineHeight }}
    >
      {props.label ? (
        <div className={Style.label} style={{ flexBasis: props.labelBasis }}>
          {props.label}
        </div>
      ) : (
        ''
      )}
      <div className={Style.valueWrap}>{valueItems}</div>
    </div>
  )
}

iItem.displayName = 'InfoItem'

export const InfoItem = iItem
