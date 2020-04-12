import Telegraf from 'telegraf';
import session from 'telegraf/session.js';
import Stage from 'telegraf/stage.js';
import Markup from 'telegraf/markup.js';
import WizardScene from 'telegraf/scenes/wizard/index.js';
import dotenv from 'dotenv';
import { createCaseHandler, textHandler, photoHandler, locationHandler } from './event-handler.js';

dotenv.config();
// replace the value below with the Telegram token you receive from @BotFather

const token = process.env.TOKEN;

const greeterText = `Привіт, мене звати CheClean. Я створений щоб допомогти нашому місту стати краще 😊 \n*Команди бота:* \n/create - початок роботи. \n/help - допомога. \n/contacts - зв'язок з моїм розробником.`;

const caseCreator = new WizardScene(
	'case-creator',
	(ctx) => {
		ctx.replyWithMarkdown(greeterText);
		return ctx.wizard.next();
	},
	createCaseHandler,
	textHandler,
	photoHandler,
	locationHandler
);

const bot = new Telegraf(token);
const stage = new Stage([ caseCreator ], { default: 'case-creator' });
// bot.on('animation', (ctx) => ctx.reply(Markup.button('text')));
bot.use(session());
bot.use(stage.middleware());
bot.launch();
