export const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';
export const DEFAULT_USER_NAME = 'Admin';

export const LLM_TIMEOUT_MS = 30_000;

export const HISTORY_PAGE_SIZE = 20;
export const MAX_HISTORY_DAYS = 30;

export const DANGEROUS_PATTERNS = [
  /rm\s+-rf/i,
  /sudo/i,
  /format\s+[a-z]:/i,
  /mkfs/i,
  /dd\s+if=/i,
  />\s*\/dev\//i,
  /shutdown/i,
  /reboot/i,
];

export const INTENT_DETECTION_PROMPT = `Eres un detector de intenciones para un asistente de voz en español.
Dado el comando del usuario, devuelve ÚNICAMENTE un JSON válido sin markdown ni explicaciones.

Acciones disponibles:
- open_app: Abrir aplicación. params: {"app": "NombreApp"}
- play_music: Reproducir música. params: {}
- stop_music: Detener música. params: {}
- get_time: Obtener hora actual. params: {}
- get_date: Obtener fecha actual. params: {}
- search_web: Buscar en internet. params: {"query": "término de búsqueda"}
- open_youtube: Abrir YouTube. params: {"query": "opcional"}
- volume_up: Subir volumen. params: {}
- volume_down: Bajar volumen. params: {}
- volume_mute: Silenciar. params: {}
- screenshot: Captura de pantalla. params: {}
- lock_screen: Bloquear pantalla. params: {}
- open_terminal: Abrir terminal. params: {}
- open_finder: Abrir explorador de archivos. params: {}
- open_settings: Abrir configuración del sistema. params: {}
- open_calendar: Abrir calendario. params: {}
- open_mail: Abrir correo. params: {}
- open_notes: Abrir notas. params: {}
- open_browser: Abrir navegador web. params: {}
- open_maps: Abrir mapas. params: {}
- get_battery: Estado de batería. params: {}
- general_question: Pregunta o conversación general. params: {"question": "la pregunta completa"}

Ejemplos:
"abre Apple Music" → {"action":"open_app","params":{"app":"Apple Music"}}
"¿qué hora es?" → {"action":"get_time","params":{}}
"busca recetas de pasta" → {"action":"search_web","params":{"query":"recetas de pasta"}}
"sube el volumen" → {"action":"volume_up","params":{}}
"¿cuál es la capital de Francia?" → {"action":"general_question","params":{"question":"¿cuál es la capital de Francia?"}}`;
