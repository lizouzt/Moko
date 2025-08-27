import React, { useMemo } from 'react'
import { useAppSelector } from 'modules/store'
import { selectGlobal } from 'modules/global'

export type AuthCode = string

const AuthHOC = (
  props: React.PropsWithChildren<{
    /** 功能权限标识 */
    authKey?: AuthCode | AuthCode[]
    /** 父级页面权限标识 */
    parentKey?: AuthCode
    /** 无权限时渲染 */
    childForForbidden?: JSX.Element
  }>,
) => {
  const { authKey, parentKey, childForForbidden } = props

  const { btnAuthMap } = useAppSelector(selectGlobal)

  const inAuthMap = (key: AuthCode) => {
    const auth = parentKey ? `${parentKey}_${key}` : key
    return !!auth && auth in btnAuthMap
  }

  const show: boolean = useMemo(() => {
    if (Array.isArray(authKey)) {
      return authKey.some((key) => inAuthMap(key))
    }
    if (authKey) {
      return inAuthMap(authKey)
    }
    return false
  }, [authKey])

  if (!!parentKey && !authKey) {
    return (
      <React.Fragment>
        {React.Children.map(props.children, (child, index) => {
          if (React.isValidElement(child)) {
            if ((child.type as any).displayName === 'AuthHOC') {
              return React.cloneElement(child, {
                key: `authhoc-group-item-${index}`,
                ...child.props,
                authKey: `${parentKey}_${child.props.authKey}`,
              })
            }
            return React.cloneElement(child, {
              key: `authhoc-group-item-${index}`,
              ...child.props,
            })
          }
        })}
      </React.Fragment>
    )
  }
  return show ? <React.Fragment>{props.children}</React.Fragment> : childForForbidden || null
}

AuthHOC.displayName = 'AuthHOC'

export default AuthHOC
