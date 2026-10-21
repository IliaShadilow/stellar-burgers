import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { selectIngredients } from '../../services/selectors';
import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);

  // ищем ингредиент по id из URL
  const ingredientData = ingredients.find((item) => item._id === id);

  // если ингредиент не найден (например, идет загрузка) — ничего не рендерим
  if (!ingredientData) return null;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
