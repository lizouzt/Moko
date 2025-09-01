import Store from 'electron-store'
import pkg from '../../package.json'

export interface File {
  filename: string
  content: string
}

type FilesMap = Record<string, string>

const store = new Store<{
  files: FilesMap
  fileList: string[]
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
  // 删除 files 中未在 list 的项
  Object.keys(files).forEach(f => {
    if (!list.includes(f)) delete files[f]
  })
  store.set('files', files)
  store.set('fileList', list)
}

// 保存文件内容（自动补全 fileList，保证一致性）
export function saveFileContent(filename: string, content: string): void {
  const files = store.get('files') ?? {}
  files[filename] = content
  store.set('files', files)
  let fileList = store.get('fileList') ?? []
  if (!fileList.includes(filename)) {
    fileList.push(filename)
    store.set('fileList', fileList)
  }
}

// 获取文件内容
export function getFileContent(filename: string): string {
  const files = store.get('files') ?? {}
  return files[filename] ?? ''
}
