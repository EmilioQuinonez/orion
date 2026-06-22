export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AudioProcessingError extends AppError {
  constructor(message: string) {
    super(message, 422, 'AUDIO_PROCESSING_ERROR');
    this.name = 'AudioProcessingError';
  }
}

export class CommandError extends AppError {
  constructor(message: string) {
    super(message, 422, 'COMMAND_ERROR');
    this.name = 'CommandError';
  }
}

export class LLMError extends AppError {
  constructor(message: string) {
    super(message, 503, 'LLM_ERROR');
    this.name = 'LLMError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} no encontrado`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}
