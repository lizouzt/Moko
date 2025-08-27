import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import logger from 'modules/loggerMiddleware'

import global from './global'
import user from './user'

const reducer = combineReducers({
  global,
  user,
})

export const store = configureStore({
  reducer,
  middleware:
    process.env.NODE_ENV !== 'production' ? (getDefaultMiddleware) => getDefaultMiddleware().concat(logger) : undefined,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
