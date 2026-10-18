import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/feeds/slice';
import { selectUserOrders } from '../../services/selectors';

export const ProfileOrders = (): React.JSX.Element => {
  /** берем переменные из стора */
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
      dispatch(fetchUserOrders());
    }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
