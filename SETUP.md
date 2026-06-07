# SETUP — rellenar al arrancar un proyecto nuevo

Checklist para que el template quede listo. Marcá cada casilla.

## 1. Identidad del proyecto
- [ ] `qa-workspace/current-state.md` — nombre, stack, ambiente, idioma de tests.
- [ ] `qa-workspace/project-context.md` — qué es el producto.
- [ ] Idioma de tests (default español) → confirmar en `current-state.md` y `core/dod/dod-core.md` (criterio 3).

## 2. Ambiente
- [ ] `cp .env.example .env` y rellenar `WEB_BASE_URL`, `TEST_ENV`.
- [ ] `apps/e2e/config/urls.ts` — agregar las URLs que use el proyecto (bo/api/etc).
- [ ] `apps/e2e/fixtures/data/*.example.json` → copiar sin `.example` y rellenar.

## 3. Gestor de tickets (adaptador)
- [ ] **Sin gestor** → dejar `adapters/none` activo. **Nada más que hacer.** DoD = 5 criterios.
- [ ] **Con Jira/Xray** → seguir `adapters/jira-xray/README.md` (copiar client.example.mjs → client.mjs, rellenar TODOs + credenciales en .env, activar). DoD = 8.
- [ ] **Otro gestor** → crear `adapters/<tuyo>/` cumpliendo `adapters/ticket-manager.interface.md`.

## 4. Prefijo de keys (si usás gestor)
- [ ] El pattern de `ticketKey` en `core/schemas/*.json` es genérico (`^[A-Z]+-[0-9]+$`). Ajustar si tu gestor usa otro formato.

## 5. Hook del DoD
- [ ] Registrar el hook en `.claude/settings.json` (no versionado):
      `{ "hooks": { "UserPromptSubmit": [ { "hooks": [ { "type": "command", "command": "bash .claude/hooks/preflight-check.sh" } ] } ] } }`

## 6. Verificar
- [ ] `npm install && npx playwright install`
- [ ] `npm run validate` → control plane OK.
- [ ] Escribir el primer POM (skill `qa-pom-authoring`) y el primer spec (skill `qa-spec-conventions`).
