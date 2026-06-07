# QA Automation Template (Playwright + TypeScript)

Template reutilizable para arrancar un proyecto de QA automation con un "cerebro" de skills ya afinado y un **gestor de tickets agnóstico/enchufable**. Se usa con el botón **"Use this template"** de GitHub.

## Qué trae

- **Cerebro QA** (`.claude/skills/`): 11 skills que cubren el flujo completo — análisis de HU, diseño por riesgo, autoría de POMs, convenciones de specs, troubleshooting, auditoría de cobertura, reporte de bugs, aprendizaje continuo, conversión de PDFs.
- **Reglas siempre visibles** (`CLAUDE.md`): DoD compuesto, concisión, reglas de token, data 100% dinámica.
- **DoD dividido**: 5 criterios universales (siempre) + criterios de ticket que aporta el adaptador (solo si enchufás uno).
- **Adaptadores de tickets** (`adapters/`): `none` (default, funciona sin nada) + `jira-xray` (ejemplo/stub).
- **Pipeline genérico** (`core/lib/`, Python): leer HU → generar casos → formatear bug.
- **Scaffold Playwright/TS** (`apps/e2e/`): config + `pages`/`tests` vacíos.

## Arranque (paso a paso)

```bash
# 1. Crear tu repo desde este template (botón "Use this template" en GitHub).

# 2. Instalar
npm install
npx playwright install

# 3. (si vas a usar el pipeline core/lib) tener Python 3.10+

# 4. Completar el checklist
#    → abrir SETUP.md y marcar cada casilla:
#      identidad del proyecto, ambiente (.env), gestor de tickets, hook.

# 5. Elegir gestor de tickets:
#    - SIN gestor → dejar adapters/none activo. Listo, DoD = 5 criterios.
#    - CON Jira/Xray → seguir adapters/jira-xray/README.md. DoD = 8.

# 6. Verificar
npm run validate        # control plane OK

# 7. Escribir tu primer POM (skill qa-pom-authoring) y spec (skill qa-spec-conventions).
#    Al recibir tu primera HU, la skill qa-hu-intake arranca el flujo.
```

## Probar el pipeline sin gestor (adaptador `none`)

```bash
# Leer una HU y generar el esqueleto de casos — sin Jira, sin nada configurado:
python core/lib/read_hu.py docs/_templates/user-story.template.md | python core/lib/generate_cases.py
```

## Estructura

```
.claude/skills/   cerebro QA (11 skills, cargan on-demand)
.claude/hooks/    preflight-check.sh (inyecta el DoD compuesto)
CLAUDE.md         índice ligero + reglas siempre visibles
AGENTS.md         navegación (decision trees, reglas duras)
core/
  dod/            DoD dividido (core 5 + cómo suma el adaptador)
  lib/            pipeline Python (read_hu, generate_cases, format_bug)
  schemas/        schemas JSON de estructura (bug, test-case, qa-report)
  validate/       validador del control plane
adapters/
  ticket-manager.interface.md   el contrato agnóstico
  none/           default — funciona sin gestor
  jira-xray/      ejemplo/stub (sin credenciales reales)
docs/             plantillas vacías (lecciones, conocimiento, cobertura, impedimentos)
qa-workspace/     control plane (arranca con plantillas)
apps/e2e/         scaffold Playwright/TS (pages/ y tests/ vacíos)
SETUP.md          checklist de arranque
```

## Filosofía

- **Usable de entrada:** recién clonado, con `none`, ya funciona (DoD de 5 criterios, pipeline local).
- **Enchufable:** el gestor de tickets es un adaptador; las skills llaman a una interfaz, nunca a un gestor concreto. Cambiar de Jira a otro no toca las skills.
- **Sin secretos:** cero credenciales versionadas. El `client.mjs` real y el `.env` están gitignored.

## Roadmap (diferido)

- **CLI de scaffolding (`init`)** para automatizar el SETUP.md — diferido hasta que el uso real lo pida; por ahora el arranque es el checklist manual.
