// cлайс ингредиентов

import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './slices/constructor/slice';
import feedsReducer from './slices/feeds/slice';
import ingredientsReducer from './slices/ingredients/slice';
import orderReducer from './slices/order/slice';
import userReducer from './slices/user/slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  order: orderReducer,
  feeds: feedsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
