import React from 'react'
import { Layout, Row } from 'tdesign-react'
import { useAppSelector } from 'modules/store'
import { selectGlobal } from 'modules/global'

const { Footer: TFooter } = Layout

const Footer = () => {
  const globalState = useAppSelector(selectGlobal)
  if (!globalState.showFooter) {
    return null
  }

  return (
    <TFooter className='pt-0 pb-3'>
      <Row justify='center'>Copyright @ 2021-2025 BN. All Rights Reserved</Row>
    </TFooter>
  )
}

export default React.memo(Footer)
