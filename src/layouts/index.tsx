import React, { memo, useEffect } from 'react'
import { Drawer, Layout } from 'tdesign-react'
import throttle from 'lodash/throttle'
import { useTranslation } from 'react-i18next'
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
import i18next from 'i18n/config'
import Setting from './components/Setting'
import AppLayout from './components/AppLayout'
import Style from './index.module.less'

export default memo(() => {
  const { t } = useTranslation()
  const globalState = useAppSelector(selectGlobal)
  const dispatch = useAppDispatch()

  const AppContainer = AppLayout[globalState.isFullPage ? ELayout.fullPage : globalState.layout]

  useEffect(() => {
    dispatch(switchTheme(globalState.theme))
    dispatch(switchColor(globalState.color))
  }, [globalState.theme, globalState.color])

  useEffect(() => {
    i18next.changeLanguage(globalState.language)
  }, [globalState.language])

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

    const handleClose = async (event: BeforeUnloadEvent) => {
      await dispatch(cacheSetting())
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('beforeunload', handleClose)

    return () => {
      window.removeEventListener('beforeunload', handleClose)
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
        header={t('页面配置')}
        onClose={() => dispatch(toggleSetting())}
      >
        <Setting />
      </Drawer>
    </Layout>
  )
})
