import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as dispatchHook, useSelector as selectorHook } from 'react-redux';
import { rootReducer, type RootState } from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  devTools: true, // включаем Redux DevTools для разработки
});

export type AppDispatch = typeof store.dispatch;

// типизированные хуки важно для ts
export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
