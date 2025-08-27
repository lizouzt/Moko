import { useCallback } from 'react'

const screenHeight = window.screen.height
const screenWidth = window.screen.width

const useHeaderScroll = (ref) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
      console.error('`useHeaderScroll` expects a single ref argument.')
    }
  }

  const scrollHandle = useCallback(
    (scrollY: Number) => {
      if (screenWidth < 768 || !ref.current) {
        return false
      }

      if (scrollY > screenHeight * 0.1 && scrollY < screenHeight * 0.9) {
        ref.current.classList.add('fadeOut')
      } else {
        ref.current.classList.remove('fadeOut')

        if (scrollY < screenHeight * 0.15) {
          ref.current.classList.remove('opaque')
        } else {
          ref.current.classList.add('opaque')
        }
      }
    },
    [ref],
  )

  window.addEventListener('scroll', () => {
    scrollHandle(window.scrollY)
  })
}

export default useHeaderScroll
