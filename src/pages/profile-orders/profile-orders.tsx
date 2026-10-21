import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { selectUserOrders } from '../../services/selectors';
import { fetchUserOrders } from '../../services/slices/feeds/slice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  /** берем переменные из стора */
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    void dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
