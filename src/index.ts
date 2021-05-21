import 'reflect-metadata';

import { Telegraf } from 'telegraf';

import {
  envConfig,
  session,
  stage,
} from './config';

export const appPromise = async (): Promise<Telegraf> => {
  const bot = new Telegraf(envConfig.BOT_TOKEN);

  await bot
    .use(session)
    .use(stage.middleware())
    .start((ctx) => {
      ctx.reply('Hello, world!');
    })
    .launch();

  return bot;
};
