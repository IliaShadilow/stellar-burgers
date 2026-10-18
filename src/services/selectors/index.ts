// функции селекторы

import type { RootState } from '../rootReducer';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) => state.ingredients.isLoading;


export const selectConstructorBun = (state: RootState) => state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) => state.burgerConstructor.ingredients;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const selectUserError = (state: RootState) => state.user.error;

export const selectOrderData = (state: RootState) => state.order.orderData;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;

export const selectFeeds = (state: RootState) => state.feeds.orders;
export const selectFeedsTotal = (state: RootState) => state.feeds.total;
export const selectFeedsTotalToday = (state: RootState) => state.feeds.totalToday;
export const selectUserOrders = (state: RootState) => state.feeds.userOrders;
