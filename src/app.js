const Telegraf = require('telegraf');
const RedisSession = require('telegraf-session-redis');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard/index');
require('dotenv').config();
const { messageHandlerService } = require('./services');
const { botTexts } = require('./bot-text');

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
  messageHandlerService.botUseHandler,
  messageHandlerService.createCaseComposer(),
  messageHandlerService.textComposer(),
  messageHandlerService.photoComposer(),
  messageHandlerService.locationComposer(),
  messageHandlerService.validateCaseComposer(),
);

const bot = new Telegraf(token);
const stage = new Stage([caseCreator], { default: 'case-creator' });

stage.help(messageHandlerService.helpHandler);
stage.action('help', messageHandlerService.helpHandler);

stage.command('contacts', (ctx) => {
  ctx.reply(botTexts.contactsButtonAnswerText);
});

stage.command('cancel', messageHandlerService.cancelHandler);
stage.action('cancel', messageHandlerService.cancelHandler);

bot.use(session);
bot.use(stage.middleware());
bot.launch();
