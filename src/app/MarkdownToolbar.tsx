import React, { useCallback, useState, useEffect } from 'react'
import { Space, Button, Tooltip, Radio, Dropdown, Menu } from 'tdesign-react'
import {
  MenuUnfoldIcon, SaveIcon, AddIcon, DownloadIcon, MoreIcon,
  FileImportIcon, FileExportIcon, SettingIcon
} from 'tdesign-icons-react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18n/config'
import { useAppDispatch } from 'modules/store'
import { toggleSetting } from 'modules/global'
import MarkdownToolbarButtons from './MarkdownToolbarButtons'
import Toolbar from './components/Toolbar'
import ToolbarButtons from './components/ToolbarButtons'
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
  { key: 'new', icon: <AddIcon />, tooltip: i18next.t('新建'), onClick: RightBtnEvent.New },
  { key: 'import', icon: <FileImportIcon />, tooltip: i18next.t('导入'), onClick: RightBtnEvent.Import },
  { key: 'save', icon: <SaveIcon />, tooltip: i18next.t('保存'), onClick: RightBtnEvent.Save },
  { key: 'download', icon: <DownloadIcon />, tooltip: i18next.t('下载'), onClick: RightBtnEvent.Download },
  { key: 'pdf', icon: <FileExportIcon />, tooltip: i18next.t('导出PDF'), onClick: RightBtnEvent.Pdf },
  { key: 'setting', icon: <SettingIcon />, tooltip: i18next.t('设置'), onClick: RightBtnEvent.Setting },
]

/** 小屏幕适配尺寸阈值 */
const MINIVIEWWIDTH = 800

const MarkdownToolbar: React.FC<Props> = ({
  monacoEditorRef, splitMode, setSplitMode, onShowHistory, ...restProps
}) => {
  const { t } = useTranslation()
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
  }, [dispatch, restProps])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MINIVIEWWIDTH)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // 右侧按钮分组
  const mainRightButtons = isMobile ? rightButtons.slice(0, 2) : rightButtons
  const moreRightButtons = isMobile ? rightButtons.slice(2) : []

  return (
    <Toolbar left={
        <Space align="center" size={16} className={styles.toolbarLeft}>
          <Tooltip content={t('记录')} placement='bottom'>
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
            <Radio.Button value="horizontal">{t('左右分屏')}</Radio.Button>
            <Radio.Button value="vertical">{t('上下分屏')}</Radio.Button>
            <Radio.Button value="edit">{t('仅编辑')}</Radio.Button>
            <Radio.Button value="preview">{t('仅预览')}</Radio.Button>
          </Radio.Group>
        </Space>
      }
      right={
        <Space align="center" size={8} className={styles.toolbarRight}>
          <ToolbarButtons
            buttons={mainRightButtons.map(btn => ({
              key: btn.key,
              icon: btn.icon,
              tooltip: btn.tooltip,
              onClick: () => buttonHandlers(btn.onClick),
            }))}
          />
          {isMobile && moreRightButtons.length > 0 && (
            <Dropdown
              placement="bottom"
              trigger="click"
              options={moreRightButtons.map(item => ({
                value: item.key,
                content: item.tooltip,
                prefixIcon: item.icon,
                loading: item.onClick === RightBtnEvent.Pdf && exporting,
                onClick: () => buttonHandlers(item.onClick),
              }))}
            >
              <Button shape="circle" variant="text" size="large" icon={<MoreIcon />} />
            </Dropdown>
          )}
        </Space>
      }
    />
  )
}

export default MarkdownToolbar