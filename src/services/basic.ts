import { UploadFile, RequestMethodResponse } from 'tdesign-react'
import request, { IAxiosRequestConfig } from 'utils/request'

export const postImage = (data: UploadFile) =>
  request({
    url: `/media/upload`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })

export const uploadImage = async (files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> => {
  const file: UploadFile = files.constructor === Array ? files[0] : files

  if (!file) {
    return { status: 'fail', response: { url: '' } }
  }

  const { code, data } = await postImage({ file: file.raw, path: '/admin' })

  if (code === 2000) {
    return { status: 'success', response: { url: data?.url } }
  }
  return { status: 'fail', response: { url: '' } }
}

export const getOrgImg = (imgUrl: string) => imgUrl.replace(/\?\S+$/, '')

export enum ImgResizeType {
  /** 等比缩放，限制在指定w与h的矩形内的最大图片。 */
  LARGEFIT = 'm_lfit',
  /** 等比缩放，延伸出指定w与h的矩形框外的最小图片。 */
  MINFIT = 'm_mfit',
  /** 固定宽高，将延伸出指定w与h的矩形框外的最小图片进行居中裁剪。 */
  FILL = 'fill',
  /** 固定宽高，缩略填充。 */
  PAD = 'pad',
  /** 固定宽高，强制缩略。 */
  FIXED = 'fixed',
}
export enum ImgResizeMode {
  /** 裁剪 */
  CROP,
  /** 缩放 */
  RESIZE,
}
export interface IThumbImgProps {
  w?: number
  h?: number
  /**
   * 是否webp[png图片不能加这个处理 加完更大]
   * @default true
   * */
  webp?: boolean
  /**
   * 裁剪模式默认值
   * @default ImgResizeType.LARGEFIT
   * */
  type?: ImgResizeType
  /**
   * 裁剪还是缩放
   * @default ImgResizeMode.RESIZE
   * */
  mode?: ImgResizeMode
  /**
   * mode: ImgResizeMode.CROP 的时候裁剪的位置
   * @default 'center'
   * */
  position?: 'center' | 'left' | 'right'
}

/**
 * oss图片裁剪参数
 * */
export const getThumbImg = ({
  w = 200,
  h = 200,
  type = ImgResizeType.LARGEFIT,
  position = 'center',
  webp = true,
  mode = ImgResizeMode.RESIZE,
}: IThumbImgProps) => {
  if (mode === ImgResizeMode.CROP) {
    return `?x-oss-process=image/crop,g_${position},w_${w},${h ? `h_${h},` : ''}${webp ? 'webp' : ''}/quality,90`
  }
  return `?x-oss-process=image/resize,${type},w_${w},${h ? `h_${h},` : ''}${webp ? 'webp' : ''}/quality,90`
}

/** url后缀获取文件名 */
export const getFName = (url: string) => url?.split(/\?|#/)[0].match(/[^/\\]+\.\w+$/)?.[0]

export const urlToUploadFile = (url: string, options?: IThumbImgProps): UploadFile => ({
  url,
  name: getFName(url),
  response: { thumb: url + getThumbImg({ w: 100, h: 100, type: ImgResizeType.LARGEFIT, ...options }), url },
})

export const exportFile = async (options: IAxiosRequestConfig, fileName = '') => {
  const { blob: data, headers } = await request(Object.assign(options, { responseType: 'blob' }))

  let targetFName = fileName
  const thisIsFingHeader = headers.get('content-disposition')
  if (thisIsFingHeader) {
    const reg = thisIsFingHeader.match(/filename=((.)+\.[a-z]+)/)

    if (reg && reg[1]) {
      targetFName = decodeURI(reg[1])
    }
  }

  const blob = new Blob([data], { type: 'application/vnd.ms-excel' })

  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = targetFName
  link.click()
  window.URL.revokeObjectURL(link.href)
}

export const commonAction =
  (apiCode: string, action: string, method?: string) => async (params?: any, headers?: Record<string, any>) =>
    request({
      url: `/${apiCode}/${action}`,
      method: method || 'post',
      data: params,
      headers,
    })

// id操作
export const operationWithRecordId =
  (apiCode: string, action: string, method?: string) => async (params: any, headers?: Record<string, any>) =>
    request({
      url: `/${apiCode}/${action}/${params.id}`,
      method: method || 'post',
      data: params,
      headers,
    })

export const queryTreeList = (modelCode = '', params = {}, method = 'post') =>
  request({
    url: `/${modelCode}/all`,
    method,
    params,
  })
