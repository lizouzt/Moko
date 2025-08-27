import React, { useEffect, useRef, useState } from 'react'
import { CloudUploadIcon } from 'tdesign-icons-react'
import { MessagePlugin } from 'tdesign-react'
import styled from 'styled-components'

export interface IUploadBoxProps {
  /** 文件类型 默认* */
  accept?: string
  /** 已选中文件 受控 */
  value?: File[]
  /** 提示语 */
  tip?: string
  /** 文件大小 默认2MB */
  size?: number
  multiple?: boolean
  maxNumber?: number
  onChange: (files: File[]) => void
}

export const DashedBox = styled.div`
  margintop: 20px;
  height: 88px;
  border: 1px dashed #dde0ea;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: border-color 0.2s linear;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  &:hover {
    border-color: var(--td-brand-color);
  }

  .t-icon {
    color: var(--td-brand-color);
  }
`

export const FileInput = styled.input`
  width: 100%;
  height: 88px;
  opacity: 0;
  position: absolute;
  z-index: 2;
`

const FilesInfo = styled.div`
  font: var(--td-font-body-small);
  color: var(--td-text-color-secondary);
`

const Title = styled.div`
  font-size: var(--td-font-size-body-medium);
  color: var(--td-text-color-primary);
  text-align: center;
`

const Tip = styled.div`
  font-size: var(--td-font-size-body-small);
  color: var(--td-text-color-placeholder);
  text-align: center;
`

const IUploadBox = ({
  multiple = false,
  accept = '*',
  onChange,
  value,
  size = 2,
  maxNumber = 5,
  tip = '单击或将文件拖到该区域以上传',
}: IUploadBoxProps) => {
  const [files, setFiles] = useState<File[]>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onChange(files || [])
  }, [files])

  useEffect(() => {
    if (value !== undefined) {
      setFiles(value)
    }
  }, [value])

  return (
    <DashedBox className='mt-5'>
      {files ? (
        <>
          {Array.prototype.map.call(files, (file) => (
            <FilesInfo key={file.name}>{file.name}</FilesInfo>
          ))}
        </>
      ) : (
        <>
          <CloudUploadIcon size={23} />
          <Title>{tip}</Title>
          <Tip>{`上传仅支持${accept}格式, 文件不得超过${size}MB`}</Tip>
        </>
      )}
      <FileInput
        type='file'
        accept={accept}
        ref={fileInputRef}
        multiple={multiple}
        onChange={() => {
          const xFiles = Array.from(fileInputRef.current?.files || [])

          const gtFile = xFiles.find((item) => item.size > size * 1024 * 1024)

          if (gtFile) {
            MessagePlugin.warning(`可上传文件大小${size}MB以下的文件`)
          } else if (multiple && xFiles.length > maxNumber) {
            MessagePlugin.warning(`单次最多可上传${maxNumber}个文件`)
          } else {
            setFiles(fileInputRef.current?.files ? Array.from(fileInputRef.current.files) : [])
          }
        }}
      />
    </DashedBox>
  )
}

IUploadBox.displayName = 'UploadBox'

export default React.memo(IUploadBox)
