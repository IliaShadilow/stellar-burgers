import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/user/slice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    // Разлогиниваем пользователя
    dispatch(logoutUser()).then(() => {
      navigate('/login'); // после выхода кидаем на логин
    })
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
