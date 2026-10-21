import { BurgerConstructorUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectOrderData,
  selectOrderLoading,
  selectUser,
} from '../../services/selectors';
import { clearConstructor } from '../../services/slices/constructor/slice';
import { createOrder, clearOrderData } from '../../services/slices/order/slice';
import { useSelector, useDispatch } from '../../services/store';

import type { TConstructorIngredient, TConstructorState } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrderData);
  const user = useSelector(selectUser); // проверяем, залогинен ли пользователь

  // берем из стора
  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);

  // формируем объект для UI, подставляя данные из стора
  const constructorItems: TConstructorState = {
    bun,
    ingredients,
  };

  useEffect(() => {
    localStorage.setItem('burgerConstructor', JSON.stringify({ bun, ingredients }));
  }, [bun, ingredients]);

  const onOrderClick = (): void => {
    if (!bun || orderRequest) return;

    // без авторизации кидаем на логин
    if (!user) {
      void navigate('/login');
      return;
    }

    // собираем массив id(булка + начинки + булка)
    const ingredientsIds = [bun._id, ...ingredients.map((item) => item._id), bun._id];

    // отправление заказа
    const orderPromise = dispatch(createOrder(ingredientsIds))
      .unwrap()
      .then(() => {
        void dispatch(clearConstructor()); // очистка корзины после заказа
      })
      .catch(() => {
        // ошибка уже обрабатывается в Redux (isLoading = false), здесь можно просто ничего не делать
      });
    void orderPromise;
  };

  const closeOrderModal = (): void => {
    // закрываем модальное окно и сбросить заказ
    void dispatch(clearOrderData());
  };

  // считаем цену
  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((s: number, v: TConstructorIngredient) => s + v.price, 0),
    [bun, ingredients]
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
