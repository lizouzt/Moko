import { useEffect, useCallback, useMemo } from 'react'
import setStyle from 'utils/setStyle'

const period = 200
const noneRippleBg = 'rgba(0, 0, 0, 0)'
const defaultRippleColor = 'rgba(0, 0, 0, 0.35)'

// 设置动画颜色 get the ripple animation color
const getRippleColor = (el: HTMLElement, fixedRippleColor?: string) => {
  // get fixed color from params
  if (fixedRippleColor) {
    return fixedRippleColor
  }
  // get dynamic color from the dataset
  if (el?.dataset?.ripple) {
    const rippleColor = el.dataset.ripple
    return rippleColor
  }
  // use css variable
  const cssVariable = getComputedStyle(el).getPropertyValue('--ripple-color')
  if (cssVariable) {
    return cssVariable
  }
  return defaultRippleColor
}

/** 触发方式 */
export enum RippleTriggerType {
  CLICK,
  HOVER,
}

/** 遮罩类型
 * @default BLOCK
 * */
export enum RippleType {
  BLOCK,
  LINE,
}

interface RippleOptions {
  trigger?: RippleTriggerType
  type?: RippleType
}

const TriggerEventMap = {
  [RippleTriggerType.CLICK]: {
    activate: 'pointerdown',
    deactivate: ['pointerup', 'pointerleave'],
  },
  [RippleTriggerType.HOVER]: {
    activate: 'mouseenter',
    deactivate: ['mouseleave', 'mousedown'],
  },
}

/**
 * 斜八角动画 hooks 支持三种方式使用
 * 1. fixedRippleColor 固定色值 useRipple(ref,fixedRippleColor,trigger)
 * 2. dynamicColor 动态色值 data.ripple="rippleColor" useRipple(ref)
 * 3. CSS variables（recommended） 配合节点对应 CSS 设置 --ripple-color useRipple(ref)
 * @param dom 需要使用斜八角动画的 DOM
 * @param fixedRippleColor 斜八角的动画颜色
 * @param options 触发动画的配置
 */
export default function useRipple(
  target: React.RefObject<HTMLElement>,
  fixedRippleColor?: string,
  options?: RippleOptions,
): void {
  // 事件字典
  const triggerType = useMemo(() => TriggerEventMap[options?.trigger || RippleTriggerType.CLICK], [options?.trigger])

  // 全局配置
  const rippleContainer = useMemo(() => {
    const container = document.createElement('div')
    container.className = 'ripple'

    return container
  }, [])

  // 为节点添加斜八角动画 add ripple to the DOM and set up the animation
  const handleAddRipple = useCallback(
    (e: any) => {
      if (e.button !== 0 || !target.current) return

      const rippleColor = getRippleColor(target.current, fixedRippleColor)

      if (
        /active/i.test(target.current.className) ||
        /disabled/i.test(target.current.className) ||
        /checked/i.test(target.current.className) ||
        /loading/i.test(target.current.className) ||
        rippleContainer.children?.length
      )
        return

      const elStyle = getComputedStyle(target.current)

      const elBorder = parseInt(elStyle.borderWidth, 10)
      const border = elBorder > 0 ? elBorder : 0
      const width = target.current.offsetWidth
      const height = target.current.offsetHeight

      if (rippleContainer.parentNode === null) {
        setStyle(rippleContainer, {
          position: 'absolute',
          left: `${0 - border}px`,
          top: `${0 - border}px`,
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: elStyle.borderRadius,
          pointerEvents: 'none',
          overflow: 'hidden',
        })
        target.current.appendChild(rippleContainer)
      }
      // 新增一个 ripple
      const ripple = document.createElement('div')

      ripple.className = `ripple__inner`

      setStyle(ripple, {
        marginTop: '0',
        marginLeft: '0',
        right: `${width}px`,
        width: options?.type === RippleType.LINE ? '8px' : `${width + 20}px`,
        height: '100%',
        transition: `transform ${period}ms cubic-bezier(.38, 0, .24, 1), background ${period * 2}ms linear`,
        transform: 'skewX(-13deg)',
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 0,
        backgroundColor: rippleColor,
        opacity: '0.66',
      })

      // fix zIndex：避免遮盖内部元素
      const elMap = new WeakMap()
      for (let n = target.current.children.length, i = 0; i < n; ++i) {
        const child = target.current.children[i] as HTMLElement
        if (child.style.zIndex === '' && child !== rippleContainer) {
          child.style.zIndex = '1'
          elMap.set(child, true)
        }
      }

      // fix position
      const initPosition = target.current.style.position
        ? target.current.style.position
        : getComputedStyle(target.current).position
      if (initPosition === '' || initPosition === 'static') {
        // eslint-disable-next-line no-param-reassign
        target.current.style.position = 'relative'
      }
      rippleContainer.insertBefore(ripple, rippleContainer.firstChild)

      setTimeout(() => {
        ripple.style.transform =
          options?.type === RippleType.LINE ? `translateX(${width + 10}px)` : `translateX(${width}px)`
      }, 16)

      // 清除动画节点 clear ripple container
      const handleClearRipple = () => {
        ripple.style.backgroundColor = noneRippleBg

        if (!target.current) return

        triggerType.deactivate?.forEach((eventName) => {
          target.current?.removeEventListener(eventName, handleClearRipple, false)
        })

        setTimeout(() => {
          ripple.remove()
          if (rippleContainer.children.length === 0) rippleContainer.remove()
        }, period * 2 + 100)
      }

      triggerType.deactivate?.forEach((eventName) => {
        target.current?.addEventListener(eventName, handleClearRipple, false)
      })
    },
    [target, fixedRippleColor, rippleContainer, triggerType],
  )

  useEffect(() => {
    target.current?.addEventListener(triggerType.activate, handleAddRipple, false)

    return () => {
      target.current?.removeEventListener(triggerType.activate, handleAddRipple, false)
    }
  }, [handleAddRipple, fixedRippleColor, target])
}
