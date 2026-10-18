import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/selectors';

export const AppHeader = (): React.JSX.Element => {
  /* Получите имя пользователя из хранилища */
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
