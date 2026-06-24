import { Request, Response, NextFunction } from 'express';
import { AppError } from '../util/errors.js';
import { logger } from '../util/logger.js';
import { formatError } from '../util/helpers.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn({ code: err.code, message: err.message });
    res.status(err.statusCode).json(formatError(err.message, err.code));
    return;
  }

  logger.error({ err }, 'Error no esperado');
  res.status(500).json(formatError('Error interno del servidor', 'INTERNAL_ERROR'));
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json(formatError('Ruta no encontrada', 'NOT_FOUND'));
}
