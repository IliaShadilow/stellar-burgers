// функции селекторы

import type { RootState } from '../rootReducer';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) => state.ingredients.isLoading;


export const selectConstructorBun = (state: RootState) => state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) => state.burgerConstructor.ingredients;
