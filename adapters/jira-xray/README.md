# Adaptador jira-xray (ejemplo)

Implementación de ejemplo de la [interfaz de ticket-manager](../ticket-manager.interface.md) para **Jira + Xray Cloud**.

> ⚠️ Es un **stub/molde**, no una integración lista. `client.example.mjs` tiene las firmas de las 6 operaciones con las llamadas marcadas `// TODO:`. Hay que implementarlas contra tu Jira REST + Xray GraphQL.

## Cómo activarlo

1. **Copiar el stub:** `cp client.example.mjs client.mjs` (el `.mjs` sin `.example` queda gitignored — ahí van tus llamadas reales).
2. **Implementar los `// TODO:`** de las 6 operaciones (`fetchStory`, `listLinkedTests`, `importTests`, `createDefect`, `getDoDTicketCriteria`, `checkClosable`).
3. **Credenciales en `.env`** (gitignored), nunca en el código:
   ```
   JIRA_BASE_URL=https://tu-dominio.atlassian.net
   JIRA_EMAIL=tu@correo.com
   JIRA_API_TOKEN=...
   JIRA_PROJECT_KEY=ABC
   XRAY_CLIENT_ID=...
   XRAY_CLIENT_SECRET=...
   XRAY_BASE_URL=https://xray.cloud.getxray.app
   ```
4. **Activar:** en `adapter.config.json` poner `"active": true`, y en `../none/adapter.config.json` poner `"active": false`.

## Qué aporta al DoD

Suma los criterios 6-8 (ver [`dod-ticket.md`](dod-ticket.md)) → el DoD pasa de 5 a 8 criterios.

## Reglas que el stub ya recuerda (comentadas en el código)

- **Pre-flight de Tests previos** antes de importar (re-importar duplica → detener y pedir decisión).
- **OK explícito del usuario** antes de cualquier escritura (importar, crear defect).
- **Defect, no Story**: la evidencia técnica va en el Defect.
- **Estado real, no asumido**: si no hay consulta en vivo → "no verificado", no inventar.

> Si tu proyecto usa otro gestor (Linear, Azure DevOps, etc.), no edites este adaptador: creá `adapters/<tu-gestor>/` cumpliendo la misma interfaz. Este queda como referencia.
