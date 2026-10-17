import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useSelector } from '../../services/store';
import {
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/selectors';

import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  // берем из стора
  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);

  // формируем объект для UI, подставляя данные из стора
  const constructorItems: TConstructorState = {
    bun,
    ingredients,
  };

  // пока оставляем заглушки для заказа
  const orderRequest = false;
  const orderModalData: TOrder | null = null;

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    // TODO: Оформить заказ
  };

  const closeOrderModal = (): void => {
    // TODO: Закрыть модальное окно и сбросить заказ
  };

  // считаем цену
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
