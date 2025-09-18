// utils/env.ts
function getEnvVar<T extends string>(key: string, fallback?: T, allowedValues?: readonly T[]): T {
  const value = process.env[key] ?? fallback;

  if (value === undefined) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }

  if (allowedValues && !allowedValues.includes(value as T)) {
    throw new Error(`❌ Invalid value for ${key}: "${value}". Allowed values: ${allowedValues.join(', ')}`);
  }

  return value as T;
}

// config/env.ts
type Environment = 'development' | 'production' | 'test';

export class Env {
  // Ambiente
  static readonly NODE_ENV: Environment = getEnvVar('NODE_ENV', 'development', ['development', 'production', 'test']);

  // Dominio base
  static readonly BASE_DOMAIN = getEnvVar('BASE_DOMAIN', 'http://localhost:3000');
  static readonly INVITE_URL = getEnvVar('INVITE_URL', 'http://localhost:3000');
  static readonly RESEND_API_KEY = getEnvVar('RESEND_API_KEY');
}
