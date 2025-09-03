import React, { useCallback, useState } from 'react'
import { Space, Button, Tooltip, Radio, Dropdown } from 'tdesign-react'
import { MenuUnfoldIcon, SaveIcon, AddIcon, DownloadIcon, MoreIcon, FileImportIcon, FileExportIcon, SettingIcon } from 'tdesign-icons-react'
import { useAppDispatch } from 'modules/store'
import { toggleSetting } from 'modules/global'
import MarkdownToolbarButtons from './MarkdownToolbarButtons'
import styles from './index.module.less'

type SplitMode = 'vertical' | 'horizontal' | 'edit' | 'preview'

interface Props {
  monacoEditorRef: React.RefObject<any>
  splitMode: SplitMode
  setSplitMode: (mode: SplitMode) => void
  onNewFile: () => void
  onImport: () => void
  onSave: () => void
  onDownload: () => void
  onExportPdf: () => void
  onShowHistory: () => void
}

enum RightBtnEvent {
  New = 'onNewFile',
  Import = 'onImport',
  Save = 'onSave',
  Download = 'onDownload',
  Pdf = 'onExportPdf',
  Setting = 'onSetting',
}

const rightButtons = [
  { key: 'new', icon: <AddIcon />, tooltip: '新建', onClick: RightBtnEvent.New },
  { key: 'import', icon: <FileImportIcon />, tooltip: '导入', onClick: RightBtnEvent.Import },
  { key: 'save', icon: <SaveIcon />, tooltip: '保存', onClick: RightBtnEvent.Save },
  { key: 'download', icon: <DownloadIcon />, tooltip: '下载', onClick: RightBtnEvent.Download },
  { key: 'pdf', icon: <FileExportIcon />, tooltip: '导出PDF', onClick: RightBtnEvent.Pdf },
  { key: 'setting', icon: <SettingIcon />, tooltip: '设置', onClick: RightBtnEvent.Setting },
]

/** 小屏幕适配尺寸阈值 */
const MINIVIEWWIDTH = 800

const MarkdownToolbar: React.FC<Props> = ({
  monacoEditorRef, splitMode, setSplitMode, onShowHistory, ...restProps
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MINIVIEWWIDTH)
  const [exporting, setExporting] = useState(false)
  const dispatch = useAppDispatch()

  const buttonHandlers = useCallback(async (key: RightBtnEvent) => {
    if (key === RightBtnEvent.Setting) {
      dispatch(toggleSetting())
    } else if (key === RightBtnEvent.Pdf) {
      setExporting(true)
      await restProps[key]()
      setExporting(false)
    } else {
      await restProps[key as keyof typeof restProps]?.()
    }
  }, [])

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MINIVIEWWIDTH)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className={styles.toolbar}>
      <Space align="center" size={16} className={styles.toolbarLeft}>
        <Tooltip content="记录" placement='bottom'>
          <Button
            shape="circle"
            variant="text"
            size="large"
            icon={<MenuUnfoldIcon />}
            onClick={onShowHistory}
          />
        </Tooltip>
        <MarkdownToolbarButtons editorRef={monacoEditorRef} />
        <Radio.Group
          value={splitMode}
          onChange={val => setSplitMode(val as SplitMode)}
          variant="outline"
          size="small"
        >
          <Radio.Button value="horizontal">左右分屏</Radio.Button>
          <Radio.Button value="vertical">上下分屏</Radio.Button>
          <Radio.Button value="edit">仅编辑</Radio.Button>
          <Radio.Button value="preview">仅预览</Radio.Button>
        </Radio.Group>
      </Space>
      <Space align="center" size={8} className={styles.toolbarRight}>
        {
          (isMobile ? rightButtons.slice(0, 2) : rightButtons).map(btn => (
            <Tooltip key={btn.key} content={btn.tooltip} placement="bottom">
              <Button
                shape="circle"
                variant="text"
                size="large"
                icon={btn.icon}
                onClick={() => buttonHandlers(btn.onClick)}
              />
            </Tooltip>
          ))
        }
        {isMobile ? (
          <Dropdown
            placement="bottom"
            trigger="click"
            options={rightButtons.slice(2).map(item => ({
              value: item.key,
              content: item.tooltip,
              prefixIcon: item.icon,
              loading: item.onClick === RightBtnEvent.Pdf && exporting,
              onClick: () => buttonHandlers(item.onClick),
            }))}
          >
            <Button shape="circle" variant="text" size="large" icon={<MoreIcon />} />
          </Dropdown>
        ) : null}
      </Space>
    </div>
  )
}

export default MarkdownToolbar