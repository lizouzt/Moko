import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from 'modules/store'
import { selectUser, getUser } from 'modules/user'
import { getToken, isTokenExpire } from 'utils/auth'
import config from 'configs/host'

const isInWhiteList = (pathname: string): boolean =>
  config.authWhiteList.findIndex((item) => {
    const reg = new RegExp(`^${item}(/|$)`)
    return reg.test(pathname)
  }) > -1

const useAuthVerify = (): boolean => {
  const [isAuthrized, setIsAuthrized] = useState(true)
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()
  const { userInfo } = useAppSelector(selectUser)

  useEffect(() => {
    const check = async () => {
      const hasToken = getToken()
      const isExpired = isTokenExpire()

      if (isInWhiteList(pathname)) {
        setIsAuthrized(true)
      } else {
        const valid = !!hasToken && !isExpired
        setIsAuthrized(valid)

        if (valid && !userInfo.name) {
          await dispatch(getUser())
        }
      }

      return () => {
        setIsAuthrized(false)
      }
    }

    check()
  }, [pathname])

  return isAuthrized
}

export default useAuthVerify
