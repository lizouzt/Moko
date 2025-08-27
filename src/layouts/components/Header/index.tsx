import React, { memo } from 'react'
import { Layout, Space } from 'tdesign-react'
import { useAppSelector } from 'modules/store'
import { selectGlobal } from 'modules/global'
import HeaderIcon from './HeaderIcon'
import MenuLogo from '../MenuLogo'
import Style from './index.module.less'

const { Header } = Layout

export default memo((props: { showMenu?: boolean; showLogo?: boolean }) => {
  const { showHeader, collapsed } = useAppSelector(selectGlobal)

  if (!showHeader) {
    return null
  }

  return (
    <Header className={Style.panel}>
      {props.showLogo ? <MenuLogo collapsed={collapsed} /> : null}
      <Space align='center'></Space>
      <HeaderIcon />
    </Header>
  )
})
