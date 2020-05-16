const Telegraf = require('telegraf');
const RedisSession = require('telegraf-session-redis');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard/index');
require('dotenv').config();
const {
  botUseHandler,
  createCaseHandler,
  textHandler,
  photoHandler,
  locationHandler,
  validateHandler,
} = require('./src/event-handler');

const token = process.env.BOT_TOKEN;

const session = new RedisSession({
  store: {
    host: process.env.TELEGRAM_SESSION_HOST || 'localhost',
    port: process.env.TELEGRAM_SESSION_PORT || 6379,
  },
  ttl: 100,
  getSessionKey: (ctx) => {
    const key = `${ctx.from.id}:${ctx.chat.id}`;
    return key;
  },
});

const caseCreator = new WizardScene(
  'case-creator',
  botUseHandler,
  createCaseHandler,
  textHandler,
  photoHandler,
  locationHandler,
  validateHandler,
);

const bot = new Telegraf(token);
const stage = new Stage([caseCreator], { default: 'case-creator' });

function helpHandler(ctx) {
  ctx.replyWithMarkdown(
    'Для *початку* роботи: /create \nДля *допомоги*: /help \nДля *відміни*: /cancel',
  );
}

function cancelHandler(ctx) {
  if (ctx.update.callback_query) {
    ctx.editMessageReplyMarkup({});
  }

  ctx.reply('Спробуємо в інший раз!');
  ctx.scene.leave('case-creator');
  ctx.session = null;
}

stage.help(helpHandler);
stage.action('help', helpHandler);

stage.command('contacts', (ctx) => {
  ctx.reply('За всіма питаннями щодо роботи бота звертайтесь сюди: @jaxin007');
});

stage.command('cancel', cancelHandler);
stage.action('cancel', cancelHandler);

bot.use(session);
bot.use(stage.middleware());
bot.launch();
