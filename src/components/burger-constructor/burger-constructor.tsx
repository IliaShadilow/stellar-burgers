import { BurgerConstructorUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectOrderData,
  selectOrderLoading,
  selectUser,
} from '../../services/selectors';
import { createOrder, clearOrderData } from '../../services/slices/order/slice';
import { clearConstructor } from '../../services/slices/constructor/slice';
import { useNavigate } from 'react-router-dom';

import type { TConstructorIngredient, TConstructorState } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrderData);
  const user = useSelector(selectUser); // 💡 Проверяем, залогинен ли пользователь

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
      navigate('/login');
      return;
    }

    // собираем массив id(булка + начинки + булка)
    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id,
    ];

    // отправление заказа
    dispatch(createOrder(ingredientsIds)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(clearConstructor()); // очистка корзины после заказа
      }
    });
  };

  const closeOrderModal = (): void => {
     // Закрываем модальное окно и сбросить заказ
     dispatch(clearOrderData());
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
