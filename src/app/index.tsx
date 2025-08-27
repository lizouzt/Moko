import React, { useState, useEffect, useMemo, useRef, startTransition, useCallback } from 'react'
import { MessagePlugin, Drawer, } from 'tdesign-react'
import classNames from 'classnames'
import * as monaco from 'monaco-editor'
import { useAppSelector } from 'modules/store'
import MarkdownEditor from './MarkdownEditor'
import MarkdownPreview from './MarkdownPreview'
import MarkdownHistory from './MarkdownHistory'
import { getFileList, getFileContent, saveFileList, saveFileContent, exportPdf } from './utils'
import CommonStyle from 'styles/common.module.less'
import { AUTO_SAVE_INTERVAL, getUniqueUntitledName, getAutoFileName, UNTITLED_PREFIX } from './config'
import styles from 'app/index.module.less'
import MarkdownToolbar from './MarkdownToolbar'
import { SplitMode, FileList, FileName, EditFileTitleProps } from './types'

const LOCAL_KEY = 'markdown-content'

const EditFileTitle: React.FC<EditFileTitleProps> = ({ name }) => (
  <div className={classNames('mt--1', CommonStyle.tagh2)}>
    编辑 {name || UNTITLED_PREFIX}
  </div>
)

const MarkDown: React.FC = () => {
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)
  const scrollSyncFlag = useRef<'editor' | 'preview' | null>(null)

  const { theme } = useAppSelector((state) => state.global)
  const [content, setContent] = useState<string>('')
  const [fileList, setFileList] = useState<FileList>([])
  const [currentFile, setCurrentFile] = useState<FileName>('')
  const [splitMode, setSplitMode] = useState<SplitMode>('horizontal')
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState<boolean>(false)

  const handleContentChange = (val: string) => {
    setContent(val)
    localStorage.setItem(LOCAL_KEY, val)
  }

  const handleImportFile = () => {
    importInputRef.current?.click()
  }

  const onImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      const filename = file.name.replace(/\.md|\.markdown$/i, '')
      if (!fileList.includes(filename)) {
        const newList: FileList = [filename, ...fileList]
        setFileList(newList)
        saveFileList(newList)
      }
      setCurrentFile(filename)
      setContent(content)
      saveFileContent(filename, content)
      MessagePlugin.success('导入成功')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleSave = async (isAuto: boolean = false) => {
    let filename: FileName = currentFile
    const isUntitled = new RegExp(`^${UNTITLED_PREFIX}-\\d+$`).test(filename)
    let finalName: FileName = filename
    if (isUntitled && content.trim()) {
      const autoName = getAutoFileName(content, fileList)
      if (autoName) {
        console.log('autoName', autoName)
        finalName = autoName
        localStorage.removeItem(`markdown-file-${filename}`)
      }
    }
    const newList: FileList = [finalName, ...fileList.filter(f => f !== filename && f !== finalName)]
    setFileList(newList)
    saveFileList(newList)
    saveFileContent(finalName, content)
    setCurrentFile(finalName)
    if (!isAuto) {
      MessagePlugin.success('已保存到文件')
    }
  }

  const handleNewFile = () => {
    const filename: FileName = getUniqueUntitledName(fileList)
    const newList: FileList = [filename, ...fileList]
    setFileList(newList)
    saveFileList(newList)
    setCurrentFile(filename)
    setContent('')
    MessagePlugin.success('新建文件成功')
  }

  const handleRenameFile = async (oldName: FileName, newName: FileName) => {
    if (fileList.includes(newName)) {
      MessagePlugin.error('文件名已存在')
      return
    }
    const newList: FileList = fileList.map(f => (f === oldName ? newName : f))
    setFileList(newList)
    saveFileList(newList)
    const content = await getFileContent(oldName)
    saveFileContent(newName, content)
    localStorage.removeItem(`markdown-file-${oldName}`)
    if (currentFile === oldName) setCurrentFile(newName)
    MessagePlugin.success('重命名成功')
  }

  const handleDeleteFile = async (filename: FileName) => {
    const newList: FileList = fileList.filter(f => f !== filename)
    setFileList(newList)
    saveFileList(newList)
    localStorage.removeItem(`markdown-file-${filename}`)
    if (currentFile === filename && newList.length > 0) {
      setCurrentFile(newList[0])
      setContent(await getFileContent(newList[0]))
    }
    MessagePlugin.success('删除成功')
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `markdown_${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    MessagePlugin.success('已下载')
  }

  const handleHistorySelect = async (filename: FileName) => {
    if (new RegExp(`^${UNTITLED_PREFIX}-\\d+$`).test(currentFile) && !content.trim()) {
      const newList: FileList = fileList.filter(f => f !== currentFile)
      setFileList(newList)
      saveFileList(newList)
      localStorage.removeItem(`markdown-file-${currentFile}`)
    }
    if (filename !== currentFile) {
      handleSave(true)
      await setCurrentFile(filename)
      await setContent(await getFileContent(filename))
      startTransition(() => {
        monacoEditorRef.current?.setScrollTop(0)
      })
    }
    setHistoryDrawerVisible(false)
  }

  const handleExportPdf = async () => {
    if (!previewRef.current) {
      MessagePlugin.error('未找到预览区域')
      return
    }
    const resultMsg = await exportPdf(previewRef.current, theme, currentFile)
    MessagePlugin.success(resultMsg)
  }

  useEffect(() => {
    if (!monacoEditorRef.current || !previewRef.current) return
    const editor = monacoEditorRef.current
    const preview = previewRef.current?.parentElement
    const onEditorScroll = (e: any) => {
      if (scrollSyncFlag.current === 'preview') return
      scrollSyncFlag.current = 'editor'
      const editorScrollTop = editor.getScrollTop()
      const editorScrollHeight = editor.getScrollHeight()
      const editorClientHeight = editor.getDomNode()?.clientHeight || 1
      const percent = editorScrollTop / (editorScrollHeight - editorClientHeight)
      const previewScrollHeight = preview!.scrollHeight
      const previewClientHeight = preview!.clientHeight
      preview!.scrollTop = percent * (previewScrollHeight - previewClientHeight)
      setTimeout(() => { scrollSyncFlag.current = null }, 50)
    }
    let editorScrollDispose: any = null
    editorScrollDispose = editor.onDidScrollChange(onEditorScroll)
    const onPreviewScroll = () => {
      if (scrollSyncFlag.current === 'editor') return
      scrollSyncFlag.current = 'preview'
      const previewScrollTop = preview!.scrollTop
      const previewScrollHeight = preview!.scrollHeight
      const previewClientHeight = preview!.clientHeight
      const percent = previewScrollTop / (previewScrollHeight - previewClientHeight)
      const editorScrollHeight = editor.getScrollHeight()
      const editorClientHeight = editor.getDomNode()?.clientHeight || 1
      editor.setScrollTop(percent * (editorScrollHeight - editorClientHeight))
      setTimeout(() => { scrollSyncFlag.current = null }, 50)
    }
    preview!.addEventListener('scroll', onPreviewScroll)
    return () => {
      if (editorScrollDispose) editorScrollDispose.dispose?.()
      preview!.removeEventListener('scroll', onPreviewScroll)
    }
  }, [splitMode, monacoEditorRef.current, previewRef.current])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content])

  useEffect(() => {
    const timer = setInterval(() => {
      handleSave(true)
    }, AUTO_SAVE_INTERVAL)
    return () => clearInterval(timer)
  }, [content])

  const initData = useCallback(async () => {
    const list: FileList = await getFileList()
    setFileList(list)
    if (list.length > 0) {
      const fFileName = list[0]
      setCurrentFile(fFileName)
      setContent(await getFileContent(fFileName))
    } else {
      setCurrentFile('未命名')
    }
  }, [])

  useEffect(() => {
    initData()
  }, [])

  const renderSplit = useMemo(() => (
    <div className={classNames({
      [styles.splitHorizontal]: splitMode !== 'vertical',
      [styles.splitVertical]: splitMode === 'vertical',
    })}>
      <div
        className={classNames(
          'p-5',
          styles.splitPanel,
          styles.splitCardEdit,
          splitMode === 'preview' ? styles.hidden : ''
        )}
      >
        <EditFileTitle name={currentFile}/>
        <MarkdownEditor value={content} onChange={handleContentChange} ref={monacoEditorRef}/>
      </div>
      <div
        className={classNames(
          'p-5',
          styles.splitPanel,
          styles.splitCardPreview,
          splitMode === 'edit' ? styles.hidden : ''
        )}
      >
        <div className={classNames('mt--1', CommonStyle.tagh2)}>预览</div>
        <MarkdownPreview value={content} ref={previewRef}/>
      </div>
    </div>
  ), [content, splitMode, currentFile, monacoEditorRef, previewRef])

  return (
    <div className={styles.markdownRoot}>
      <MarkdownToolbar
        monacoEditorRef={monacoEditorRef}
        splitMode={splitMode}
        setSplitMode={setSplitMode}
        onNewFile={handleNewFile}
        onImport={handleImportFile}
        onSave={handleSave}
        onDownload={handleDownload}
        onExportPdf={handleExportPdf}
        onShowHistory={() => setHistoryDrawerVisible(true)}
      />
      <div className={styles.mainPanel}>
        <div className={styles.splitContainer}>{renderSplit}</div>
      </div>
      <Drawer
        header="记录"
        visible={historyDrawerVisible}
        placement="left"
        size={'320px'}
        onClose={() => setHistoryDrawerVisible(false)}
        footer={null}
        className={styles.historyDrawer}
      >
        <MarkdownHistory
          list={fileList}
          selected={currentFile}
          onSelect={handleHistorySelect}
          onRename={handleRenameFile}
          onDelete={handleDeleteFile}
        />
      </Drawer>
      <input
        type="file"
        accept=".md,.markdown,text/markdown"
        style={{ display: 'none' }}
        ref={importInputRef}
        onChange={onImportFileChange}
      />
    </div>
  )
}

export default MarkDown