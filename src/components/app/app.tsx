import { Modal, IngredientDetails, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { fetchIngredients } from '../../services/slices/ingredients/slice';
import { fetchUser } from '../../services/slices/user/slice';
import { useDispatch } from '../../services/store';
import { AppHeader } from '../app-header/app-header';
import { ProtectedRoute } from '../protected-route/protected-route';

const App = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(fetchUser()); // проверка авторизации при загрузке
  }, [dispatch]);

  // ссылки на ингредиенты и заказы будут передавать этот background.
  const background = (location.state as { background?: Location })?.background ?? null;

  return (
    <div>
      <AppHeader />

      {/* основные маршруты */}
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        {/* защищенные маршруты (только для тех, кто НЕ авторизован) */}
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* защищенные маршруты (только для АВТОРИЗОВАННЫХ) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* прямые переходы на детали (если открыть ссылку в новой вкладке) */}
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {/* модалки, которые открываются поверх страниц */}
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal
                title="Детали ингредиента"
                onClose={(): void => {
                  void navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal
                title="Информация о заказе"
                onClose={(): void => {
                  void navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal
                  title="Информация о заказе"
                  onClose={(): void => {
                    void navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
