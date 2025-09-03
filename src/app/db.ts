import Store from 'electron-store'
import { FileList, FileName } from './types'
import pkg from '../../package.json'

export interface File {
  filename: FileName
  content: string
}

type FilesMap = Record<FileName, string>

const store = new Store<{
  files: FilesMap
  fileList: FileList
}>({
  name: pkg.productName,
  defaults: {
    files: {},
    fileList: [],
  },
  schema: {
    files: { type: 'object', patternProperties: { '.*': { type: 'string' } } },
    fileList: { type: 'array', items: { type: 'string' } },
  },
})

// 获取所有文件名列表
export function getFileList(): string[] {
  return store.get('fileList') ?? []
}

// 保存文件名列表（自动同步 files 字典，删除不存在的内容）
export function saveFileList(list: string[]): void {
  const files = store.get('files') ?? {}
  Object.keys(files).forEach(f => {
    if (!list.includes(f)) delete files[f]
  })
  store.set('files', files)
  store.set('fileList', list)
}

// 保存文件内容（只保存内容，不自动补全 fileList）
export function saveFileContent(filename: string, content: string): void {
  store.set(`files.${filename}`, content)
}

// 获取文件内容（只读单个 key）
export function getFileContent(filename: string): string {
  return store.get(`files.${filename}`) ?? ''
}

// 删除文件（只删单个 key，自动同步 fileList）
export function deleteFile(filename: string): void {
  store.delete(`files.${filename}`)
  let fileList = store.get('fileList') ?? []
  fileList = fileList.filter(f => f !== filename)
  store.set('fileList', fileList)
}

// 文件重命名
export function renameFile(oldName: string, newName: string): void {
  const content = getFileContent(oldName)
  saveFileContent(newName, content)
  deleteFile(oldName)
  let fileList = getFileList().map(f => (f === oldName ? newName : f))
  saveFileList(fileList)
}