import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import { Modal } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { AppHeader } from '../app-header/app-header';

const App = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  // ссылки на ингредиенты и заказы будут передавать этот background.
  const background = location.state?.background;

  return (
    <div>
      <AppHeader />

      {/* основные маршруты */}
      <Routes location={background || location}>
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
        <Route path="/ingredients/:id" element={<div>IngredientDetails (страница)</div>} />
        <Route path="/feed/:number" element={<div>OrderInfo (страница)</div>} />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <div>OrderInfo (страница)</div>
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
              <Modal title="Детали ингредиента" onClose={() => navigate(-1)}>
                <div>IngredientDetails (модалка)</div>
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={() => navigate(-1)}>
                <div>OrderInfo (модалка)</div>
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title="Информация о заказе" onClose={() => navigate(-1)}>
                  <div>OrderInfo (модалка)</div>
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
