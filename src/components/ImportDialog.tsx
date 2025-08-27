import React, { useState, useCallback } from 'react'
import { MessagePlugin, Link, Button, Space, Dialog } from 'tdesign-react'
import { commonAction } from 'services/basic'
import { IResponse } from 'utils/request'
import UploadBox, { IUploadBoxProps } from 'components/UploadBox'

export interface ImportBoxPropx extends Partial<IUploadBoxProps> {
  /** 默认导入导出接口前缀 末尾统一`/import` */
  apiCode?: string
  /** 显示控制 */
  visible: boolean
  /** 上传文件OSS路径 默认 tdesign */
  path?: string
  /** 关闭回调 */
  onClose?: Function
  /** 导入成功回调 */
  onSuccess?: Function
  /** 自定义上传请求 */
  importHandler?: (params: any) => Promise<Partial<IResponse>>
  /** 模版下载链接或者请求 */
  downloadHandler?: string | Function
}

const ImportDialog = ({
  apiCode,
  visible,
  onClose,
  onSuccess,
  onChange,
  importHandler,
  downloadHandler,
  multiple = false,
  path = 'tdesign',
  maxNumber,
  tip,
  accept,
  size,
}: ImportBoxPropx) => {
  const [files, setFiles] = useState<File[]>()
  const [importPosting, setImportPosting] = useState(false)
  const [doDownloading, setDoDownloading] = useState(false)

  const doClose = useCallback(() => {
    setFiles([])

    if (onClose) {
      onClose()
    }
  }, [onClose])

  const doDefaultDownload = useCallback(async () => {
    if (!apiCode) {
      return false
    }

    setDoDownloading(true)
    const { code, data } = await commonAction(apiCode, 'template')({})
    setDoDownloading(false)

    if (code === 2000) {
      window.open(data.url, '_blank')
    }
  }, [apiCode])

  const doImport = useCallback(async () => {
    if (!apiCode && !importHandler) {
      return false
    }

    if (!files?.length) {
      return false
    }

    const formData = files.reduce((fMap: Record<string, File | string>, file, index) => {
      fMap[`file_${index}`] = file
      return fMap
    }, {})

    formData.path = path

    setImportPosting(true)
    const { code, data } = importHandler
      ? await importHandler(formData)
      : await commonAction(apiCode as string, 'import')(formData, { 'Content-Type': 'multipart/form-data' })
    setImportPosting(false)

    if (code === 2000) {
      MessagePlugin.success('导入成功')

      if (onSuccess) {
        onSuccess(data)
      }

      doClose()
    }
  }, [files, apiCode, importHandler])

  return (
    <Dialog
      header='批量导入'
      width={500}
      destroyOnClose
      visible={visible}
      onClose={doClose}
      footer={
        <div className={'flex'}>
          <Link
            size={'small'}
            hover={'color'}
            target={'_blank'}
            disabled={doDownloading || (!downloadHandler && !apiCode)}
            href={downloadHandler?.constructor === String ? (downloadHandler as string) : undefined}
            onClick={() => (typeof downloadHandler === 'function' ? downloadHandler() : doDefaultDownload())}
          >
            下载文件模版
          </Link>
          <Space size={6}>
            <Button theme={'default'} variant='outline' onClick={doClose}>
              取消
            </Button>
            <Button disabled={files?.length === 0} loading={importPosting} onClick={doImport}>
              开始导入
            </Button>
          </Space>
        </div>
      }
    >
      <UploadBox
        tip={tip}
        size={size}
        accept={accept}
        multiple={multiple}
        maxNumber={maxNumber}
        onChange={(files) => {
          setFiles(files)

          if (onChange) {
            onChange(files)
          }
        }}
      />
    </Dialog>
  )
}

export default React.memo(ImportDialog)
