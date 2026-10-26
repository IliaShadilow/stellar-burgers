import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} from '../constructor/slice';

import type { TConstructorState, TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: 'b.png',
  image_large: 'b.png',
  image_mobile: 'b.png',
};

const main1: TIngredient = {
  ...bun,
  _id: 'm-1',
  name: 'Начинка 1',
  type: 'main',
  price: 200,
};

const main2: TIngredient = {
  ...bun,
  _id: 'm-2',
  name: 'Начинка 2',
  type: 'main',
  price: 300,
};

// собираем состояние через сам редьюсер, потому что prepare в addIngredient
// генерирует уникальный id через nanoid() при КАЖДОМ вызове
const withTwoMains = (): TConstructorState => {
  let state = reducer(undefined, addIngredient(main1));
  state = reducer(state, addIngredient(main2));
  return state;
};

describe('редьюсер слайса burgerConstructor', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  it('addIngredient: булка заменяет предыдущую', () => {
    let state = reducer(undefined, addIngredient(bun));
    expect(state.bun?._id).toBe('bun-1');
    state = reducer(state, addIngredient({ ...bun, _id: 'bun-2' }));
    expect(state.bun?._id).toBe('bun-2');
    expect(state.ingredients).toHaveLength(0);
  });

  it('addIngredient: начинки добавляются в список', () => {
    const state = withTwoMains();
    expect(state.ingredients.map((i) => i._id)).toEqual(['m-1', 'm-2']);
  });

  it('removeIngredient: удаляет начинку по id', () => {
    const initial = withTwoMains();
    const state = reducer(initial, removeIngredient(initial.ingredients[0].id));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('m-2');
  });

  it('moveIngredientUp: меняет местами с предыдущим элементом', () => {
    const initial = withTwoMains();
    const state = reducer(initial, moveIngredientUp(1));
    expect(state.ingredients.map((i) => i._id)).toEqual(['m-2', 'm-1']);
  });

  it('moveIngredientUp: ничего не делает для первого элемента', () => {
    const initial = withTwoMains();
    const state = reducer(initial, moveIngredientUp(0));
    expect(state.ingredients.map((i) => i._id)).toEqual(['m-1', 'm-2']);
  });

  it('moveIngredientDown: меняет местами со следующим элементом', () => {
    const initial = withTwoMains();
    const state = reducer(initial, moveIngredientDown(0));
    expect(state.ingredients.map((i) => i._id)).toEqual(['m-2', 'm-1']);
  });

  it('moveIngredientDown: ничего не делает для последнего элемента', () => {
    const initial = withTwoMains();
    const state = reducer(initial, moveIngredientDown(1));
    expect(state.ingredients.map((i) => i._id)).toEqual(['m-1', 'm-2']);
  });

  it('clearConstructor: полностью очищает конструктор', () => {
    let state = reducer(withTwoMains(), addIngredient(bun));
    state = reducer(state, clearConstructor());
    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
