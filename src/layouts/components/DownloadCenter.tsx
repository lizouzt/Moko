import React, { useState, useMemo, useCallback, useImperativeHandle } from 'react'
import { Dialog, MessagePlugin } from 'tdesign-react'
import { CloudDownloadIcon, TimeIcon, CheckCircleIcon, ErrorCircleIcon } from 'tdesign-icons-react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { switchDCenter, selectGlobal } from 'modules/global/index'
import PageLoadingMask from 'layouts/components/PageLoadingMask'
import { commonAction, exportFile } from 'services/basic'

export interface IDCRef {
  /** 打开 */
  open: Function
  /** 刷新 */
  refresh: Function
}

const searchList = commonAction('downloadFileRecord', 'list', 'get')

const Tip = styled.div`
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  text-align: center;
  margin: 20px 0 0;
`

const List = styled.div`
  max-height: 399px;
  overflow-y: auto;
`
const ItemRow = styled.div`
  background-color: var(--td-bg-color-container);
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;
  font-size: 14px;
  > div {
    &:nth-child(1) {
      color: var(--td-text-color-primary);
      width: 300px;
    }
    &:nth-child(2) {
      color: var(--td-text-color-primary);
      width: 60px;
    }
    &:nth-child(3) {
      color: var(--td-text-color-placeholder);
      width: 80px;
    }
    &:nth-child(4) {
      color: var(--td-text-color-placeholder);
    }
    &:nth-child(5) {
      width: 80px;
      text-align: right;
      cursor: pointer;
    }
  }
`

const Item = ({ name, id, createTime, createUser, status }: any) => {
  const doDownload = useCallback(async () => {
    await exportFile({
      url: '/downloadFileRecord/download',
      method: 'get',
      data: { id },
    })

    MessagePlugin.success('下载成功')
  }, [id])

  return (
    <ItemRow>
      <div>{name}</div>
      <div>
        {status?.value === 0 ? <TimeIcon color={'gray'} /> : null}
        {status?.value === 1 ? <CheckCircleIcon color={'green'} /> : null}
        {status?.value === 2 ? <ErrorCircleIcon color={'red'} /> : null}
        {status?.desc}
      </div>
      <div className='elps-1'>{createUser}</div>
      <div>{createTime}</div>
      <div>
        {status?.value === 1 ? (
          <CloudDownloadIcon size={20} color={'var(--td-brand-color)'} onClick={() => doDownload()} />
        ) : null}
      </div>
    </ItemRow>
  )
}

export default React.memo(
  React.forwardRef<IDCRef>((props, ref) => {
    const dispatch = useAppDispatch()
    const { showDCenter } = useAppSelector(selectGlobal)

    const [loading, setLoading] = useState(false)
    const [info, setInfo] = useState([])

    const doSearch = useCallback(async () => {
      setLoading(true)
      const { code, data } = await searchList({})
      setLoading(false)

      if (code === 2000) {
        setInfo(data)
      }
    }, [])

    const setVisible = useCallback((flag: boolean) => {
      dispatch(switchDCenter(flag))
    }, [])

    useImperativeHandle(
      ref,
      (): IDCRef => ({
        refresh: () => {
          doSearch()
        },
        open: () => setVisible(true),
      }),
    )

    const items = useMemo(() => info.map((item: any) => <Item {...item} key={item.id} />), [info])

    return (
      <Dialog
        header='导出中心'
        width={798}
        footer={false}
        destroyOnClose
        visible={showDCenter}
        onClose={() => {
          setVisible(false)
        }}
        onOpened={() => {
          doSearch()
        }}
        style={{
          paddingBottom: '0',
          minHeight: '190px',
          backgroundColor: 'var(--td-bg-color-container)',
          backgroundImage:
            'linear-gradient(to right top, var(--td-bg-color-container), var(--td-bg-color-container) 20%, #ff000010,#ffa50010,#ffff0020,#00800020,#0000ff10,#4b008210,#ee82ee20)',
        }}
      >
        <List className='scrollbar'>
          <PageLoadingMask loading={loading} />
          {items}
        </List>

        <Tip>仅展示近7天的导出记录</Tip>
      </Dialog>
    )
  }),
)
