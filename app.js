import Telegraf from 'telegraf';
import RedisSession from 'telegraf-session-redis';
import Stage from 'telegraf/stage.js';
import WizardScene from 'telegraf/scenes/wizard/index.js';
import dotenv from 'dotenv';
import {
    botUseHandler,
    createCaseHandler,
    textHandler,
    photoHandler,
    locationHandler,
    validateHandler,
} from './src/event-handler.js';

dotenv.config();
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

stage.help((ctx) => {
    ctx.replyWithMarkdown(
        `Для *початку* роботи: /create \nДля *допомоги*: /help \nДля *відміни*: /cancel`,
    );
});

stage.action('help', (ctx) => {
    ctx.replyWithMarkdown(
        `Для *початку* роботи: /create \nДля *допомоги*: /help \nДля *відміни*: /cancel`,
    );
});

stage.command('contacts', (ctx) => {
    ctx.reply('За всіма питаннями щодо роботи бота звертайтесь сюди: @jaxin007');
});

stage.command('cancel', (ctx) => {
    ctx.reply('Спробуємо в інший раз!');
    ctx.scene.leave('case-creator');
    ctx.session = null;
});

stage.action('cancel', (ctx) => {
    ctx.editMessageReplyMarkup({});
    ctx.reply('Спробуємо в інший раз!');
    ctx.scene.leave('case-creator');
    ctx.session = null;
});

bot.use(session);
bot.use(stage.middleware());
bot.launch();
