import React from 'react'
import { Layout } from 'tdesign-react'
import { ELayout } from 'modules/global'
import Header from './Header'
import Footer from './Footer'
import classnames from 'classnames'
import App from 'app'

import Style from './AppLayout.module.less'

const SideLayout = React.memo(() => {

  return (
    <Layout className={classnames(Style.sidePanel, 'narrow-scrollbar')}>
      <Layout className={Style.sideContainer}>
        <Header />
        <App />
        <Footer />
      </Layout>
    </Layout>
  )
})

const TopLayout = React.memo(() => {
  return (
    <Layout className={Style.topPanel}>
      <Header showMenu />
      <App />
      <Footer />
    </Layout>
  )
})

const MixLayout = React.memo(() => {
  return (
    <Layout className={Style.mixPanel}>
      <Header showLogo />
      <Layout className={Style.mixMain}>
        <Layout className={Style.mixContent}>
          <App />
          <Footer />
        </Layout>
      </Layout>
    </Layout>
  )
})

const FullPageLayout = React.memo(() => {
  return <App />
})

const LayoutMap: Record<ELayout, React.MemoExoticComponent<() => JSX.Element>> = {
  [ELayout.side]: SideLayout,
  [ELayout.top]: TopLayout,
  [ELayout.mix]: MixLayout,
  [ELayout.fullPage]: FullPageLayout,
}

export default LayoutMap
