import { EnvConfigInterface } from '../interfaces';

export const envConfig: EnvConfigInterface = {
  API_URL: process.env.API_URL || 'http://localhost',

  BOT_TOKEN: process.env.BOT_TOKEN || 'token',

  GOOGLE_BUCKET_NAME: process.env.GOOGLE_BUCKET_NAME || 'google bucket name',
  GOOGLE_GOOGLE_PROJECT_ID: process.env.GOOGLE_GOOGLE_PROJECT_ID || 'google project id',
  GOOGLE_PROJECT_ACCOUNT_FILE: process.env.GOOGLE_PROJECT_ACCOUNT_FILE || 'google project account file',

  JWT_USERNAME: process.env.JWT_USERNAME || 'username',
  JWT_PASSWORD: process.env.JWT_PASSWORD || 'secret',

  TELEGRAM_SESSION_HOST: process.env.TELEGRAM_SESSION_HOST || 'http://localhost',
  TELEGRAM_SESSION_PORT: Number.parseInt(process.env.TELEGRAM_SESSION_PORT || '6379', 10),
};
