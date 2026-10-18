import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feeds/slice';
import { selectFeeds } from '../../services/selectors';

export const Feed = (): React.JSX.Element => {
  // берем переменную из стора
  const dispatch = useDispatch();
  const orders = useSelector(selectFeeds);

  const handleGetFeeds = (): void => {
    // запрос ленту заказов
    dispatch(fetchFeeds());
  };

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
