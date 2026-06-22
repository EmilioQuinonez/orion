import { Request, Response, NextFunction } from 'express';
import { settingsModel } from '../model/settingsModel.js';
import { DEFAULT_USER_ID } from '../util/constants.js';
import { ValidationError } from '../util/errors.js';

export const settingsController = {
  async getSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsModel.getOrCreate(DEFAULT_USER_ID);
      res.json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  },

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { language, volume, timeout } = req.body as {
        language?: string;
        volume?: number;
        timeout?: number;
      };

      const updates: Record<string, unknown> = {};

      if (language !== undefined) {
        if (!['es', 'en'].includes(language)) {
          throw new ValidationError('Idioma debe ser "es" o "en"');
        }
        updates['language'] = language;
      }

      if (volume !== undefined) {
        if (typeof volume !== 'number' || volume < 0 || volume > 100) {
          throw new ValidationError('Volumen debe ser entre 0 y 100');
        }
        updates['volume'] = volume;
      }

      if (timeout !== undefined) {
        if (typeof timeout !== 'number' || timeout < 5 || timeout > 300) {
          throw new ValidationError('Timeout debe ser entre 5 y 300 segundos');
        }
        updates['timeout'] = timeout;
      }

      if (Object.keys(updates).length === 0) {
        throw new ValidationError('Se requiere al menos un campo a actualizar');
      }

      const settings = await settingsModel.update(DEFAULT_USER_ID, updates);
      res.json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  },
};
