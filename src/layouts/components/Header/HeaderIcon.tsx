import React, { memo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Popup, Dropdown, Space } from 'tdesign-react'
import { Icon, SettingIcon, UserCircleIcon, CloudDownloadIcon } from 'tdesign-icons-react'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { toggleSetting } from 'modules/global'
import DDCenter, { IDCRef } from 'layouts/components/DownloadCenter'
import Style from './HeaderIcon.module.less'

const { DropdownMenu, DropdownItem } = Dropdown

export default memo(() => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { userInfo } = useAppSelector((state) => state.user)
  const ddRef = useRef<IDCRef>(null)

  const clickHandler = (data: any) => {
    if (data.value === 1) {
      navigate('/user/index')
    }
  }

  return (
    <>
      <Space align='center'>
        <Button variant='text' className={Style.dropdown} onClick={() => ddRef.current?.open()}>
          <CloudDownloadIcon className={Style.icon} />
        </Button>
        <Dropdown trigger={'click'} onClick={clickHandler}>
          <Button variant='text' className={Style.dropdown}>
            <Icon name='user-circle' className={Style.icon} />
            <span className={Style.text}>{userInfo.name}</span>
            <Icon name='chevron-down' className={Style.icon} />
          </Button>
          <DropdownMenu>
            <DropdownItem value={1}>
              <div className={Style.dropItem}>
                <UserCircleIcon />
                <span>个人中心</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Popup content='页面设置' placement='bottom' showArrow destroyOnClose>
          <Button
            className={Style.menuIcon}
            shape='square'
            size='large'
            variant='text'
            onClick={() => dispatch(toggleSetting())}
            icon={<SettingIcon />}
          />
        </Popup>
      </Space>
      <DDCenter ref={ddRef} />
    </>
  )
})
