import { execFile } from 'child_process';
import { promisify } from 'util';
import { CommandError } from '../util/errors.js';
import { sanitizeParam } from '../util/helpers.js';
import { logger } from '../util/logger.js';
import type { ActionName } from '../policy/commandWhitelist.js';

const execFileAsync = promisify(execFile);

async function run(cmd: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync(cmd, args, { timeout: 10_000 });
  return stdout.trim();
}

async function openApp(appName: string): Promise<string> {
  await execFileAsync('open', ['-a', sanitizeParam(appName)], { timeout: 5_000 });
  return `${appName} abierto`;
}

async function openUrl(url: string): Promise<string> {
  await execFileAsync('open', [url], { timeout: 5_000 });
  return `Abriendo ${url}`;
}

const handlers: Record<ActionName, (params: Record<string, unknown>) => Promise<string>> = {
  open_app: async (p) => {
    const app = sanitizeParam(String(p['app'] ?? ''));
    if (!app) throw new CommandError('Nombre de aplicación requerido');
    return openApp(app);
  },

  play_music: async () => {
    await openApp('Music');
    return 'Reproduciendo música en Apple Music';
  },

  stop_music: async () => {
    await execFileAsync('osascript', ['-e', 'tell application "Music" to stop'], { timeout: 5_000 });
    return 'Música detenida';
  },

  get_time: async () => {
    return `Son las ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`;
  },

  get_date: async () => {
    return `Hoy es ${new Date().toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;
  },

  search_web: async (p) => {
    const query = sanitizeParam(String(p['query'] ?? ''));
    if (!query) throw new CommandError('Se requiere un término de búsqueda');
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await openUrl(url);
    return `Buscando "${query}" en Google`;
  },

  open_youtube: async (p) => {
    const query = p['query'] ? sanitizeParam(String(p['query'])) : '';
    const url = query
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      : 'https://www.youtube.com';
    await openUrl(url);
    return query ? `Buscando "${query}" en YouTube` : 'Abriendo YouTube';
  },

  volume_up: async () => {
    await execFileAsync('osascript', [
      '-e',
      'set volume output volume ((output volume of (get volume settings)) + 10)',
    ], { timeout: 5_000 });
    return 'Volumen aumentado';
  },

  volume_down: async () => {
    await execFileAsync('osascript', [
      '-e',
      'set volume output volume ((output volume of (get volume settings)) - 10)',
    ], { timeout: 5_000 });
    return 'Volumen disminuido';
  },

  volume_mute: async () => {
    await execFileAsync('osascript', ['-e', 'set volume with output muted'], { timeout: 5_000 });
    return 'Sonido silenciado';
  },

  screenshot: async () => {
    const filename = `${process.env['HOME'] ?? '~'}/Desktop/captura-${Date.now()}.png`;
    await execFileAsync('screencapture', ['-x', filename], { timeout: 10_000 });
    return 'Captura de pantalla guardada en el escritorio';
  },

  lock_screen: async () => {
    await run('pmset', ['displaysleepnow']);
    return 'Pantalla bloqueada';
  },

  open_terminal: async () => openApp('Terminal'),

  open_finder: async () => openApp('Finder'),

  open_settings: async () => {
    await openUrl('x-apple.systempreferences:');
    return 'Configuración del sistema abierta';
  },

  open_calendar: async () => openApp('Calendar'),

  open_mail: async () => openApp('Mail'),

  open_notes: async () => openApp('Notes'),

  open_browser: async () => {
    try {
      return await openApp('Google Chrome');
    } catch {
      return await openApp('Safari');
    }
  },

  open_maps: async () => openApp('Maps'),

  get_battery: async () => {
    const output = await run('pmset', ['-g', 'batt']);
    const match = output.match(/(\d+)%/);
    const level = match ? match[1] : 'desconocido';
    const charging = output.includes('charging') ? ', cargando' : '';
    return `Batería al ${level}%${charging}`;
  },

  general_question: async () => {
    return '__LLM_ANSWER__';
  },
};

export const commandService = {
  async execute(action: ActionName, params: Record<string, unknown>): Promise<string> {
    const handler = handlers[action];
    if (!handler) throw new CommandError(`Acción no soportada: ${action}`);

    logger.info({ action, params }, 'Ejecutando comando');
    try {
      return await handler(params);
    } catch (err) {
      if (err instanceof CommandError) throw err;
      const msg = err instanceof Error ? err.message : String(err);
      logger.error({ err, action }, 'Error ejecutando comando');
      throw new CommandError(`Error al ejecutar "${action}": ${msg}`);
    }
  },

  getSupportedActions(): ActionName[] {
    return Object.keys(handlers) as ActionName[];
  },
};
