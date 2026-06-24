import { Request, Response, NextFunction } from 'express';
import { messageModel } from '../model/messageModel.js';
import { DEFAULT_USER_ID, HISTORY_PAGE_SIZE } from '../util/constants.js';
import { NotFoundError, ValidationError } from '../util/errors.js';

export const historyController = {
  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(String(req.query['page'] ?? '1'), 10);
      const limit = parseInt(String(req.query['limit'] ?? String(HISTORY_PAGE_SIZE)), 10);

      const { messages, total } = await messageModel.findByUser(DEFAULT_USER_ID, page, limit);

      res.json({
        success: true,
        data: {
          messages,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) throw new ValidationError('ID de mensaje requerido');

      const message = await messageModel.findById(id);
      if (!message) throw new NotFoundError('Mensaje');

      await messageModel.delete(id);
      res.json({ success: true, message: 'Mensaje eliminado' });
    } catch (err) {
      next(err);
    }
  },

  async clearHistory(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await messageModel.deleteAllByUser(DEFAULT_USER_ID);
      res.json({ success: true, message: 'Historial limpiado' });
    } catch (err) {
      next(err);
    }
  },
};
