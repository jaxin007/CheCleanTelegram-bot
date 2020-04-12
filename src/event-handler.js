import Composer from 'telegraf/composer.js';
import { takeImageFromUrl } from './image-receiver.js';

export const createCaseHandler = new Composer();
createCaseHandler.command('create', (ctx) => {
	ctx.reply(
		'Щоб розпочати роботу, пришли мені опис, фото та локацію місця події. Роби все послідовно, тобто спочатку опис, потім фото, а в кінці локація.'
	);
	return ctx.wizard.next();
});

export const textHandler = new Composer();
textHandler.on('text', (ctx) => {
	const description = ctx.update.message.text;
	console.log(description);
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
	const image = await takeImageFromUrl(url);

	ctx.reply('Майже готово! Тепер передай мені свою локацію.');
	return ctx.wizard.next();
});
photoHandler.use((ctx) => ctx.reply('Будь-ласка, пришли мені спочатку фото.'));

export const locationHandler = new Composer();
locationHandler.on('location', (ctx) => {
	ctx.reply('Готово! Дякуємо за вашу небайдужість!');
	return ctx.wizard.leave();
});
locationHandler.use((ctx) => ctx.reply('Будь-ласка, пришли мені свою локацію.'));
