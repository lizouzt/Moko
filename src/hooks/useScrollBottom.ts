import { useEffect } from 'react'

/**
 * @param { React.RefObject<any> } node Dom节点
 * @param { React.RefObject<Function | undefined> } onScrollBottom 滚动到底部触发的事件Ref
 * @param { number } scrollThresholds 底部事件触发阀值
 */
export default function useScrollBottom(
  node: React.RefObject<any>,
  onScrollBottom: React.RefObject<Function | undefined>,
  scrollThresholds = 100,
) {
  useEffect(() => {
    if (node.current) {
      node.current.onscrollend = (event: any) => {
        const { clientHeight, scrollHeight, scrollTop } = event.target

        if (scrollHeight - scrollTop < clientHeight + scrollThresholds) {
          onScrollBottom.current?.()
        }
      }
    }

    return () => {
      if (node.current) {
        node.current.onscroll = null
      }
    }
  }, [node.current])
}
