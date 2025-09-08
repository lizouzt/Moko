import React from 'react'
import { Space, Button, Tooltip, Dropdown, Menu } from 'tdesign-react'
import {
  TextformatBoldIcon, TextformatItalicIcon, QuoteIcon, CodeIcon,
  ListIcon, LinkIcon, ImageIcon, ViewListIcon, MoreIcon,
} from 'tdesign-icons-react'
import i18next from 'i18n/config'
import styles from './index.module.less'

const markdownToolbar = [
  { key: 'bold', icon: <TextformatBoldIcon />, tooltip: i18next.t('加粗'), insert: `**${i18next.t('粗体内容')}**`, select: [2, 6] },
  { key: 'italic', icon: <TextformatItalicIcon />, tooltip: i18next.t('斜体'), insert: `*${i18next.t('斜体内容')}*`, select: [1, 5] },
  { key: 'quote', icon: <QuoteIcon />, tooltip: i18next.t('引用'), insert: `\n> ${i18next.t('引用内容')}\n`, select: [3, 7] },
  { key: 'code', icon: <CodeIcon />, tooltip: i18next.t('代码块'), insert: `\n\`\`\`js\n${i18next.t('代码内容')}\n\`\`\`\n`, select: [7, 11] },
  { key: 'ul', icon: <ViewListIcon />, tooltip: i18next.t('无序列表'), insert: `\n- ${i18next.t('列表项')}1\n- ${i18next.t('列表项')}2\n`, select: [3, 7] },
  { key: 'ol', icon: <ListIcon />, tooltip: i18next.t('有序列表'), insert: `\n1. ${i18next.t('列表项')}1\n2. ${i18next.t('列表项')}2\n`, select: [3, 7] },
  { key: 'link', icon: <LinkIcon />, tooltip: i18next.t('链接'), insert: `[${i18next.t('链接文本')}](https://)`, select: [1, 5] },
  { key: 'image', icon: <ImageIcon />, tooltip: i18next.t('图片'), insert: '![alt](url)', select: [2, 5] },
]

interface Props {
  editorRef: React.RefObject<any>
}

/** 小屏幕适配尺寸阈值 */
const MINIVIEWWIDTH = 900

const mainButtons = markdownToolbar.slice(0, 3) // 主功能按钮
const moreButtons = markdownToolbar.slice(3)    // 收纳到菜单

const MarkdownToolbarButtons: React.FC<Props> = ({ editorRef }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= MINIVIEWWIDTH)

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MINIVIEWWIDTH)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleToolbarClick = (item: typeof markdownToolbar[0]) => {
    if (!editorRef.current) return
    // monaco-editor
    if (editorRef.current.getModel) {
    const editor = editorRef.current
    const selection = editor.getSelection()
    const pos = selection ? editor.getModel().getOffsetAt(selection.getStartPosition()) : 0
    const value = editor.getValue()
    const before = value.slice(0, pos)
    const after = value.slice(pos)
    editor.setValue(before + item.insert + after)
    // 选中插入内容
    const start = before.length + (item.select ? item.select[0] : 0)
    const end = before.length + (item.select ? item.select[1] : item.insert.length)
    editor.setSelection({
        startLineNumber: editor.getModel().getPositionAt(start).lineNumber,
        startColumn: editor.getModel().getPositionAt(start).column,
        endLineNumber: editor.getModel().getPositionAt(end).lineNumber,
        endColumn: editor.getModel().getPositionAt(end).column,
    })
    editor.focus()
    return
    }
    // textarea
    const textarea = editorRef.current as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const value = textarea.value
    const before = value.substring(0, start)
    const after = value.substring(end)
    textarea.value = before + item.insert + after
    textarea.selectionStart = start + (item.select ? item.select[0] : 0)
    textarea.selectionEnd = start + (item.select ? item.select[1] : item.insert.length)
    textarea.focus()
    // 触发onChange
    const event = new Event('input', { bubbles: true })
    textarea.dispatchEvent(event)
  }

  return (
    <Space align="center" size={2} className={styles.markdownToolbar}>
      {(isMobile ? mainButtons : markdownToolbar).map(item => (
        <Tooltip key={item.key} content={item.tooltip} showArrow placement="bottom-left">
          <Button
            shape="circle"
            variant="text"
            size="medium"
            icon={item.icon}
            onClick={() => handleToolbarClick(item)}
          />
        </Tooltip>
      ))}
      {isMobile && (
        <Dropdown
          placement="bottom"
          trigger="click"
          options={moreButtons.map(item => ({
            value: item.key,
            prefixIcon: item.icon,
            content: item.tooltip,
            onClick: () => handleToolbarClick(item),
          }))}
        >
          <Button shape="circle" variant="text" size="medium" icon={<MoreIcon />} />
        </Dropdown>
      )}
    </Space>
  )
}

export default MarkdownToolbarButtons