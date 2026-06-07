---
name: qa-spec-conventions
description: Convenciones obligatorias para archivos .spec.ts (E2E Playwright) — las 3 reglas (sin comentarios, sin lógica inline, nada hardcodeado), estructura mínima, ejemplos antes/después, header JSDoc y las 2 estrategias de autenticación (A storageState / B completeLogin). Invocar al escribir, editar o revisar cualquier .spec.ts.
---

# Convenciones de specs (`.spec.ts`)

> **Convención de specs del proyecto** (§Convenciones de specs).

Los archivos `.spec.ts` deben ser **declarativos**: leer un test debe contar la historia funcional sin que el lector tenga que inferir nada del código.

## Las 3 reglas

1. **Sin comentarios en el cuerpo del test.** El nombre del test (`test('CA1: ...')`) y los nombres de los métodos del POM deben ser autoexplicativos. Si necesitás un comentario para explicar qué hace una línea, el método del POM tiene mal nombre — renombrá el método. Excepción: comentarios `// SKIP [IMP-XXX]: ...` en `test.skip(...)` (son obligatorios por el sistema de impedimentos).

2. **Sin lógica inline.** Solo llamadas a métodos del POM. Prohibido en el cuerpo del test:
   - `if`, `for`, `while`, `try/catch`.
   - `expect(...)` directo (envolver en un método `validar*` del POM).
   - `const x = await page.locator(...)` (selectores en el spec).
   - `await page.goto(...)`, `await page.click(...)` (uso directo de `page` del fixture).
   - Cálculos, comparaciones, transformaciones de datos.

   Patrón correcto: `await xPage.metodoDescriptivo(parámetros)`. Si necesitás capturar un valor para validarlo después, usá un método capture-then-validate del POM (ej: `await listPage.guardarConteoFilas()` + `await listPage.validarConteoNoCambio()`).

3. **Nada hardcodeado.** Todo dato literal debe venir de una fuente nombrada:
   - **URLs**: `URLS.web` / `URLS.bo` desde `config/urls.ts`. NUNCA `'https://qa...'` en spec.
   - **Credenciales**: fixture `users` (`users.adminQA.email`). NUNCA email/password literal.
   - **Datos de seed**: constantes estáticas en el POM (ej: `ListPage.SEED_NOMBRES`) o en `fixtures/data/*.json`.
   - **Textos UI**: si el test los necesita, exponerlos como constantes del POM (ej: `ListPage.MSG_SIN_RESULTADOS`).
   - **Paths de archivos de test**: constantes en el POM o en una capa de fixtures, no en el spec.
   - **Magic numbers**: extraer a constante con nombre (ej: `MIN_FILAS_TABLA`).

   > 🔗 Esta regla es sobre **dónde** colocar un literal (en una fuente nombrada, no inline). Es **complementaria** —no contradictoria— con la **"REGLA OBLIGATORIA — Data 100% dinámica"** de `CLAUDE.md` (sección Conventions), que dicta que la data de prueba (cuentas/entidades/registros) se **genera con timestamp y se crea dentro del test**, sin depender de seeds estáticos. Las constantes `SEED_*` del POM son para *verificar* catálogos seed o textos, no para *consumir* entidades como sujeto del test.

## Estructura mínima de un spec

```typescript
import { test } from '../../../fixtures/test-fixtures';
import { LoginPage } from '../../../pages/LoginPage';
import { XPage } from '../../../pages/XPage';

test.use({ storageState: 'tests/.auth/admin-qa.json' });

test.describe('XX-N — Título de la HU', () => {
  let loginPage: LoginPage;
  let xPage: XPage;

  test.beforeEach(async ({ page, users }) => {
    loginPage = new LoginPage(page);
    xPage = new XPage(page);
    await loginPage.ensureAuthenticated(users.adminQA.email, users.adminQA.password);
    await xPage.gotoPantallaInicial();
  });

  test('CA1: descripción del CA en español', async () => {
    await xPage.accionPaso1();
    await xPage.validarResultadoEsperado();
  });

  test.skip('CA5: caso bloqueado', async () => {
    // SKIP [IMP-001]: razón resumida.
  });
});
```

## Antes vs. Después

❌ **Mal** — lógica + comentarios + hardcode + selector inline:
```typescript
test('CA8: limpiar filtros restablece tabla', async ({ page }) => {
  const totalInicial = await listPage.contarFilasVisibles();
  await listPage.validarLimpiarFiltrosDeshabilitado();
  await listPage.aplicarFiltroTipo('TipoA');
  // Solo "registro-seed" queda con TipoA
  await listPage.validarFilaVisible('registro-seed');
  await page.locator('[data-testid="clear"]').click();
  expect(await listPage.contarFilasVisibles()).toBe(totalInicial);
});
```

✅ **Bien** — sólo método calls, todo nombrado:
```typescript
test('CA8: limpiar filtros restablece tabla', async () => {
  await listPage.guardarConteoFilasVisibles();
  await listPage.validarLimpiarFiltrosDeshabilitado();
  await listPage.aplicarFiltroTipo(ListPage.TIPO_A);
  await listPage.validarSoloFilaSeedVisible();
  await listPage.clickLimpiarFiltros();
  await listPage.validarConteoFilasNoCambio();
});
```

## Header del spec

Mantener un único bloque JSDoc al tope con: `HU` (link), `Ambiente`, lista de CAs cubiertos, lista de CAs skipped (con IMP). Sin más comentarios en el archivo. La narrativa detallada vive en `docs/user-stories/<ID>.md`.

## Estrategia de autenticación

El proyecto tiene 2 estrategias de auth, según el tipo de spec:

**A) `loginPage.ensureAuthenticated()` + `test.use({ storageState })`** — para specs **cortos** (1 pantalla, sin wizard). Patrón resiliente:
1. El `test.use({ storageState })` carga el token cacheado por `global-setup` → 0ms si está fresco.
2. `ensureAuthenticated()` navega a una ruta protegida y verifica la URL: si quedamos en `/auth/login` (token expirado), hace login fresco automáticamente y **persiste el storageState refrescado en disco** para los siguientes tests.

Sobrecosto: ~200-500ms por test cuando el token está fresco; ~10-15s cuando expiró + refresh.

```typescript
test.use({ storageState: 'tests/.auth/admin-qa.json' });

test.beforeEach(async ({ page, users }) => {
  loginPage = new LoginPage(page);
  xPage = new XPage(page);
  await loginPage.ensureAuthenticated(users.adminQA.email, users.adminQA.password);
  await xPage.gotoPantallaInicial();
});
```

**B) `loginPage.completeLogin()` directo (sin `storageState`)** — para specs **largos** que entran a un wizard multi-paso o editor complejo. Razón: `global-setup` sólo regenera el token al inicio del runner; en suites largas con wizard la sesión se vuelve flake si el token expira intra-sesión. Documentar el caso concreto en `lecciones-aprendidas.md` cuando lo encuentres. Para estos specs:

```typescript
// SIN test.use({ storageState })

test.beforeEach(async ({ page, users }) => {
  loginPage = new LoginPage(page);
  xPage = new XPage(page);
  await loginPage.completeLogin(users.adminQA.email, users.adminQA.password);
  await xPage.navegarAPasoIntermedio();
});
```

**Cómo elegir**: por defecto usar **A** (`ensureAuthenticated`). Pasar a **B** si el spec navega a un wizard multi-paso completo o a un editor complejo, o si una corrida con A da fallos intermitentes de redirect a `/auth/login`.

## Por qué estas reglas

- **Mantenibilidad**: cuando la UI cambia, los selectores/textos están en UN lugar (POM). Sin estas reglas terminamos con 50 specs que hardcodean `'Agregar'` y todos se rompen a la vez.
- **Legibilidad**: leer un spec debe responder "qué se valida", no "cómo". El "cómo" pertenece al POM.
- **Reuso**: los métodos `validar*`/`accion*` se reusan entre tests. Los `expect` inline no.
- **Trazabilidad**: cada acción decorada con `@step` aparece como paso nombrado en el reporte de Playwright. `expect` inline no genera step legible.
