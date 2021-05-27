import RedisSession from 'telegraf-session-redis';
import { envConfig } from './envConfig';

export const session = new RedisSession({
  store: {
    host: envConfig.TELEGRAM_SESSION_HOST || 'localhost',
    port: envConfig.TELEGRAM_SESSION_PORT || 6379,
  },
  ttl: 100,
  getSessionKey: (ctx) => `${ctx.from.id}:${ctx.chat.id}`,
});
