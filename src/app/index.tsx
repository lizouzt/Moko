import React, { useState, useEffect, useMemo, useRef, startTransition, useCallback } from 'react'
import { MessagePlugin, Drawer, } from 'tdesign-react'
import classNames from 'classnames'
import * as monaco from 'monaco-editor'
import { useTranslation } from 'react-i18next'
import i18next from 'i18n/config'
import { useAppSelector } from 'modules/store'
import MarkdownEditor from './MarkdownEditor'
import MarkdownPreview from './MarkdownPreview'
import MarkdownHistory from './MarkdownHistory'
import { getFileList, getFileContent, saveFileList, saveFileContent, renameFile, deleteFile, exportPdf } from './utils'
import CommonStyle from 'styles/common.module.less'
import { AUTO_SAVE_INTERVAL, getUniqueUntitledName, getAutoFileName, UNTITLED_PREFIX } from './config'
import styles from 'app/index.module.less'
import MarkdownToolbar from './MarkdownToolbar'
import { SplitMode, FileList, FileName, EditFileTitleProps } from './types'

const EditFileTitle: React.FC<EditFileTitleProps> = ({ name }) => {
  const { t } = useTranslation()

  return (
    <div className={classNames('mt--1', CommonStyle.tagh2)}>
      {t('编辑')} {name || UNTITLED_PREFIX}
    </div>
  )
}

const MarkDown: React.FC = () => {
  const { t } = useTranslation()
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)
  const scrollSyncFlag = useRef<'editor' | 'preview' | null>(null)
  const splitContainerRef = useRef<HTMLDivElement>(null)

  const { theme } = useAppSelector((state) => state.global)
  const [content, setContent] = useState<string>('')
  const [fileList, setFileList] = useState<FileList>([])
  const [currentFile, setCurrentFile] = useState<FileName>('')
  const [splitMode, setSplitMode] = useState<SplitMode>('horizontal')
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState(false)
  const [editorSize, setEditorSize] = useState(50)

  const handleContentChange = async (val: string) => {
    setContent(val)
    await saveFileContent(currentFile, content)
  }

  const handleImportFile = () => {
    importInputRef.current?.click()
  }

  const onImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const content = reader.result as string
      const filename = file.name.replace(/\.md|\.markdown$/i, '')
      if (!fileList.includes(filename)) {
        const newList: FileList = [filename, ...fileList]
        setFileList(newList)
        await saveFileList(newList)
      }
      setCurrentFile(filename)
      setContent(content)
      await saveFileContent(filename, content)
      MessagePlugin.success(t('导入成功'))
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleSave = useCallback(async (isAuto: boolean = false) => {
    let finalName: FileName = currentFile
    const isUntitled = new RegExp(`^${UNTITLED_PREFIX}-\\d+$`).test(finalName)
    if (isUntitled && content.trim()) {
      const autoName = getAutoFileName(content, fileList)
      if (autoName) {
        finalName = autoName
      }
    }

    setCurrentFile(finalName)
    await saveFileContent(finalName, content)
    
    if (!isAuto) {
      const fList = await getFileList()
      const newList: FileList = [finalName, ...fList.filter(f => f !== currentFile)]
      await saveFileList(newList)
      setFileList(newList)
      MessagePlugin.success(t('已保存到文件'))
    }
  }, [currentFile, content])

  const handleNewFile = async () => {
    const filename: FileName = getUniqueUntitledName(fileList)
    const newList: FileList = [filename, ...fileList]
    setFileList(newList)
    await saveFileList(newList)
    setCurrentFile(filename)
    setContent('')
    MessagePlugin.success(t('新建文件成功'))
  }

  const handleRenameFile = async (oldName: FileName, newName: FileName) => {
    if (fileList.includes(newName)) {
      MessagePlugin.error(t('文件名已存在'))
      return
    }
    await renameFile(oldName, newName)
    const newList: FileList = await getFileList()
    setFileList(newList)
    if (currentFile === oldName) {
      setCurrentFile(newName)
      setContent(await getFileContent(newName))
    }
    MessagePlugin.success(t('重命名成功'))
  }

  const handleDeleteFile = async (filename: FileName) => {
    await deleteFile(filename)
    const newList: FileList = await getFileList()
    setFileList(newList)
    if (currentFile === filename && newList.length > 0) {
      setCurrentFile(newList[0])
      setContent(await getFileContent(newList[0]))
    }
    MessagePlugin.success(t('删除成功'))
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentFile||'moko'}.md`
    a.click()
    URL.revokeObjectURL(url)
    MessagePlugin.success(t('已下载'))
  }

  const handleHistorySelect = useCallback(async (filename: FileName) => {
    if (filename !== currentFile) {
      await handleSave(true)
      await setCurrentFile(filename)
      setContent(await getFileContent(filename))
      startTransition(() => {
        monacoEditorRef.current?.setScrollTop(0)
      })
    }
    setHistoryDrawerVisible(false)
  }, [handleSave, currentFile, monacoEditorRef.current])

  const handleExportPdf = async () => {
    if (!previewRef.current) {
      MessagePlugin.error(t('未找到预览区域'))
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
  }, [handleSave])

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
      setCurrentFile(UNTITLED_PREFIX)
    }
  }, [])

  useEffect(() => {
    initData()
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !splitContainerRef.current) return

      const rect = splitContainerRef.current.getBoundingClientRect()
      let newSize = 0

      if (splitMode === 'vertical') {
        newSize = ((e.clientY - rect.top) / rect.height) * 100
      } else {
        newSize = ((e.clientX - rect.left) / rect.width) * 100
      }

      if (newSize < 10) newSize = 10
      if (newSize > 90) newSize = 90
      
      setEditorSize(newSize)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, splitMode])

  useEffect(() => {
    setEditorSize(50)
  }, [splitMode])

  const renderSplit = useMemo(() => {
    const editorStyle = {
      flexBasis: splitMode === 'edit' || splitMode === 'preview' ? '100%' : `${editorSize}%`,
    }
    const previewStyle = {
      flexBasis: splitMode === 'edit' || splitMode === 'preview' ? '100%' : `${100 - editorSize}%`,
    }

    return (
      <div
        ref={splitContainerRef}
        className={classNames({
          [styles.splitHorizontal]: splitMode !== 'vertical',
          [styles.splitVertical]: splitMode === 'vertical',
        })}
      >
        <div
          className={classNames(
            'p-5',
            styles.splitPanel,
            styles.splitCardEdit,
            splitMode === 'preview' ? styles.hidden : ''
          )}
          style={editorStyle}
        >
          <EditFileTitle name={currentFile}/>
          <MarkdownEditor value={content} onChange={handleContentChange} ref={monacoEditorRef}/>
        </div>
        {splitMode !== 'edit' && splitMode !== 'preview' && (
          <div
            className={styles.splitter}
            onMouseDown={handleMouseDown}
          />
        )}
        <div
          className={classNames(
            'p-5',
            styles.splitPanel,
            styles.splitCardPreview,
            splitMode === 'edit' ? styles.hidden : ''
          )}
          style={previewStyle}
        >
          <div className={classNames('mt--1', CommonStyle.tagh2)}>{t('预览')}</div>
          <MarkdownPreview value={content} ref={previewRef}/>
        </div>
      </div>
    )
  }, [content, splitMode, currentFile, monacoEditorRef, previewRef, i18next.language, isDragging, editorSize])

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
        header={t('记录')}
        visible={historyDrawerVisible}
        placement="left"
        size={'320px'}
        onClose={() => setHistoryDrawerVisible(false)}
        footer={null}
        destroyOnClose={true}
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