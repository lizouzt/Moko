import React, { useState, useEffect, memo } from 'react'
import PageLoadingMask from 'layouts/components/PageLoadingMask'
import { IOption } from 'types/index.d'
import { getDictInfo } from 'services/model.common'

type IDictKey = string

export type IDictOptMap = Record<IDictKey, IOption[]>

type IDictLabelMap = Record<number, IDictKey>
/**
 * 字典对应的值=>标签名的映射表
 */
export type IDictMap = Record<IDictKey, IDictLabelMap>

const fetchDict = async (dictKey: IDictKey[]): Promise<{ theOptMap: IDictOptMap; theMap: IDictMap }> => {
  const { code, data } = await getDictInfo(dictKey)

  let theOptMap: IDictOptMap = {}
  let theMap: IDictMap = {}

  if (code === 2000) {
    const { opts, maps } = Object.keys(data).reduce(
      (dictData: { opts: IDictOptMap; maps: IDictMap }, code: any) => {
        dictData.opts[code] = data[code]?.children ?? []
        dictData.maps[code] = dictData.opts[code].reduce((dictMapData: IDictLabelMap, item: any) => {
          dictMapData[item.value] = item.label

          return dictMapData
        }, {})

        return dictData
      },
      { opts: {}, maps: {} },
    )

    theMap = maps
    theOptMap = opts
  }

  return { theOptMap, theMap }
}

const DictHOC = (
  props: React.PropsWithChildren<{
    keys: string | string[]
    async?: boolean
  }>,
) => {
  const { keys } = props
  const dictKey: string[] = keys.constructor === String ? [keys] : (keys as string[])

  const [dictLoading, setDictLoading] = useState(true)
  const [dictData, setDictData] = useState<{ theOptMap: IDictOptMap; theMap: IDictMap }>({
    theOptMap: dictKey.reduce((dict: Record<string, any>, key: any) => {
      dict[key] = {}
      return dict
    }, {}),
    theMap: dictKey.reduce((dict: Record<string, any>, key: any) => {
      dict[key] = {}
      return dict
    }, {}),
  })

  useEffect(() => {
    const request = async () => {
      const data = await fetchDict(dictKey)
      setDictData(data)
      setDictLoading(false)
    }

    request()
  }, [keys])

  return props.async && dictLoading ? (
    <PageLoadingMask loading={true} />
  ) : (
    <React.Fragment>
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            dictLoading,
            dictOptMap: dictData.theOptMap,
            dictMap: dictData.theMap,
          })
        }
      })}
    </React.Fragment>
  )
}

export default memo(DictHOC)
