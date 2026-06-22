import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function execSafe(cmd: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync(cmd, args, { timeout: 10_000 });
  return stdout.trim();
}

export function sanitizeParam(value: string): string {
  return value.replace(/[;&|`$\\]/g, '').trim();
}

export function formatResponse(data: unknown, message?: string) {
  return { success: true, message, data };
}

export function formatError(message: string, code?: string) {
  return { success: false, error: { message, code } };
}

export function extractJsonFromText(text: string): Record<string, unknown> | null {
  const cleaned = text.trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
