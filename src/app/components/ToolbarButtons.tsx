import React from 'react'
import { Space, Button, Tooltip, Dropdown } from 'tdesign-react'
import { MoreIcon } from 'tdesign-icons-react'
import styles from '../index.module.less'

interface ToolbarButton {
  key: string
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>> 
  tooltip: string
  onClick: () => void
}

interface ToolbarButtonsProps {
  buttons: ToolbarButton[]
  moreButtons?: ToolbarButton[]
  isMobile?: boolean
}

const ToolbarButtons: React.FC<ToolbarButtonsProps> = ({ buttons, moreButtons = [], isMobile = false }) => (
  <Space align="center" size={8} className={styles.markdownToolbar}>
    {buttons.map(btn => (
      <Tooltip key={btn.key} content={btn.tooltip} placement="bottom">
        <Button
          shape="circle"
          variant="text"
          size="large"
          icon={btn.icon}
          onClick={btn.onClick}
        />
      </Tooltip>
    ))}
    {isMobile && moreButtons.length > 0 && (
      <Dropdown
        placement="bottom"
        trigger="click"
        options={moreButtons}
      >
        <Button shape="circle" variant="text" size="large" icon={<MoreIcon />} />
      </Dropdown>
    )}
  </Space>
)

export default ToolbarButtons