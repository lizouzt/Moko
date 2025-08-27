import React, { useState } from 'react';
import { Space, Button, Tooltip, Radio } from 'tdesign-react';
import { MenuUnfoldIcon, SaveIcon, AddIcon, DownloadIcon, FileImportIcon, FileExportIcon, SettingIcon } from 'tdesign-icons-react';
import { useAppDispatch } from 'modules/store'
import { toggleSetting } from 'modules/global';
import MarkdownToolbarButtons from './MarkdownToolbarButtons';
import styles from './index.module.less';

type SplitMode = 'vertical' | 'horizontal' | 'edit' | 'preview';

interface Props {
  monacoEditorRef: React.RefObject<any>;
  splitMode: SplitMode;
  setSplitMode: (mode: SplitMode) => void;
  onNewFile: () => void;
  onImport: () => void;
  onSave: () => void;
  onDownload: () => void;
  onExportPdf: () => void;
  onShowHistory: () => void;
}

const MarkdownToolbar: React.FC<Props> = ({
  monacoEditorRef, splitMode, setSplitMode,
  onNewFile, onImport, onSave, onDownload, 
  onExportPdf, onShowHistory
}) => {
  const [exporting, setExporting] = useState(false)
  const dispatch = useAppDispatch()

  const onSetting = () => {
    dispatch(toggleSetting())
  }

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
        <Tooltip placement='bottom' showArrow content="新建文件" >
          <Button size="small" icon={<AddIcon />} onClick={onNewFile} />
        </Tooltip>
        <Tooltip placement='bottom' showArrow content="导入本地Markdown">
          <Button size="small" icon={<FileImportIcon />} onClick={onImport} />
        </Tooltip>
        <Tooltip placement='bottom' showArrow content="保存到记录">
          <Button size="small" theme="primary" icon={<SaveIcon />} onClick={onSave} />
        </Tooltip>
        <Tooltip placement='bottom' showArrow content="下载 Markdown">
          <Button size="small" icon={<DownloadIcon />} onClick={onDownload} />
        </Tooltip>
        <Tooltip placement='bottom' showArrow content="导出预览 PDF">
          <Button size="small" icon={<FileExportIcon />} 
            onClick={async () => {
              setExporting(true)
              await onExportPdf()
              setExporting(false)
            }}
            loading={exporting}
          />
        </Tooltip>

        <Tooltip placement='bottom' showArrow content="设置">
          <Button size="small" icon={<SettingIcon />} variant="text" onClick={onSetting} />
        </Tooltip>
      </Space>
    </div>
  )
}

export default MarkdownToolbar;