import React from 'react'
import classnames from 'classnames'
import { Loading } from 'tdesign-react'
import styled from 'styled-components'

const FixedMask = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  position: absolute;
  pointer-events: none;
  z-index: 3;
  top: 0;
  left: 0;
`

interface PageLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  loading: boolean
}

export default (props: PageLoadingProps) => {
  const { loading, className, ...rest } = props

  return loading ? (
    <FixedMask className={classnames('pageLoading', className)} {...rest}>
      <Loading />
    </FixedMask>
  ) : null
}
