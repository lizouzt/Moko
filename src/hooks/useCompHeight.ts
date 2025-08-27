import { useState, useEffect } from 'react'

/**
 * 返回传入Element的实际高度
 * @param  { React.RefObject } node Dom节点
 * @return { number }       节点高度
 */
export default function useCompHeight(node: React.RefObject<any>, options?: any): number {
  const [fixableHeight, setFixableHeight] = useState(0)

  useEffect(() => {
    const getWrapperComputedStyle = () => {
      const height = node.current ? node.current.clientHeight : 2
      const maxHeight = typeof height === 'string' ? parseInt(height || '2', 10) : height
      setFixableHeight(maxHeight)
    }

    getWrapperComputedStyle()
    window.addEventListener('resize', getWrapperComputedStyle)
    return () => {
      window.removeEventListener('resize', getWrapperComputedStyle)
    }
  }, [node.current, options])

  return fixableHeight
}
