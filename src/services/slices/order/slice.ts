// отправляем массив id ингредиентов на сервер и получаем номер заказа

import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

type TOrderState = {
  orderData: TOrder | null;
  currentOrder: TOrder | null; // добавили для хранения одного заказа
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderData: null,
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk<{ order: TOrder; name: string }, string[]>(
  'order/createOrder',
  async (ingredientsIds) => await orderBurgerApi(ingredientsIds)
);

// thunk для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchOrderByNumber',
  async (number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = null;
    },
    // новый экшен для очистки текущего заказа
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
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
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  },
});

export const { clearOrderData, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
