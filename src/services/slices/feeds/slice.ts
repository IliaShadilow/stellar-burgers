// слайс ленты

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import type { TOrder } from '@utils-types';

type TFeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  userOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  userOrders: [],
  isLoading: false,
  error: null,
};

// запрос для общей ленты (доступен всем)
export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async () => await getFeedsApi()
);

// запрос для личной истории (только для авторизованных)
export const fetchUserOrders = createAsyncThunk(
  'feeds/fetchUserOrders',
  async () => await getOrdersApi()
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ленты';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки истории';
      });
  },
});

export default feedsSlice.reducer;
