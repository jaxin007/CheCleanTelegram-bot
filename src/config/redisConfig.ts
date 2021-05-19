import RedisSession from 'telegraf-session-redis';

export const session = new RedisSession({
  store: {
    host: process.env.TELEGRAM_SESSION_HOST || 'localhost',
    port: process.env.TELEGRAM_SESSION_PORT || 6379,
  },
  ttl: 100,
  getSessionKey: (ctx) => `${ctx.from.id}:${ctx.chat.id}`,
});
