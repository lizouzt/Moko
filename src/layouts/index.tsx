import React, { memo, useEffect } from 'react'
import { Drawer, Layout } from 'tdesign-react'
import throttle from 'lodash/throttle'
import { useAppSelector, useAppDispatch } from 'modules/store'
import {
  selectGlobal,
  toggleSetting,
  toggleMenu,
  ELayout,
  switchTheme,
  switchColor,
  cacheSetting,
  restoreSetting,
  Platform,
  updatePlatform,
} from 'modules/global'
import Setting from './components/Setting'
import AppLayout from './components/AppLayout'
import Style from './index.module.less'

export default memo(() => {
  const globalState = useAppSelector(selectGlobal)
  const dispatch = useAppDispatch()

  const AppContainer = AppLayout[globalState.isFullPage ? ELayout.fullPage : globalState.layout]

  useEffect(() => {
    dispatch(switchTheme(globalState.theme))
    dispatch(switchColor(globalState.color))
  }, [globalState.theme, globalState.color])

  useEffect(() => {
    dispatch(restoreSetting())

    const handleResize = throttle(() => {
      if (window.innerWidth < 900) {
        dispatch(updatePlatform())
        dispatch(toggleMenu(true))
      } else if (window.innerWidth > 1000) {
        dispatch(toggleMenu(false))
      }
    }, 100)
    const handleShutDown = () => dispatch(cacheSetting())

    window.addEventListener('resize', handleResize)
    window.addEventListener('beforeunload', handleShutDown)

    return () => {
      window.removeEventListener('beforeunload', handleShutDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Layout className={Style.panel}>
      <AppContainer />
      <Drawer
        destroyOnClose
        visible={globalState.setting}
        className={Style.settingDrawer}
        size={globalState.platform === Platform.PC ? '458px' : '100%'}
        footer={false}
        header='页面配置'
        onClose={() => dispatch(toggleSetting())}
      >
        <Setting />
      </Drawer>
    </Layout>
  )
})
