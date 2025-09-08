import React from 'react'
import { EditIcon, DeleteIcon } from 'tdesign-icons-react'
import { Button, Popconfirm } from 'tdesign-react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import CommonStyle from 'styles/common.module.less'
import styles from './index.module.less'
import PopconfirmBox from 'components/PopconfirmBox'

interface Props {
  list: string[];
  onSelect: (item: string) => void;
  selected: string | null;
  onRename: Function
  onDelete: Function
}

const MarkdownHistory: React.FC<Props> = ({ list, onSelect, selected, onRename, onDelete }) => {
  const { t } = useTranslation()

  return (
    <div className={classNames(CommonStyle.scrollbar, styles.historyListWrapper)}>
      <ul className={styles.historyList}>
        {list.length === 0 && <li className={styles.historyListEmpty}>{t('暂无文件')}</li>}
        {list.filter(item => item.constructor === String).map((item, idx) => (
          <li
            key={item}
            className={classNames(styles.historyListItem, {
              [styles.historyListItemSelected]: selected === item
            })}
            title={item}
          >
            <span className={styles.historyListItemName} onClick={() => onSelect(item)}>
              {item.slice(0, 30)}
            </span>
            <span className={styles.historyListItemActions}>
              <PopconfirmBox 
                placement='bottom'
                title={`${t('重命名')}“${item.slice(-10)}”？`} 
                onConfirm={({ reason: newName }) => onRename(item, newName)}>
                <Button
                  className="ml-2"
                  title={t('重命名')}
                  icon={<EditIcon />}
                  size="small"
                  variant="text"
                />
              </PopconfirmBox>
              <Popconfirm 
                placement='bottom'
                content={`${t('确认删除文件')}“${item.slice(-6)}”？`} 
                onConfirm={() => onDelete(item)}>
                <Button
                  className="ml-2"
                  title={t('删除')}
                  icon={<DeleteIcon />}
                  size="small"
                  variant="text"
                  disabled={list.length === 1}
                />
              </Popconfirm>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MarkdownHistory