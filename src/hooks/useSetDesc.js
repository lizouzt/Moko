import { useEffect } from 'react'

const useSetDesc = function (desc) {
  useEffect(() => {
    document.head.querySelector('meta[name="description"]').content = desc
  }, [desc])
}

export default useSetDesc
