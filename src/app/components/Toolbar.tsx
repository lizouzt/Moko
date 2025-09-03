import React from 'react'
import styles from '../index.module.less'

interface ToolbarProps {
  left?: React.ReactNode
  right?: React.ReactNode
  className?: string
}

const Toolbar: React.FC<ToolbarProps> = ({ left, right, className }) => (
  <div className={`${styles.toolbar} ${className ?? ''}`}>
    <div className={styles.toolbarLeft}>{left}</div>
    <div className={styles.toolbarRight}>{right}</div>
  </div>
)

export default Toolbar