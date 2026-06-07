// Fuente única de URLs base, leídas de variables de entorno. NUNCA hardcodear URLs en POMs/specs.
function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name} (ver .env.example).`);
  return v;
}

export const URLS = {
  web: process.env.WEB_BASE_URL || '',   // rellenar en .env
  // agregar bo/api/etc según el proyecto
  env: process.env.TEST_ENV || 'qa',
};
