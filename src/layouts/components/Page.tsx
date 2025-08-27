import React, { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { selectGlobal, switchFullPage, ELayout } from 'modules/global'
import { Layout, Breadcrumb } from 'tdesign-react'
import classnames from 'classnames'
import Style from './Page.module.less'

const isSubMode = import.meta.env.VITE_SUBMODE === 'true'

const { Content } = Layout
const { BreadcrumbItem } = Breadcrumb

const Page = ({
  children,
  isFullPage,
  breadcrumbs,
  route,
}: React.PropsWithChildren<{ route?: IObject; isFullPage?: boolean; breadcrumbs: string[] }>) => {
  const globalState = useAppSelector(selectGlobal)
  const dispatch = useAppDispatch()
  const isTopLayout = useMemo(() => globalState.layout === ELayout.top, [globalState.layout])

  const breadCrumbVisible = useMemo(
    () => globalState.showBreadcrumbs && breadcrumbs.length > 1,
    [breadcrumbs, globalState],
  )

  useEffect(() => {
    dispatch(switchFullPage(isFullPage))
  }, [isFullPage])

  if (isFullPage) {
    return <>{children}</>
  }

  return (
    <React.Fragment>
      <Content
        className={classnames({
          [Style.panel]: true,
          [Style.topPanel]: isTopLayout,
          menuCollapsed: globalState.collapsed,
        })}
      >
        {breadCrumbVisible ? (
          <Breadcrumb className={Style.breadcrumb}>
            {breadcrumbs?.map((item, index) => (
              <BreadcrumbItem key={index}>{item}</BreadcrumbItem>
            ))}
          </Breadcrumb>
        ) : undefined}
        <div
          className={classnames({
            [Style.pageContent]: true,
            [Style.full]: !breadCrumbVisible,
          })}
        >
          {children}
        </div>
      </Content>
    </React.Fragment>
  )
}

export default React.memo(Page)
