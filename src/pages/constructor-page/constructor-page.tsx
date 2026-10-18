import { BurgerIngredients, BurgerConstructor } from '@components';
import { Preloader } from '@ui';
import { useEffect } from 'react';

import { selectIngredientsLoading } from '../../services/selectors';
import { fetchIngredients } from '../../services/slices/ingredients/slice';
import { useDispatch, useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

export const ConstructorPage = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
