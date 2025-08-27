import React, { memo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { name as appName } from '../../../package.json'
import useRipple, { RippleTriggerType, RippleType } from 'hooks/useRipple'
import FullLogo from 'assets/svg/assets-logo-full.svg?component'
import Style from './Menu.module.less'

interface IProps {
  collapsed?: boolean
}

export default memo((props: IProps) => {
  const imgRef = useRef<HTMLDivElement>(null)
  useRipple(imgRef, 'var(--td-brand-color)', { trigger: RippleTriggerType.HOVER, type: RippleType.LINE })

  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/')
  }

  return (
    <div className={Style.menuLogo} onClick={handleClick} ref={imgRef}>
      {props.collapsed ? (
        <FullLogo />
      ) : (
        <div className='flex jc-start'>
          <FullLogo />
          <div className={Style.title}>{appName}</div>
        </div>
      )}
    </div>
  )
})
