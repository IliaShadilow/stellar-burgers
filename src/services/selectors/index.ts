// функции селекторы

import type { RootState } from '../rootReducer';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) => state.ingredients.isLoading;
