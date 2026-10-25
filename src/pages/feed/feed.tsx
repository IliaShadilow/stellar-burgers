import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { selectFeeds } from '../../services/selectors';
import { fetchFeeds } from '../../services/slices/feeds/slice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  // берем переменную из стора
  const dispatch = useDispatch();
  const orders = useSelector(selectFeeds);

  const handleGetFeeds = (): void => {
    // запрос ленту заказов
    void dispatch(fetchFeeds());
  };

  useEffect(() => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
