import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '../../services/slices/user/slice';
import { useDispatch } from '../../services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    // Разлогиниваем пользователя
    void dispatch(logoutUser()).then(() => {
      void navigate('/login'); // после выхода кидаем на логин
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
