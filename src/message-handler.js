import Telegraf from 'telegraf';
import session from 'telegraf/session.js';
import Stage from 'telegraf/stage.js';
import WizardScene from 'telegraf/scenes/wizard/index.js';
import dotenv from 'dotenv';
import {
	botUseHandler,
	createCaseHandler,
	textHandler,
	photoHandler,
	locationHandler,
	validateHandler
} from './event-handler.js';

dotenv.config();
const token = process.env.BOT_TOKEN;

const caseCreator = new WizardScene(
	'case-creator',
	botUseHandler,
	createCaseHandler,
	textHandler,
	photoHandler,
	locationHandler,
	validateHandler
);

const bot = new Telegraf(token);
const stage = new Stage([ caseCreator ], { default: 'case-creator' });

stage.command('cancel', (ctx) => {
	ctx.reply('Спробуємо в інший раз!');
	ctx.scene.leave('case-creator');
});

stage.help((ctx) =>
	ctx.replyWithMarkdown(
		`Для *початку* роботи натисни на команду /create \nДля *допомоги* використай команду /help \nДля *відміни* натисни на команду /cancel`
	)
);

bot.use(session());
bot.use(stage.middleware());
bot.launch();
