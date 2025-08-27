import React, { useRef, useEffect, forwardRef, useImperativeHandle, useLayoutEffect } from 'react'
import * as monaco from 'monaco-editor'
import style from 'app/index.module.less'
import { useAppSelector } from 'modules/store'

interface Props {
  value: string
  onChange: (val: string) => void
}

const MonacoMarkdownEditor = forwardRef(({ value, onChange }: Props, ref) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const { theme } = useAppSelector((state) => state.global)
  const monacoInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useImperativeHandle(ref, () => monacoInstance.current)
  
  useEffect(() => {
    if (editorRef?.current) {
      monacoInstance.current = monaco.editor.create(editorRef?.current, {
        value,
        language: 'markdown',
        theme: theme === 'light' ? 'vs' : 'vs-dark',
        automaticLayout: true,
        fontSize: 13,
        minimap: { enabled: true },
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
      })

      monacoInstance.current.onDidChangeModelContent(() => {
        const val = monacoInstance.current?.getValue() || ''
        onChange(val)
      })
    }
    return () => {
      monacoInstance.current?.dispose()
    }
    // eslint-disable-next-line
  }, [])

  // 外部 value 变化时同步到编辑器
  useEffect(() => {
    if (monacoInstance.current && value !== monacoInstance.current.getValue()) {
      monacoInstance.current.setValue(value)
    }
  }, [value])

  // 同步主题模式变化
  useEffect(() => {
    monacoInstance.current?.updateOptions({ 
      theme: theme === 'light' ? 'vs' : 'vs-dark' 
    })
  }, [theme])

  return (
    <div
      className={style.editorContainer}
      ref={editorRef}
    />
  )
})

export default MonacoMarkdownEditor