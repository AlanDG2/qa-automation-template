// ─────────────────────────────────────────────────────────────────────────────
// adapters/jira-xray/client.example.mjs
//
// STUB / MOLDE de un adaptador de gestor de tickets (Jira + Xray).
// NO es una integración lista — es el esqueleto que muestra CÓMO implementar
// la interfaz `adapters/ticket-manager.interface.md` contra un gestor real.
//
// ⚠️ CERO credenciales / endpoints reales aquí. Todo viene de .env (gitignored).
//    Variables esperadas (ver .env.example):
//      JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY
//      XRAY_CLIENT_ID, XRAY_CLIENT_SECRET, XRAY_BASE_URL
//
// Para activarlo:
//   1. Copiar este archivo a `client.mjs` (sin `.example`).
//   2. Rellenar las llamadas marcadas con `// TODO:` usando tu Jira REST + Xray GraphQL.
//   3. Poner tus credenciales en .env.
//   4. Marcar este adaptador activo (adapter.config.json → "active": true) y `none` → false.
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  jiraBaseUrl: process.env.JIRA_BASE_URL,        // ej. https://tu-dominio.atlassian.net
  jiraEmail: process.env.JIRA_EMAIL,
  jiraToken: process.env.JIRA_API_TOKEN,
  projectKey: process.env.JIRA_PROJECT_KEY,      // ej. ABC
  xrayClientId: process.env.XRAY_CLIENT_ID,
  xrayClientSecret: process.env.XRAY_CLIENT_SECRET,
  xrayBaseUrl: process.env.XRAY_BASE_URL || 'https://xray.cloud.getxray.app',
};

function assertConfigured() {
  if (!CONFIG.jiraBaseUrl || !CONFIG.jiraToken) {
    throw new Error('jira-xray no configurado. Completá .env (JIRA_BASE_URL, JIRA_API_TOKEN, ...).');
  }
}

// ── Operación 1: fetchStory(id) → HU.md ──────────────────────────────────────
export async function fetchStory(id) {
  assertConfigured();
  // TODO: GET {JIRA_BASE_URL}/rest/api/3/issue/{id}
  //       → mapear fields.summary + fields.description + el campo de CAs a un HU.md.
  //       Si el proyecto NO usa Jira para HUs, este adaptador puede dejar fetchStory
  //       como no-op y el usuario pega la HU a mano (como en `none`).
  throw new Error('STUB: implementá fetchStory con tu Jira REST.');
}

// ── Operación 2: listLinkedTests(id) → [{key, title, status}] ────────────────
export async function listLinkedTests(id) {
  assertConfigured();
  // TODO: Xray GraphQL getTestsByJira / Jira issue links → lista de Tests vinculados.
  //       ⚠️ Estado real, no asumido: si no se puede consultar en vivo, devolver
  //       { error: 'NO_VERIFICADO_EN_VIVO' } en vez de inventar.
  throw new Error('STUB: implementá listLinkedTests con tu Xray GraphQL.');
}

// ── Operación 3: importTests(testsFile, id) → {created, skipped, errors} ─────
export async function importTests(testsFile, id) {
  assertConfigured();
  // ⚠️ Pre-flight obligatorio: ANTES de importar, verificar si la HU ya tiene Tests
  //    vinculados (listLinkedTests). Si los tiene, DETENER y pedir decisión al usuario
  //    (editar local sin re-importar / borrar previos / cancelar). Re-importar duplica.
  // ⚠️ Pedir OK explícito del usuario antes de escribir.
  // TODO: Xray bulk import (CSV/JSON) o GraphQL mutations para crear Tests + Test Execution.
  throw new Error('STUB: implementá importTests con tu Xray bulk import.');
}

// ── Operación 4: createDefect(bug) → defectId ────────────────────────────────
export async function createDefect(bug) {
  assertConfigured();
  // ⚠️ Pedir OK explícito antes de crear. Issuetype = Defect (no Story).
  //    La evidencia técnica va en el Defect, no en la HU.
  // TODO: POST {JIRA_BASE_URL}/rest/api/3/issue con el payload del bug estructurado.
  throw new Error('STUB: implementá createDefect con tu Jira REST.');
}

// ── Operación 5: getDoDTicketCriteria() → texto de dod-ticket.md ─────────────
export async function getDoDTicketCriteria() {
  // Devuelve los criterios de cierre que este gestor impone (ver dod-ticket.md).
  // No requiere red — solo lee el archivo del adaptador.
  return 'Ver adapters/jira-xray/dod-ticket.md (criterios 6-8).';
}

// ── Operación 6: checkClosable(id) → {closable, missing} ─────────────────────
export async function checkClosable(id) {
  assertConfigured();
  // TODO: verificar contra Jira/Xray los criterios 6-8:
  //   - 0 Defects activos vinculados (todos en estado final).
  //   - 1 sola Test Execution activa.
  //   - runs PASSED con evidencia en cada run + status del ticket = el de cierre.
  // Devolver { closable: bool, missing: [criterios que faltan] }.
  throw new Error('STUB: implementá checkClosable con tu Jira/Xray.');
}
