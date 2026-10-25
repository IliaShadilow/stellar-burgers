import reducer, { fetchIngredients } from '../ingredients/slice';
import type { TIngredient } from '@utils-types';

const ingredient: TIngredient = {
  _id: 'i-1',
  name: 'Тестовая начинка',
  type: 'main',
  proteins: 20,
  fat: 20,
  carbohydrates: 20,
  calories: 200,
  price: 200,
  image: 'img.png',
  image_large: 'img.png',
  image_mobile: 'img.png',
};

describe('редьюсер слайса ingredients', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({ items: [], isLoading: false, error: null });
  });

  it('обрабатывает fetchIngredients.pending: включает загрузку', () => {
    const initial = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    const state = reducer(initial, fetchIngredients.pending('req-1', undefined));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fetchIngredients.fulfilled: сохраняет ингредиенты', () => {
    const loading = reducer(undefined, fetchIngredients.pending('req-1', undefined));
    const state = reducer(loading, fetchIngredients.fulfilled([ingredient], 'req-1', undefined));
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual([ingredient]);
  });

  it('обрабатывает fetchIngredients.rejected: сохраняет ошибку', () => {
    const loading = reducer(undefined, fetchIngredients.pending('req-1', undefined));
    const state = reducer(
      loading,
      fetchIngredients.rejected(new Error('сеть упала'), 'req-1', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual([]);
    expect(state.error).toBe('сеть упала');
  });
});
