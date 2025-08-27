import { Middleware, Action } from '@reduxjs/toolkit'

const loggerMiddleware: Middleware = (store) => (next) => (action: Action) => {
  const stateBefore = store.getState()
  console.groupCollapsed(`[action] ${action.type}`)
  console.log('state before:', stateBefore)
  const result = next(action)
  const stateAfter = store.getState()
  console.log('state after:', stateAfter)
  console.groupEnd()
  return result
}

export default loggerMiddleware
