const Telegraf = require('telegraf');
const RedisSession = require('telegraf-session-redis');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard/index');
require('dotenv').config();
const { messageHandler } = require('./services/index');
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
  messageHandler.botUseHandler,
  messageHandler.createCaseComposer(),
  messageHandler.textComposer(),
  messageHandler.photoComposer(),
  messageHandler.locationComposer(),
  messageHandler.validateCaseComposer(),
);

const bot = new Telegraf(token);
const stage = new Stage([caseCreator], { default: 'case-creator' });

function helpHandler(ctx) {
  ctx.replyWithMarkdown(botTexts.helpButtonAnswerText);
}

function cancelHandler(ctx) {
  if (ctx.update.callback_query) {
    ctx.editMessageReplyMarkup({});
  }

  ctx.reply(botTexts.cancelButtonAnswerText);
  ctx.scene.leave('case-creator');
  ctx.session = null;
}

stage.help(helpHandler);
stage.action('help', helpHandler);

stage.command('contacts', (ctx) => {
  ctx.reply(botTexts.contactsButtonAnswerText);
});

stage.command('cancel', cancelHandler);
stage.action('cancel', cancelHandler);

bot.use(session);
bot.use(stage.middleware());
bot.launch();
