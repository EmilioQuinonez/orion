import axios from 'axios';
import { config } from '../config.js';
import { extractJsonFromText } from '../util/helpers.js';
import { LLMError } from '../util/errors.js';
import { logger } from '../util/logger.js';
import { INTENT_DETECTION_PROMPT } from '../util/constants.js';
import type { IntentPayload } from './securityService.js';

type OllamaMessage = { role: 'system' | 'user' | 'assistant'; content: string };

async function chat(messages: OllamaMessage[]): Promise<string> {
  try {
    const response = await axios.post(
      `${config.ollamaUrl}/api/chat`,
      {
        model: config.ollamaModel,
        messages,
        stream: false,
        options: { temperature: 0.1 },
      },
      { timeout: config.ollamaTimeout }
    );
    return (response.data as { message: { content: string } }).message.content.trim();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ err }, 'Error llamando a Ollama');
    throw new LLMError(`Ollama no disponible: ${msg}`);
  }
}

export const llmService = {
  async detectIntent(transcript: string): Promise<IntentPayload> {
    const raw = await chat([
      { role: 'system', content: INTENT_DETECTION_PROMPT },
      { role: 'user', content: transcript },
    ]);

    const parsed = extractJsonFromText(raw);
    if (
      !parsed ||
      typeof parsed['action'] !== 'string' ||
      typeof parsed['params'] !== 'object'
    ) {
      logger.warn({ raw }, 'Respuesta de intent inválida, usando general_question');
      return { action: 'general_question', params: { question: transcript } };
    }

    return {
      action: parsed['action'] as string,
      params: (parsed['params'] as Record<string, unknown>) ?? {},
    };
  },

  async generateResponse(
    transcript: string,
    commandResult: string | null,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<string> {
    const userMessage = commandResult
      ? `El usuario dijo: "${transcript}"\nResultado de la acción: ${commandResult}\nResponde de forma natural y concisa en español.`
      : transcript;

    return chat([
      {
        role: 'system',
        content:
          'Eres Orión, un asistente de voz personal inteligente y amigable. ' +
          'Responde siempre en español de forma clara, concisa y conversacional. ' +
          'Recuerda el contexto de la conversación y responde de forma coherente. ' +
          'Cuando el usuario ejecute un comando, confirma brevemente la acción realizada.',
      },
      ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: userMessage },
    ]);
  },

  async healthCheck(): Promise<boolean> {
    try {
      await axios.get(`${config.ollamaUrl}/api/tags`, { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  },
};
