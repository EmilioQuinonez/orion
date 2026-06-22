import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../util/errors.js';

export function validatePagination(req: Request, _res: Response, next: NextFunction): void {
  const { page, limit } = req.query;

  if (page !== undefined && (isNaN(Number(page)) || Number(page) < 1)) {
    return next(new ValidationError('El parámetro "page" debe ser un número positivo'));
  }

  if (limit !== undefined && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    return next(new ValidationError('El parámetro "limit" debe ser entre 1 y 100'));
  }

  next();
}
