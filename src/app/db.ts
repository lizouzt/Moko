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
export async function getFileList(): Promise<string[]> {
  return await store.get('fileList') ?? []
}

// 保存文件名列表（自动同步 files 字典，删除不存在的内容）
export async function saveFileList(list: string[]): Promise<void> {
  const files = await store.get('files') ?? {}
  Object.keys(files).forEach(f => {
    if (!list.includes(f)) delete files[f]
  })
  await store.set('files', files)
  await store.set('fileList', list)
}

// 保存文件内容（只保存内容，不自动补全 fileList）
export async function saveFileContent(filename: string, content: string): Promise<void> {
  await store.set(`files.${filename}`, content)
}

// 获取文件内容（只读单个 key）
export async function getFileContent(filename: string): Promise<string> {
  return await store.get(`files.${filename}`) ?? ''
}

// 删除文件（只删单个 key，自动同步 fileList）
export async function deleteFile(filename: string): Promise<void> {
  await store.delete(`files.${filename}`)
  let fileList = await store.get('fileList') ?? []
  fileList = fileList.filter(f => f !== filename)
  await store.set('fileList', fileList)
}

// 文件重命名
export async function renameFile(oldName: string, newName: string): Promise<void> {
  const content = await getFileContent(oldName)
  await saveFileContent(newName, content)

  let fileList = await store.get('fileList') ?? []
  fileList = fileList.map(f => f === oldName ? newName : f)
  await store.set('fileList', fileList)
}