import { OrderInfoUI, Preloader } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectCurrentOrder, selectIngredients } from '../../services/selectors';
import {
  fetchOrderByNumber,
  clearCurrentOrder,
} from '../../services/slices/order/slice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element | null => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const order = useSelector(selectCurrentOrder);
  const allIngredients = useSelector(selectIngredients);

  useEffect(() => {
    if (number) {
      void dispatch(fetchOrderByNumber(Number(number)));
    }
    // очищаем при размонтировании, чтобы не было мигания старых данных
    return (): void => {
      void dispatch(clearCurrentOrder());
    };
  }, [dispatch, number]);

  // собираем данные для UI с помощью useMemo
  const orderInfo = useMemo(() => {
    if (!order || !allIngredients.length) return null;

    // группируем ингредиенты и считаем их количество
    const ingredientsInfo = order.ingredients.reduce(
      (
        acc: Record<string, TIngredient & { count: number }>,
        id: string
      ): Record<string, TIngredient & { count: number }> => {
        const ingredient = allIngredients.find((item) => item._id === id);
        if (!ingredient) return acc;

        if (!acc[id]) {
          acc[id] = { ...ingredient, count: 1 };
        } else {
          acc[id].count += 1;
        }
        return acc;
      },
      {} as Record<string, TIngredient & { count: number }>
    );

    // считаем общую стоимость
    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date: new Date(order.createdAt),
      total,
    };
  }, [order, allIngredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
