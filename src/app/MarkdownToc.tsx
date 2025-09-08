import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Tooltip } from 'tdesign-react'
import { MenuIcon } from 'tdesign-icons-react'
import { useTranslation } from 'react-i18next'
import commonStyle from 'styles/common.module.less'
import styles from './index.module.less'
import { Button } from 'tdesign-react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface Props {
  previewRef: React.RefObject<HTMLDivElement>
  content: string
}

const MarkdownToc: React.FC<Props> = ({ previewRef, content }) => {
  const { t } = useTranslation()
  const [toc, setToc] = useState<TocItem[]>([])
  const [visible, setVisible] = useState(false)

  // 解析内容生成目录
  useEffect(() => {
    if (!previewRef.current) return
    const headings = Array.from(
      previewRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ) as HTMLHeadingElement[]
    const tocList: TocItem[] = headings.map((el) => ({
      id: el.id || el.textContent || '',
      text: el.textContent || '',
      level: Number(el.tagName[1]),
    }))
    setToc(tocList)
  }, [content, visible])

  // 点击目录跳转
  const handleClick = (id: string) => {
    if (!previewRef.current) return
    const target = previewRef.current.querySelector(`#${CSS.escape(id)}`)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!visible || toc.length === 0) return (
    <Tooltip content={t('目录')}>
      <Button 
        variant="text"
        icon={<MenuIcon />}
        className={styles.tocToggleBtn} 
        onClick={() => setVisible(true)}
      />
    </Tooltip>
  )

  return (
    <div className={styles.tocFloatBox}>
      <div className={styles.tocHeader}>
        <span>{t('目录')}</span>
        <span className={styles.tocClose} onClick={() => setVisible(!visible)}>×</span>
      </div>
      <div className={classNames(commonStyle.scrollbar, styles.tocContent)}>
        <ul className={styles.tocList}>
        {toc.map(item => (
          <li
            key={item.id}
            className={styles[`tocLevel${item.level}`]}
            onClick={() => handleClick(item.id)}
            title={item.text}
          >
            {item.text}
          </li>
        ))}
      </ul>
      </div>
    </div>
  )
}

export default MarkdownToc