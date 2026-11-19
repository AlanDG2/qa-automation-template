import { test, expect } from '@playwright/test';

// Sitio público de práctica (credenciales publicadas por el propio sitio).
// URL base: WEB_BASE_URL, o saucedemo.com por defecto (ver playwright.config.ts).

test.describe('TS-01 Login', () => {
  test('TC-01 - Login con credenciales válidas', async ({ page }) => {
    // Precondiciones: usuario estándar del sitio de práctica
    // Pasos: abrir login, completar usuario y contraseña, ingresar
    // Resultado esperado: se ve la pantalla de productos

    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Products')).toBeVisible();
  });

  test('TC-02 - Login con contraseña incorrecta muestra error', async ({ page }) => {
    // Resultado esperado: mensaje de error y no se entra a la pantalla de productos

    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('clave_incorrecta');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Username and password do not match')).toBeVisible();
    await expect(page.getByText('Products')).toBeHidden();
  });
});
