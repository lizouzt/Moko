import { useState, useEffect } from 'react'

/**
 * 返回传入Element是否触发overflow scroll
 * @param  { React.RefObject } node Dom节点
 * @return { boolean }         是否内容滚动
 */
export default function useScrollCheck(node: React.RefObject<any>, options?: any): boolean {
  const [overflow, setOverflow] = useState(false)

  useEffect(() => {
    const check = () => {
      if (!node.current) {
        return false
      }

      const { offsetHeight, scrollHeight } = node.current
      setOverflow(scrollHeight > offsetHeight)
    }

    check()

    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('resize', check)
    }
  }, [node.current, options])

  return overflow
}
