// cлайс ингредиентов

import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients/slice';
import constructorReducer from './slices/constructor/slice'; 

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
