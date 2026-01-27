import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  DB_HOST: requireEnv('DB_HOST'),
  DB_USER: requireEnv('DB_USER'),
  DB_PASSWORD: requireEnv('DB_PASSWORD'),
  DB_NAME: requireEnv('DB_NAME'),
  DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  JWT_SECRET: requireEnv('JWT_SECRET'),
};
