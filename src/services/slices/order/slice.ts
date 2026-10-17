// отправляем массив id ингредиентов на сервер и получаем номер заказа

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import type { TOrder } from '@utils-types';

type TOrderState = {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderData: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk<{ order: TOrder; name: string }, string[]>(
  'order/createOrder',
  async (ingredientsIds) => await orderBurgerApi(ingredientsIds)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка создания заказа';
      });
  },
});

export const { clearOrderData } = orderSlice.actions;
export default orderSlice.reducer;
