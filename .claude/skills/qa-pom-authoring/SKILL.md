---
name: qa-pom-authoring
description: Cómo crear o extender un Page Object Model (POM) en este proyecto E2E — regla "extender nunca romper", workflow MCP→snapshot→locators, checklist de autoría de POM (locators cacheados, @step en español, scoping de .first()/.last()) y cómo trabajar POMs adelantados con flujos completos. Invocar al crear o modificar cualquier pages/*Page.ts.
---

# Autoría de POMs (Page Object Models)

> **Convención de autoría de POMs del proyecto** (§Regla fundamental: Extender nunca romper, §MCP Exploration & POM Authoring Workflow, §POM Authoring Checklist, §Trabajar con POMs existentes adelantados).

> 🔗 Para decidir **si** explorar con MCP o leer el POM existente, ver skill [`qa-mcp-vs-pom`](../qa-mcp-vs-pom/SKILL.md). Esta skill cubre el **cómo** construir/extender.

---

## 1. Regla fundamental: Extender, nunca romper

Antes de modificar cualquier POM o spec existente:

1. **LEER** el archivo completo (Read tool) para entender qué ya existe
2. **IDENTIFICAR** métodos y locators ya existentes — **no duplicarlos**
3. **AGREGAR** solo lo que no existe — nunca reescribir código que funciona
4. **REUTILIZAR** locators existentes si sirven para el nuevo caso de uso
5. **COMPONER** — si un método cubre parcialmente la necesidad, crear uno nuevo que lo llame

### Ejemplos concretos:

<!-- EJEMPLO: reemplazá los nombres genéricos (XPage / ListPage / flujoCompleto) por tus POMs y métodos reales cuando los tengas -->

#### ✅ Ejemplo 1: Extender un POM de listado

**Contexto**: Necesitas agregar validación de paginación, pero `ListPage` ya tiene filtros y búsqueda.

```typescript
// ❌ MAL: Duplicar locator que ya existe
private readonly searchInput: Locator; // Ya existe en el constructor

// ✅ BIEN: Agregar solo lo nuevo
private readonly nextPageButton: Locator;
private readonly pageIndicator: Locator;

@step('Navegar a página siguiente')
async goToNextPage() {
  await this.nextPageButton.click();
  await this.waitForSpinner(); // Reutiliza método existente del POM
}
```

#### ✅ Ejemplo 2: Extender un POM con flujo compuesto

**Contexto**: `XPage` tiene `flujoCompleto()` que hace todo el wizard. Necesitas agregar validación de un modal específico en una sección.

```typescript
// ❌ MAL: Reescribir flujoCompleto() completo
async flujoCompletoConValidacion() {
  // ... copiar las 80+ líneas de flujoCompleto()
}

// ✅ BIEN: Agregar método atómico para el modal nuevo
@step('Validar modal de advertencia')
async validarModalAdvertencia() {
  await expect(this.page.locator('app-modal', { hasText: 'Advertencia' })).toBeVisible();
  await this.page.getByRole('button', { name: 'Entendido' }).click();
}

// Y crear un método de flujo que combine
@step('Flujo completo con validación de modal')
async flujoCompletoValidandoModal() {
  await this.clickIniciar();
  await this.esperarPrimerPaso();
  await this.validarModalAdvertencia(); // NUEVO
  await this.clickContinuar();
  // ... reutiliza el resto del flujo existente llamando a métodos atómicos
}
```

#### ✅ Ejemplo 3: Componer métodos existentes

**Contexto**: Necesitas filtrar por un estado y abrir el primer registro. `ListPage` ya tiene ambos métodos.

```typescript
// ❌ MAL: Duplicar la lógica
async filtrarActivoYAbrir() {
  await this.estadoFilterButton.click(); // Duplica método existente
  await this.page.locator('li').filter({ hasText: /^Activo$/ }).click(); // Duplica
  await this.clickFirstRow(); // Duplica
}

// ✅ BIEN: Reutilizar el método de composición que ya existe en el POM
await listPage.filterAndOpenFirstWithStatus('Activo');
```

---

## 2. MCP Exploration & POM Authoring Workflow

Cuando se necesita automatizar una nueva pantalla o flujo, seguir estos pasos en orden:

**Paso 1 — NAVIGATE**
Usar `mcp__playwright__browser_navigate` con `URLS.web` o `URLS.bo` como base. Nunca hardcodear la URL.

**Paso 2 — SNAPSHOT**
`mcp__playwright__browser_snapshot` devuelve el árbol de accesibilidad con `[ref=eXX]` por elemento.
Para cada elemento interactivo anotar: `role`, nombre accesible exacto en español, y ref.

**Paso 3 — SCREENSHOT** *(opcional)*
Solo cuando el snapshot no identifica suficientemente un elemento visual.

**Paso 4 — INTERACTUAR para exponer estados dinámicos**
Hacer clic en tabs, abrir dropdowns, enviar formularios vacíos (para ver mensajes de error).
Re-hacer snapshot después de cada interacción relevante antes de mapear locators.

**Paso 5 — MAPEAR LOCATORS** (orden de preferencia estricto)
1. `page.getByRole(role, { name: 'nombre español exacto' })`
2. `page.getByLabel('texto label')`
3. `page.locator('[data-testid="valor"]')`
4. `page.locator('tag', { hasText: 'texto' })`
5. `page.locator('.css-class')` — último recurso

**Paso 6 — CONSTRUIR POM** (ver checklist abajo)

**Paso 7 — ACTUALIZAR** `docs/app-map.md` y `docs/coverage-register.md`

---

## 3. POM Authoring Checklist

Al crear o extender un POM:

```
[ ] LEER el POM completo si ya existe (no asumir que está vacío)
[ ] Archivo: pages/<NombreFeature>Page.ts
[ ] Imports: Page, Locator, expect de @playwright/test
[ ] Import: step de ../utilities/decorators
[ ] Import: URLS de ../config/urls  (solo si el POM navega con goto)
[ ] Locators: private readonly <nombre>: Locator
[ ] Locators cacheados en el constructor — NUNCA re-queried dentro de métodos
[ ] NO duplicar locators que ya existen — verificar líneas del constructor
[ ] Todos los métodos public async decorados con @step('Verbo en español...')
[ ] Nombres de steps en español, coherentes con el texto de la UI
[ ] Métodos atómicos primero; métodos de flujo compuesto al final (llaman a los atómicos)
[ ] Sin URLs hardcodeadas — solo URLS.web o URLS.bo
[ ] Sin default export — export nombrado de la clase
[ ] Assertions con expect() dentro del POM cuando forman parte natural del flujo
[ ] Si extiendes un POM, agregar comentario indicando qué sección agregaste
[ ] **Scoping obligatorio para `.first()` / `.last()` sobre roles/textos repetibles**:
    NUNCA usar `page.getByRole('button'/'link', { name }).first()` ni
    `page.getByText(...).first()` directamente al nivel `page.` cuando ese
    texto/rol pueda existir en múltiples cards/filas/modales. Anclar siempre
    a un padre único: `dialog`, `aside`, o tarjeta filtrada por heading.
    Patrón canónico:
        private tarjetaPorTitulo(nombre: string): Locator {
          return this.page
            .getByRole('heading', { name: nombre, level: 3, exact: true })
            .locator('xpath=ancestor::div[descendant::button][1]');
        }
        // Uso:
        await this.tarjetaPorTitulo('<Nombre de la tarjeta>')
          .getByRole('button', { name: '<Acción>' }).click();
    <!-- EJEMPLO: si llevás un inventario de casos legacy con .first()/.last()
         frágiles, referencialo aquí. Fix reactivo: refactorizar cuando el
         test falle, no preventivo. -->
```

---

## 4. Trabajar con POMs existentes adelantados

Algunos POMs en este proyecto pueden tener **trabajo adelantado** — métodos complejos que cubren flujos completos pero que pueden necesitar extensión.

### Caso especial: un POM con método de flujo completo

<!-- EJEMPLO: cuando tengas un POM con un método "flujo completo" (un wizard multi-paso, un editor), documentá aquí sus pasos como referencia, igual que este esqueleto genérico -->

Supón que `XPage` tiene un método `flujoCompleto()` que implementa un wizard multi-paso de extremo a extremo, por ejemplo:
1. Click Iniciar
2. Paso A (continuar)
3. Paso B (continuar)
4. Paso C (lógica condicional: si ya existe el sub-flujo, continuar; si no, crearlo)
5. Paso D (modales intermedios)
6. Paso E (interacción compleja: drag & drop, formulario)
7. Modal de confirmación
8. Paso final (guardar / publicar)

#### ¿Cuándo extender vs cuándo usar as-is?

**Usar as-is** si:
- La HU cubre exactamente el mismo flujo feliz
- No necesitas validaciones intermedias
- No hay variantes de comportamiento

**Extender** si:
- Necesitas validar mensajes de error en pasos específicos
- El flujo tiene variantes (ej: plan de prueba vs plan de pago)
- Necesitas validar estados intermedios
- Debes probar casos de error (validaciones fallidas)

#### Estrategia de extensión:

1. **Leer el método completo** `flujoCompleto()` para entender el flujo actual
2. **Identificar puntos de extensión** — ¿qué pasos necesitan validaciones adicionales?
3. **Agregar métodos atómicos** para las validaciones nuevas:
   ```typescript
   @step('Validar toast de error en el paso B')
   async validarErrorPasoBVacio() {
     await expect(this.page.getByText('<Texto exacto del mensaje de error>')).toBeVisible();
     await expect(this.continuarButton).toBeDisabled();
   }
   ```
   <!-- EJEMPLO: el texto exacto del mensaje de error que valida este caso -->
4. **Crear método de flujo específico** que combine lo existente con lo nuevo:
   ```typescript
   @step('Flujo completo validando error en el paso B')
   async flujoCompletoValidandoPasoB() {
     await this.clickIniciar();
     await this.esperarPasoA();
     await this.clickContinuar();
     await this.esperarPasoB();
     await this.vaciarPasoB(); // NUEVO método atómico
     await this.clickContinuar();
     await this.validarErrorPasoBVacio(); // NUEVO método atómico
   }
   ```

**NO hacer**: Copiar y pegar `flujoCompleto()` con pequeños cambios. Esto genera código duplicado difícil de mantener.
