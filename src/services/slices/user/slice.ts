import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUserApi, getUserApi, logoutApi, registerUserApi, updateUserApi, type TLoginData, type TRegisterData } from '@api';
import { setCookie, deleteCookie } from '@utils/cookie';
import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean; // нужен чтобы не выкинуть на логин во время загрузки
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

// создаем thunk для регистрации
export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const fetchUser = createAsyncThunk<TUser>('user/fetchUser', async () => {
  const res = await getUserApi();
  return res.user;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Thunk для обновления данных пользователя
export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (data) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка входа';
        state.isAuthChecked = true;
      })
      // проверяем пользователя при перезагрузке страницы
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
       .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default userSlice.reducer;
