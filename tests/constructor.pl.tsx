import { test, expect } from '@playwright/test';
import path from 'node:path';

const HAR_PATH = path.resolve(__dirname, 'hars/stellar-burger.har');

test.describe('Страница конструктора бургера', () => {
  // перехватываем ВСЕ запросы к бэкенду и отвечаем из HAR
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR_PATH, { url: '**/api/**', notFound: 'abort' });
  });

  test('добавление булки из списка в конструктор', async ({ page }) => {
    await page.goto('/');
    const bunCard = page.locator('li').filter({ hasText: 'Тестовая булка' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    // булка встаёт и вверх, и вниз
    await expect(page.getByText('Тестовая булка (верх)')).toBeVisible();
    await expect(page.getByText('Тестовая булка (низ)')).toBeVisible();
  });

  test('добавление начинки и соуса из списка в конструктор', async ({ page }) => {
    await page.goto('/');
    const mainCard = page.locator('li').filter({ hasText: 'Тестовая начинка' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();
    const sauceCard = page.locator('li').filter({ hasText: 'Тестовый соус' });
    await sauceCard.getByRole('button', { name: 'Добавить' }).click();
    // в конструкторе появились оба элемента (имя дублируется: карточка + стек)
    await expect(page.getByText('Тестовая начинка')).toHaveCount(2);
    await expect(page.getByText('Тестовый соус')).toHaveCount(2);
  });

  test('открытие модального окна с данными ингредиента', async ({ page }) => {
    await page.goto('/');
    const mainCard = page.locator('li').filter({ hasText: 'Тестовая начинка' });
    await mainCard.getByRole('link').click();
    // модалка показывает именно тот ингредиент, по которому кликнули
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(page.getByText('Тестовая начинка')).toBeVisible();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await expect(page.getByText('200')).toBeVisible();
  });

  test('закрытие модального окна по клику на крестик', async ({ page }) => {
    await page.goto('/');
    const mainCard = page.locator('li').filter({ hasText: 'Тестовая начинка' });
    await mainCard.getByRole('link').click();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByText('Калории, ккал')).toBeHidden();
  });

  test('закрытие модального окна по клику на оверлей', async ({ page }) => {
    await page.goto('/');
    const mainCard = page.locator('li').filter({ hasText: 'Тестовая начинка' });
    await mainCard.getByRole('link').click();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    // оверлей растянут на весь экран (fixed, inset: 0) — клик в угол бьёт по нему
    await page.mouse.click(5, 5);
    await expect(page.getByText('Калории, ккал')).toBeHidden();
  });

  test('создание заказа: модалка с номером и очистка конструктора', async ({ page }) => {
    // фейковые токены авторизации до загрузки приложения
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
      document.cookie = 'accessToken=fake-access-token; path=/';
    });
    await page.goto('/');

    // собираем бургер: булка + начинка
    const bunCard = page.locator('li').filter({ hasText: 'Тестовая булка' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    const mainCard = page.locator('li').filter({ hasText: 'Тестовая начинка' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    // оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // открылась модалка с верным номером заказа из har
    await expect(page.getByText('идентификатор заказа')).toBeVisible();
    await expect(page.getByText('12345')).toBeVisible();

    // конструктор очистился: снова заглушки (Выберите булки или начинку)
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    // закрываем модалку и проверяем, что она действительно закрылась
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByText('идентификатор заказа')).toBeHidden();
  });
});
