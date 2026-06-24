import 'dotenv/config';
import { app } from './app.js';
import { config } from './config.js';
import { logger } from './util/logger.js';
import { prisma } from './prisma.js';

async function start(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Base de datos conectada');

    app.listen(config.port, () => {
      logger.info(`Tessia corriendo en http://localhost:${config.port}`);
      logger.info(`Ollama: ${config.ollamaUrl} | Modelo: ${config.ollamaModel}`);
      logger.info('Endpoints: POST /api/voice/process | GET /api/health');
    });
  } catch (err) {
    logger.error({ err }, 'Error al iniciar el servidor');
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

start();
