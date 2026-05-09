/**
 * [ONEWEEKBRIEF_ENV] Tiny env reader. Mirrors the pattern in apps/landing/lib/env.ts.
 */

export class MissingEnvError extends Error {
  constructor(public readonly envName: string) {
    super(`Missing required environment variable: ${envName}`);
    this.name = "MissingEnvError";
  }
}

export function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : undefined;
}

export function requiredEnv(name: string): string {
  const value = optionalEnv(name);
  if (!value) throw new MissingEnvError(name);
  return value;
}
