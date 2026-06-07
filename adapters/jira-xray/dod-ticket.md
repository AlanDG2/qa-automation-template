# Criterios de DoD del adaptador jira-xray

> Estos criterios se **suman** a los 5 universales de `core/dod/dod-core.md` cuando este adaptador está activo. Con jira-xray activo, el DoD final tiene 8 criterios.

## Criterios de cierre adicionales (gestor de tickets)

6. **0 Defects activos vinculados** — todos en estado final (Finalizada/Done). Si hay un defect abierto vinculado, la HU NO cierra; se transiciona a Re-Abierta.
7. **1 sola ejecución de prueba activa** — la de la sesión de cierre. Las ejecuciones viejas y los tests duplicados se desvinculan; queda solo la actual.
8. **Runs PASSED con evidencia en cada run + status del ticket = el de cierre.** La evidencia se adjunta a **cada test run individual** (no solo a la ejecución):
   - **API** → output del run en cada test run.
   - **E2E** → video adjunto a cada test run + reporte HTML adjunto a la ejecución.

## Orden de validación (cuando este adaptador está activo)

1. Validar defects vinculados → retestear → finalizar (NUNCA desvincular para esquivar el bloqueo).
2. Desvincular ejecuciones viejas + tests duplicados (queda solo la ejecución de hoy).
3. Validar los 5 criterios universales (core) + estos 3.
4. Importar/actualizar tests + adjuntar evidencias por run.
5. Recién entonces reportar "HU al 100%".

> El `checkClosable(id)` del `client.mjs` debe verificar 6-8 contra Jira/Xray en vivo. Si no puede consultar en vivo → devolver "no verificado", no asumir.
