import 'dotenv/config';

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Variable de entorno requerida: ${key}`);
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function optionalNumber(key: string, fallback: number): number {
  const val = process.env[key];
  if (!val) return fallback;
  const num = parseInt(val, 10);
  if (isNaN(num)) throw new Error(`${key} debe ser un número`);
  return num;
}

export const config = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: optionalNumber('PORT', 3000),
  corsOrigin: optional('CORS_ORIGIN', 'http://localhost:3000'),
  logLevel: optional('LOG_LEVEL', 'info'),

  databaseUrl: required('DATABASE_URL'),

  ollamaUrl: optional('OLLAMA_URL', 'http://localhost:11434'),
  ollamaModel: optional('OLLAMA_MODEL', 'qwen3.5:9b'),
  ollamaTimeout: optionalNumber('OLLAMA_TIMEOUT', 30000),

  enableCommandValidation: optional('ENABLE_COMMAND_VALIDATION', 'true') === 'true',
  blockDangerousCommands: optional('BLOCK_DANGEROUS_COMMANDS', 'true') === 'true',

  isTest: optional('NODE_ENV', 'development') === 'test',
  isDev: optional('NODE_ENV', 'development') === 'development',
  isProd: optional('NODE_ENV', 'development') === 'production',
} as const;
