import React, { memo } from 'react'
import { useAppDispatch, useAppSelector } from 'modules/store'
import {
  selectGlobal,
  switchTheme,
  switchColor,
  openSystemTheme,
} from 'modules/global'
import { useTranslation } from 'react-i18next'
import i18next from 'i18n/config'
import { ETheme, ESettingTheme } from 'types/index.d'
import RadioColor from './RadioColor'
import RadioRect from './RadioRect'

import Light from 'assets/svg/assets-setting-light.svg?component'
import Dark from 'assets/svg/assets-setting-dark.svg?component'
import System from 'assets/svg/assets-setting-auto.svg?component'

import Style from './index.module.less'

const themeList = [
  {
    value: ETheme.light,
    image: <Light />,
    name: i18next.t('明亮'),
  },
  {
    value: ETheme.dark,
    image: <Dark />,
    name: i18next.t('黑暗'),
  },
  {
    value: ESettingTheme.system,
    image: <System />,
    name: i18next.t('跟随系统'),
  },
]

export default memo(() => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const globalState = useAppSelector(selectGlobal)

  const handleThemeSwitch = (value: any) => {
    if (value === ESettingTheme.system) {
      dispatch(openSystemTheme())
    } else {
      dispatch(switchTheme(value))
      dispatch(switchColor(globalState.color))
    }
  }

  return (
    <div>
      <div className={Style.settingTitle}>{t('主题模式')}</div>
      <RadioRect
        defaultValue={globalState.systemTheme ? ESettingTheme.system : globalState.theme}
        onChange={handleThemeSwitch}
        options={themeList}
      />

      <div className={Style.settingTitle}>{t('主题色')}</div>
      <RadioColor defaultValue={globalState.color} onChange={(value) => dispatch(switchColor(value))} />
    </div>
  )
})
