import { expect, test } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HAR_PATH = path.resolve(__dirname, 'hars/stellar-burger.har');

test.describe('Страница конструктора бургера', () => {
  // перехватываем все запросы к бэкенду и отвечаем из HAR
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR_PATH, { url: '**/api/**', notFound: 'abort' });
  });

  test('добавление булки из списка в конструктор', async ({ page }) => {
    await page.goto('/');
    const ingredients = page.locator('section').first();
    const bunCard = ingredients.locator('li').filter({ hasText: 'Тестовая булка' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    // булка встаёт и вверх, и вниз конструктора
    const constructor = page.locator('section').last();
    await expect(constructor.getByText('Тестовая булка (верх)')).toBeVisible();
    await expect(constructor.getByText('Тестовая булка (низ)')).toBeVisible();
  });

  test('добавление начинки и соуса из списка в конструктор', async ({ page }) => {
    await page.goto('/');
    const ingredients = page.locator('section').first();
    const constructor = page.locator('section').last();
    const mainCard = ingredients.locator('li').filter({ hasText: 'Тестовая начинка' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();
    const sauceCard = ingredients.locator('li').filter({ hasText: 'Тестовый соус' });
    await sauceCard.getByRole('button', { name: 'Добавить' }).click();
    await expect(constructor.getByText('Тестовая начинка')).toBeVisible();
    await expect(constructor.getByText('Тестовый соус')).toBeVisible();
  });

  test('открытие модального окна с данными ингредиента', async ({ page }) => {
    await page.goto('/');
    const ingredients = page.locator('section').first();
    const mainCard = ingredients.locator('li').filter({ hasText: 'Тестовая начинка' });
    await mainCard.getByRole('link').click();
    // модалка показывает именно тот ингредиент, по которому кликнули
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Тестовая начинка' })).toBeVisible();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await expect(page.getByText('Белки, г')).toBeVisible();
  });

  test('закрытие модального окна по клику на крестик', async ({ page }) => {
    await page.goto('/');
    const ingredients = page.locator('section').first();
    const mainCard = ingredients.locator('li').filter({ hasText: 'Тестовая начинка' });
    await mainCard.getByRole('link').click();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByText('Калории, ккал')).toBeHidden();
  });

  test('закрытие модального окна по клику на оверлей', async ({ page }) => {
    await page.goto('/');
    const ingredients = page.locator('section').first();
    const mainCard = ingredients.locator('li').filter({ hasText: 'Тестовая начинка' });
    await mainCard.getByRole('link').click();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    // оверлей растянут на весь экран (fixed, inset: 0) — клик в угол бьёт по нему
    await page.mouse.click(5, 5);
    await expect(page.getByText('Калории, ккал')).toBeHidden();
  });

  test('создание заказа: модалка с верным номером и очистка конструктора', async ({ page }) => {
    // фейковые токены авторизации до загрузки приложения
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
      document.cookie = 'accessToken=fake-access-token; path=/';
    });
    await page.goto('/');

    // собираем бургер: булка + начинка
    const ingredients = page.locator('section').first();
    const bunCard = ingredients.locator('li').filter({ hasText: 'Тестовая булка' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    const mainCard = ingredients.locator('li').filter({ hasText: 'Тестовая начинка' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    // оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // открылась модалка с номером заказа из HAR
    await expect(page.getByText('идентификатор заказа')).toBeVisible();
    await expect(page.getByText('12345')).toBeVisible();

    // конструктор очистился: снова заглушки
    const constructor = page.locator('section').last();
    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    // закрываем модалку и проверяем, что она действительно закрылась
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByText('идентификатор заказа')).toBeHidden();
  });
});
