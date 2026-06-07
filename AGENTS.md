# AGENTS.md — Navegación del template QA

> Mapa neuronal: decision trees, inventario de skills, reglas duras. `CLAUDE.md` es el índice de convenciones; este archivo es la **navegación** (cuándo, dónde, qué usar). **NO se auto-carga** — cuesta 0 tokens hasta referenciarse.

## 🎯 Decision tree por tipo de tarea

### Recibí una HU nueva para automatizar
1. Identificar tipo: **E2E** (UI), **API** (contratos/BD), o **mixta**.
2. Si viene en PDF → convertir con skill `doc-to-markdown` antes de leer.
3. Skill `qa-hu-intake`: guardar HU → recopilar contexto (impedimentos, lecciones, conocimiento, HUs vecinas, POMs) → analizar gaps → preguntar solo lo necesario.
4. Skill `qa-risk-test-design`: diseñar cuántos/qué casos por riesgo.
5. Skill `qa-mcp-vs-pom`: ¿explorar con MCP o leer POM existente?
6. Skill `qa-pom-authoring`: crear/extender el POM (extender-nunca-romper).
7. Skill `qa-spec-conventions`: escribir el spec (3 reglas + data dinámica).
8. Si algo falla → skill `qa-troubleshooting`.
9. Auditar: `qa-coverage-validation` (CA→test) + `qa-testcase-auditor` (gate).
10. Si hay gestor de tickets → cargar casos vía el adaptador activo (con tu OK).
11. Documentar aprendizajes → skill `qa-continuous-learning`.

### Encontré un bug
- Skill `qa-bug-report`: clasificar PASS / ENV_BLOCKED / bug real. Si es real → Defect vía el adaptador. Si es ambiente → impedimentos/bloqueos, no Defect.

### Quiero auditar una HU existente
- `qa-coverage-validation` para cobertura de diseño + el DoD compuesto para el cierre.

### Quiero explorar una pantalla nueva
- MCP de navegador (Playwright): navigate → snapshot → mapear selectores. Ver `qa-mcp-vs-pom`.

## 🧩 Inventario de skills

Ver la tabla en [`CLAUDE.md`](CLAUDE.md) §"Mapa de skills del cerebro" — lista **solo las skills ya presentes** (el template se construye por tandas; el mapa crece en sync con `.claude/skills/`).

Destino final (11 skills cuando el template esté completo):
- **Universales:** `qa-hu-intake`, `qa-risk-test-design`, `qa-mcp-vs-pom`, `qa-pom-authoring`, `qa-spec-conventions`, `qa-troubleshooting`, `qa-continuous-learning`, `doc-to-markdown`.
- **Tocan el gestor de tickets (vía interfaz de adaptador):** `qa-coverage-validation`, `qa-testcase-auditor`, `qa-bug-report`.

## 🚦 Reglas duras (NO negociables)

1. 🚫 **NUNCA hardcodear URLs.** Usar la config de ambiente (`config/urls.ts`, leído de env).
2. 🚫 **NUNCA hardcodear credenciales.** Usar fixtures.
3. 🚫 **NUNCA duplicar locators** ya existentes en un POM. Leer el POM completo antes de extender (extender-nunca-romper).
4. 🚫 **NUNCA depender de seeds estáticos** como objeto del test. Data 100% dinámica (ver `CLAUDE.md`).
5. 🚫 **NUNCA inflar el estado de una HU.** Si falta un criterio DoD → decirlo honesto.
6. 🚫 **NUNCA escribir mutaciones destructivas vía MCP de BD** (solo lectura).
7. ✅ **SIEMPRE pedir OK antes de cargar casos al gestor de tickets** (evita duplicados).
8. ✅ **SIEMPRE separar bug de producto vs fallo de ambiente** antes de abrir un Defect.

## 🔌 Gestor de tickets (adaptador)

El template es **agnóstico** del gestor de tickets. La lógica genérica (leer HU, generar casos, formatear bug) vive en `core/lib/`; el conector concreto es un **adaptador enchufable** en `adapters/`.

- **Sin tickets** → adaptador `none` (default). DoD = 5 criterios universales.
- **Con Jira/Xray** → adaptador `jira-xray` de ejemplo (rellenar credenciales). DoD = 5 + 3.
- **Otro gestor** → crear `adapters/<tuyo>/` cumpliendo `adapters/ticket-manager.interface.md`.

## 🪝 Hooks

- `.claude/hooks/preflight-check.sh` — inyecta el DoD compuesto (core + adaptador activo) en cada prompt. Versionado (cerebro compartido). Tras clonar, registrarlo en `.claude/settings.json` (config local, no versionada).

## 📁 Estructura

Ver `CLAUDE.md` §"Arquitectura del template". Resumen: `core/` lleno · `adapters/` enchufables · `docs/` + `qa-workspace/` vacíos con plantilla · `apps/e2e/pages` + `tests` vacíos.
