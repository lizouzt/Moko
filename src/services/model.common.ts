/**
获取数据模型数据列表
    1. list
        params: {
            name: val,
            materialName: val
        }

        res: [{
            transportName: val
            materialName: val
            status: val
            sendAdr: val
        }]

    2. save
        params: {
            transportName: val
            materialName: val
            status: val
            sendAdr: val
        }
    3. info: {
        id: val,
        transportName: val
        materialName: val
        status: val
        sendAdr: val
    }
    4. dele
        params: { id }
* */
import { IOption } from 'types/index.d'
import request from 'utils/request'

// 字典查询
export const getDictInfo = async (codes: string | string[]) => {
  const codesStr = codes?.constructor === String ? codes : (codes as string[]).join(',')

  return (await request({
    url: `/syset/dict/get/${codesStr}`,
    method: 'post',
  })) as Promise<{
    code: number
    data: Record<string, { code: string; name: string; children: IOption[] }>
  }>
}

export const queryDto = (modelCode: string, params: object, method?: string) =>
  request({
    url: `/${modelCode}/cpages`,
    method: method || 'post',
    data: params,
  })

export const queryTree = (modelCode: string, params: object, method?: string) =>
  request({
    url: `/${modelCode}/getTree`,
    method: method || 'get',
    data: params,
  })

export const SaveModelItem = (modelCode: string, params = {}) =>
  request({
    url: `/${modelCode}/csave`,
    method: 'post',
    data: params,
  })

export const getModelItemInfo = async (apiCode: string, params: any, method?: string) =>
  request({
    url: `/${apiCode}/cinfo`,
    method: method || 'post',
    data: params,
  })

export const DelModelItem = async (modelCode: string, params: any) =>
  await request({
    url: `/${modelCode}/cdel`,
    method: 'post',
    data: params,
  })
