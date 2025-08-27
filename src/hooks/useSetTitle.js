import { useEffect } from 'react'

const useSetTitle = function (title) {
  useEffect(() => {
    document.title = title || 'Starter'
  }, [title])
}

export default useSetTitle
