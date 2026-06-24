import { Request, Response } from 'express';
import { llmService } from '../service/llmService.js';
import { prisma } from '../prisma.js';
import { commandService } from '../service/commandService.js';

export const healthController = {
  async check(_req: Request, res: Response): Promise<void> {
    const [ollamaOk, dbOk] = await Promise.all([
      llmService.healthCheck(),
      prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
    ]);

    const status = ollamaOk && dbOk ? 'ok' : 'degraded';

    res.status(status === 'ok' ? 200 : 503).json({
      status,
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      services: {
        database: dbOk ? 'ok' : 'error',
        ollama: ollamaOk ? 'ok' : 'error',
        supportedActions: commandService.getSupportedActions().length,
      },
    });
  },
};
