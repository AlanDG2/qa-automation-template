# CLAUDE.md — Template de QA Automation (Playwright + TypeScript)

> Índice ligero del cerebro QA. Los procedimientos multi-paso viven en skills (`.claude/skills/`) que cargan on-demand. Aquí solo quedan las reglas **siempre visibles** (DoD, data dinámica, reglas de comportamiento) y el mapa de navegación.
>
> 🧭 **Antes de cualquier tarea, leer [`AGENTS.md`](AGENTS.md)** — navegación: decision trees, inventario de skills, cuándo usar qué.
>
> 🚀 **Proyecto nuevo:** completar [`SETUP.md`](SETUP.md) antes de empezar. Define idioma de tests, prefijo de keys, URLs, usuarios y el gestor de tickets (adaptador).

---

## 🚨 PRE-FLIGHT — Definition of Done

Antes de declarar una HU "lista / al 100%", verificar el **DoD compuesto**:

- **5 criterios universales** (siempre): ver [`core/dod/dod-core.md`](core/dod/dod-core.md).
- **+ criterios del adaptador de tickets activo** (si hay): ver `adapters/<activo>/dod-ticket.md`.

Resumen de los 5 universales: (1) cada CA mapea a ≥1 test; (2) pasos completos (Acción+Datos+Resultado); (3) idioma del proyecto; (4) 0 duplicados; (5) re-ejecutados y pasando en esta sesión.

**Regla dura:** si falta CUALQUIER criterio aplicable → la HU NO está al 100%. Es "casi 100%" o "no cumple". **NUNCA inflar el estado.** Si un criterio no se cumple, decirlo honesto sin que el usuario pregunte.

> El hook `.claude/hooks/preflight-check.sh` inyecta este DoD (core + adaptador) en cada prompt.

---

## ✂️ Regla de concisión (cómo respondo)

- **Corto y al grano.** Sin preámbulos, sin relleno, sin resumir lo que el usuario ya dijo. Directo a la respuesta o a la acción.
- **Tono natural y humano**, no corporativo ni acartonado. Como un colega QA que sabe del tema.
- **No narrar de más ni repetirme.** No describir cada paso obvio, no repetir lo que ya está en pantalla, no re-explicar lo ya dicho.
- **PERO la concisión NO aplica a lo crítico.** Al tocar el pipeline de carga, una regla del DoD, datos reales (gestor de tickets / BD), o una verificación de cero-pérdida/seguridad → **mostrar el detalle completo**: qué verifiqué, con qué evidencia, qué encontré. Conciso en lo rutinario, riguroso en lo crítico.

- **Prosa human-facing — pulir el "olor a IA".** Aplican **SOLO** a texto que **lee un humano** (reporte de bug, mensajes a dev/PO, resúmenes de HU para el equipo). En esa prosa, además:
  - **No inflar significancia.** Síntoma e impacto reales, sin dramatizar.
  - **No hedging vacío.** Afirmar con evidencia o decir "no verificado"; nada de "parecería/podría/aparentemente".
  - **No cierres-resumen de relleno.** Terminar en el último dato útil, sin moraleja.
  - **No tríadas decorativas ni paralelismos de adorno.** Una frase directa.

  > ⛔ **Estas 4 NO aplican a lo técnico-crítico.** En verificaciones de seguridad, reportes de cobertura y auditorías DoD, el detalle completo y los marcadores funcionales (✅/⚠️/🔴) se quedan — ahí no se recorta nada.

- **Smell test antes de enviar**: ¿hay relleno que puedo cortar? ¿Repetí algo? ¿Soné acartonado? → reescribir. Y al revés: ¿recorté evidencia en algo crítico? → expandir.

## 🪙 Reglas de token (no malgastar contexto)

- **No releer lo que ya tengo.** Si un archivo ya se leyó en esta sesión y no cambió, no volver a leerlo. Tras un `Edit`/`Write` exitoso no hace falta re-`Read`.
- **No repetir.** No volcar contenido que ya está en pantalla, no re-explicar una skill ya cargada.
- **Convertir antes de leer PDFs.** Usar la skill `doc-to-markdown` antes de leer un `.pdf` — el PDF renderizado cuesta ~1500-3000 tokens/página; el texto, una fracción.
- **Leer dirigido, no entero.** Para un dato puntual, usar Grep/Glob o `Read` con `offset`/`limit`.
- **Avisar antes de operaciones caras.** Antes de leer un PDF grande, fan-out de agentes, o leer carpetas enteras → avisar y proponer la alternativa barata.
- **Delegar barridos amplios a subagentes** (quedarse con la conclusión, no el volcado de archivos).

## 🧪 Regla de data dinámica (diseño de tests)

> Aplica al **escribir, auditar y planear** tests.

- **Todo test crea su propia data dentro del flujo** (cuentas, clientes, entidades del dominio). **Nunca depender de seeds estáticos del ambiente.** Los seeds compartidos cambian/se borran y rompen tests sin aviso; los tests destructivos sobre seeds afectan a otros.
- **Cómo aplicarla:** nombres únicos con timestamp (`` `<TEST>_<Date.now()>` ``); crear la entidad-precondición dentro del test; cleanup explícito al final si se modificó algo persistente.
- **Anti-patrones:** ❌ nombre fijo (`const X = 'plan-seed'`); ❌ asumir que una entidad existe; ❌ usar la cuenta admin como *objeto* del test (sí como admin autenticado).
- **Excepciones** (justificar en el spec): validar el *propio* catálogo seed (timezones, roles); tests de solo-lectura.

---

## 🧩 Mapa de skills del cerebro

Skills en `.claude/skills/`, cargan on-demand (solo su `description` se precarga). El agente las invoca por su `description`, o el usuario con `/<nombre>`.

> Esta tabla lista **solo las skills que ya existen como archivo**. El template se construye por tandas; el mapa crece en sync con `.claude/skills/`. No se listan skills que aún no estén presentes (un puntero no debe apuntar a algo que no está).

| Skill | Qué cubre | Se carga cuando |
|---|---|---|
| `qa-hu-intake` | Protocolo de análisis contextual antes de automatizar una HU | recibís una HU nueva |
| `qa-risk-test-design` | Diseño de casos por riesgo (NIST/ISTQB): cuántos/qué casos | planeás la cobertura de una HU |
| `qa-mcp-vs-pom` | Decisión: explorar con MCP vs leer POM existente | abordás una pantalla nueva/parcial |
| `qa-pom-authoring` | Crear/extender POMs (extender-nunca-romper, checklist) | tocás un `pages/*Page.ts` |
| `qa-spec-conventions` | Las 3 reglas de specs + estructura + auth | escribís/revisás un `.spec.ts` |
| `qa-troubleshooting` | Algo falló: auto-healing + bloqueo + impedimentos | un test falla / hay un bloqueo |
| `qa-coverage-validation` | Reporte de cobertura CA→test + veredicto (banner DoD) | auditás cobertura de una HU |
| `qa-testcase-auditor` | Gate GO/NO-GO de calidad antes de cargar casos | revisás un `tests.md` |
| `qa-bug-report` | Reporte de bug estructurado (gating PASS/ENV) | reportás un bug |
| `qa-continuous-learning` | Ciclo de aprendizaje: qué documentar, cuándo promover a regla | cerrás una automatización |
| `doc-to-markdown` | PDF→texto UTF-8 antes de leerlo (ahorro de tokens) | vas a leer un `.pdf` |
| `skill-creator` | Crear una skill nueva, o adaptar una externa (patrón "tomar lo mejor") sin duplicar | aparece una necesidad recurrente que ninguna skill cubre |
| `skill-doctor` | Linter de calidad de skills: frontmatter, description, punteros, registro | tras crear/adaptar una skill, o al revisar la salud del cerebro |

> **Meta-skills universales** (`skill-creator`, `skill-doctor`): el cerebro sabe extenderse a sí mismo. Un proyecto puede crear sus propias skills o adaptar ideas externas cuando el trabajo real lo pida.

> Las 3 skills que tocan el gestor de tickets (`qa-coverage-validation`, `qa-testcase-auditor`, `qa-bug-report`) llaman a la **interfaz de adaptador** (`adapters/ticket-manager.interface.md`), nunca a un gestor concreto. Con el adaptador `none` (default) funcionan sin gestor.

---

## Arquitectura del template

- **`core/`** — lo agnóstico, viene lleno y funciona (DoD core, schemas, validadores, lib de pipeline).
- **`adapters/`** — conectores de gestor de tickets enchufables (`none` default + `jira-xray` de ejemplo).
- **`docs/` y `qa-workspace/`** — arrancan vacíos con plantilla; el proyecto los llena.
- **`apps/e2e/`** — scaffold Playwright/TS; `pages/` y `tests/` vacíos (los pone el proyecto).
- **`.claude/skills/`** — el cerebro QA (este índice las mapea).

Convenciones técnicas (cómo se hace cada cosa) viven en las skills; este `CLAUDE.md` es el índice.
