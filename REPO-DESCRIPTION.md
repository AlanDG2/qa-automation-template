# Descripción del repo (para GitHub)

> Texto listo para la página del repo en GitHub: la descripción corta, el About, los topics, y la nota de "Use this template". Copiá lo que necesites al crear el repo.

---

## Descripción corta (campo "Description" de GitHub)

```
Template de QA automation con Playwright + TypeScript. Cerebro de skills afinado, gestor de tickets agnóstico/enchufable (none por defecto, Jira/Xray de ejemplo). Usable de entrada con "Use this template".
```

## Topics sugeridos (campo "Topics")

```
playwright  typescript  qa-automation  e2e-testing  test-automation  claude-code  template  page-object-model  jira  xray
```

## Configuración del repo

- ✅ Marcar **"Template repository"** en Settings → así aparece el botón "Use this template".
- Visibilidad: público o privado, a elección. **No hay secretos** — es seguro en cualquiera de los dos.

---

## README / About (versión larga para la portada)

**QA Automation Template (Playwright + TypeScript)**

Template para arrancar un proyecto de QA automation con un "cerebro" de skills ya afinado y un gestor de tickets **agnóstico y enchufable**. Pensado para usarse con el botón *"Use this template"* de GitHub.

### Qué resuelve

Cada proyecto QA nuevo repite el mismo arranque: definir convenciones de specs, cómo se escriben los POMs, cómo se diseñan los casos, qué es "done", cómo se reporta un bug. Este template trae todo eso ya decidido y probado, sin arrastrar nada específico de un proyecto concreto.

### Qué incluye

- **11 skills** de Claude Code que cubren el flujo completo: análisis de HU, diseño por riesgo (NIST/ISTQB), autoría de POMs (extender-nunca-romper), convenciones de specs, troubleshooting, auditoría de cobertura, reporte de bugs, aprendizaje continuo, conversión de PDFs.
- **DoD dividido**: 5 criterios universales (siempre) + criterios de ticket que aporta el adaptador (solo si enchufás uno).
- **Adaptador de tickets enchufable**: `none` por defecto (funciona sin configurar nada), `jira-xray` de ejemplo (stub sin credenciales). La interfaz abstrae el gestor: las skills nunca llaman a Jira directo.
- **Pipeline genérico** (Python): leer HU → generar casos → formatear bug.
- **Reglas de comportamiento**: concisión, ahorro de tokens, data 100% dinámica.

### Usable de entrada

Recién clonado, con el adaptador `none`, el template ya funciona: procesa una HU y genera el esqueleto de casos sin necesidad de ningún gestor de tickets. Enchufar Jira/Xray (u otro) es opcional y se hace por adaptador, sin tocar las skills.

### Cómo empezar

Ver [`README.md`](README.md) y el checklist [`SETUP.md`](SETUP.md).

### Seguridad

Cero credenciales versionadas. El `client.mjs` real de un adaptador y el `.env` están gitignored; solo se versiona el stub `client.example.mjs` con placeholders.
