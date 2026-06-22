import { isAllowedAction, isSafeApp } from '../policy/commandWhitelist.js';
import { DANGEROUS_PATTERNS } from '../util/constants.js';

export type IntentPayload = {
  action: string;
  params: Record<string, unknown>;
};

export const securityService = {
  isCommandAllowed(intent: IntentPayload): boolean {
    if (!isAllowedAction(intent.action)) return false;

    if (intent.action === 'open_app') {
      const app = intent.params['app'];
      if (typeof app !== 'string' || !isSafeApp(app)) return false;
    }

    return true;
  },

  containsDangerousPattern(text: string): boolean {
    return DANGEROUS_PATTERNS.some((pattern) => pattern.test(text));
  },

  sanitizeUserInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .trim()
      .slice(0, 500);
  },
};
