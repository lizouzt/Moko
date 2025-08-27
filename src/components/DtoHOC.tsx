/**
 * 降低复杂度，依赖后端查询接口path的规范, 不规范的自己写或者让后端改
 */
import React, { useReducer, useEffect, useMemo, memo } from 'react'
import { IOption } from 'types/index.d'
import { queryDto, queryTree } from 'services/model.common'

export type IDtoMap = Record<string, { loading: boolean; options: IOption[] }>

const fetch = async (apiCode: string, mapFunc: Function, extra: any = {}): Promise<IOption[]> => {
  const isTreeData = extra?.tree
  const handler = isTreeData ? queryTree : queryDto

  const { code, data } = await handler(apiCode, { limit: 200, ...extra })

  let options = []

  if (code === 2000) {
    options = isTreeData ? data.map(mapFunc) : (data?.records || []).map(mapFunc)
  }

  return options
}

const enum LoadingActionType {
  on,
  off,
}

const loadingMapReducer = (state: IDtoMap, action: { type: number; payload: { key: string; options?: IOption[] } }) => {
  state[action.payload.key] = {
    loading: action.type === LoadingActionType.on,
    options: action.payload.options || [],
  }

  return { ...state }
}

const DtoFetchHOC = (
  props: React.PropsWithChildren<{
    mapper: Record<string, Function>
    extraMap?: Record<string, any>
  }>,
) => {
  const { mapper, extraMap = {} } = props

  const loadingInit = useMemo(
    () =>
      Object.keys(mapper).reduce((stateMap: IDtoMap, apiCode) => {
        stateMap[apiCode] = {
          loading: false,
          options: [],
        }
        return stateMap
      }, {}),
    [mapper],
  )

  const [dtoMap, dtoMapDispatch] = useReducer(loadingMapReducer, loadingInit)

  useEffect(() => {
    const request = async (apiCode: string, mapFunc: Function, extra?: any) => {
      dtoMapDispatch({ type: LoadingActionType.on, payload: { key: apiCode } })
      const options = await fetch(apiCode, mapFunc, extra)
      dtoMapDispatch({ type: LoadingActionType.off, payload: { key: apiCode, options } })
    }

    Object.keys(mapper).forEach(async (apiCode) => {
      await request(apiCode, mapper[apiCode], extraMap[apiCode])
    })
  }, [mapper])

  return (
    <React.Fragment>
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { ...child.props, dtoMap })
        }
      })}
    </React.Fragment>
  )
}

export default memo(DtoFetchHOC)
