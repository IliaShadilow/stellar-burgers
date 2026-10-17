// cлайс ингредиентов

import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients/slice';
import constructorReducer from './slices/constructor/slice';
import userReducer from './slices/user/slice';
import orderReducer from './slices/order/slice'

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer, 
  order: orderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
