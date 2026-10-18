import { FeedInfoUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectFeeds, selectFeedsTotal, selectFeedsTotalToday } from '../../services/selectors';

export const FeedInfo = (): React.JSX.Element => {
  const orders = useSelector(selectFeeds);
  const total = useSelector(selectFeedsTotal);
  const totalToday = useSelector(selectFeedsTotalToday);

  // собираем объект feed, который ждет UI
  const feed = {
    orders,
    total,
    totalToday,
    isLoading: false,
    error: null,
  };

  // берем номера заказов для колонок Готовы и В работе
  const readyOrders = orders.filter((o) => o.status === 'done').map((o) => o.number).slice(0, 10);
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'created').map((o) => o.number).slice(0, 10);

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
