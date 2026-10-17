import { Navigate, useLocation } from 'react-router-dom';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps): React.JSX.Element => {
  // 💡 Пока здесь нет проверки Redux, мы просто пропускаем всех (каркас).
  // На следующем шаге мы добавим сюда useSelector и логику редиректов.
  return children;
};
