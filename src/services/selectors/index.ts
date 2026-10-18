// функции селекторы

import type { RootState } from '../rootReducer';
import type { TIngredient, TUser, TOrder, TConstructorIngredient } from '@utils-types';

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;

export const selectConstructorBun = (state: RootState): TConstructorIngredient | null =>
  state.burgerConstructor.bun;
export const selectConstructorIngredients = (
  state: RootState
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

export const selectUser = (state: RootState): TUser | null => state.user.user;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const selectUserError = (state: RootState): string | null => state.user.error;

export const selectOrderData = (state: RootState): TOrder | null =>
  state.order.orderData;
export const selectOrderLoading = (state: RootState): boolean => state.order.isLoading;
export const selectCurrentOrder = (state: RootState): TOrder | null =>
  state.order.currentOrder;

export const selectFeeds = (state: RootState): TOrder[] => state.feeds.orders;
export const selectFeedsTotal = (state: RootState): number => state.feeds.total;
export const selectFeedsTotalToday = (state: RootState): number =>
  state.feeds.totalToday;
export const selectUserOrders = (state: RootState): TOrder[] => state.feeds.userOrders;
