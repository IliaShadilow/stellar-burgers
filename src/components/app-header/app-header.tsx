import { AppHeaderUI } from '@ui';

import { selectUser } from '../../services/selectors';
import { useSelector } from '../../services/store';

export const AppHeader = (): React.JSX.Element => {
  /* Получите имя пользователя из хранилища */
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
