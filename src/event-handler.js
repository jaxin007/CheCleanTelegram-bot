import Composer from 'telegraf/composer.js';
import { apiService } from './dependencies.js';

export const botUseHandler = (ctx) => {
	if (ctx.update.message.text === '/create') {
		ctx.replyWithMarkdown(
			`Щоб розпочати роботу, пришли мені опис, фото та локацію місця події. Роби все послідовно, тобто спочатку опис, потім фото, а в кінці локація.\n\n*Чекаю від тебе опис місця.*`
		);
		return ctx.wizard.selectStep(2);
	} else {
		ctx.replyWithMarkdown(
			`Привіт, мене звати CheClean. Я створений для допомоги нашому місту 😊 \nДля *початку* роботи натисни на команду /create \nДля *допомоги* використай команду /help \nДля *відміни* натисни на команду /cancel`
		);
		return ctx.wizard.next();
	}
};

export const createCaseHandler = new Composer();
createCaseHandler.command('create', (ctx) => {
	ctx.replyWithMarkdown(
		`Щоб розпочати роботу, пришли мені опис, фото та локацію місця події. Роби все послідовно, тобто спочатку опис, потім фото, а в кінці локація.\n\n*Чекаю від тебе опис місця.*`
	);
	return ctx.wizard.next();
});

export const textHandler = new Composer();
textHandler.on('text', (ctx) => {
	ctx.wizard.state.data = {};
	const details = ctx.update.message.text;
	ctx.wizard.state.data.details = details;
	ctx.reply('Круто! Тепер пришли мені фото місця.');
	return ctx.wizard.next();
});
textHandler.use((ctx) => ctx.reply('Будь-ласка, пришли мені опис того, що ти бачиш.'));

export const photoHandler = new Composer();
photoHandler.on('photo', async (ctx) => {
	const photosList = ctx.update.message.photo;
	const lastPhoto = photosList.length - 1;
	const biggestPhoto = photosList[lastPhoto];

	const url = await ctx.telegram.getFileLink(biggestPhoto);

	ctx.wizard.state.data.image_url = url;

	ctx.reply('Майже готово! Тепер передай мені свою локацію.', {
		reply_markup: {
			one_time_keyboard: true,
			keyboard: [ [ { text: 'Передати локацію', request_location: true } ] ]
		}
	});
	return ctx.wizard.next();
});
photoHandler.use((ctx) => ctx.reply('Будь-ласка, пришли мені спочатку фото.'));

export const locationHandler = new Composer();
locationHandler.on('location', async (ctx) => {
	const location = ctx.update.message.location;
	const createdCase = ctx.wizard.state.data;
	ctx.wizard.state.data.location = location;

	await ctx.replyWithPhoto(
		{ url: createdCase.image_url },
		{
			caption: `${createdCase.details} \n\n\n\nПідтвердіть коректність свого запиту`,
			reply_markup: {
				inline_keyboard: [
					[
						{ text: 'Підтвердити', callback_data: 'approved' },
						{ text: 'Відхилити', callback_data: 'declined' }
					]
				]
			}
		}
	);
	return ctx.wizard.next();
});
locationHandler.use((ctx) => ctx.reply('Будь-ласка, пришли мені свою локацію.'));

export const validateHandler = new Composer();
validateHandler.action('approved', (ctx) => {
	const createdCase = ctx.wizard.state.data;
	apiService
		.sendCase(createdCase)
		.then(() => ctx.reply('Дякуємо за вашу підтримку! Ваш запит було відправлено на обробку.'))
		.catch(() => ctx.reply('Щось пішло не так :)'));
	ctx.editMessageReplyMarkup({});
	return ctx.scene.leave();
});
validateHandler.action('declined', (ctx) => {
	ctx.editMessageReplyMarkup({});
	ctx.reply('Спробуйте ще раз :)');
	return ctx.scene.leave();
});
