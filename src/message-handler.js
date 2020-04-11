process.env.NTBA_FIX_319 = 1;
process.env['NTBA_FIX_350'] = 1;
const { takeImageFromUrl } = require('./image-receiver');
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
	const id = msg.chat.id;

	bot.sendMessage(
		id,
		'Привіт! Мене звати CheClean, і я створений допомогти нашому місту 😊. Щоб розпочати роботу, опиши що саме ти хочеш мені відправити, прикріпи фото, та свою локацію. Дякую!'
	);
});

let description;
let location;

bot.on('text', (msg) => {
	description = msg.text;

	const id = msg.chat.id;
	const messageId = msg.message_id;

	bot.sendMessage(id, 'Підтвердіть коректність свого опису проблеми.', {
		reply_to_message_id: messageId,
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'Так',
						callback_data: 'approved'
					}
				],
				[
					{
						text: 'Ні',
						callback_data: 'denied'
					}
				]
			]
		}
	});
});

bot.on('callback_query', (msg) => {
	console.log(msg);
	const id = msg.from.id;

	msg.data === 'approved'
		? bot.sendMessage(id, 'Тепер передай свою локацію', {
				reply_markup: {
					keyboard: [
						[
							{
								text: 'Передати локацію.',
								request_location: true
							}
						]
					]
				}
			})
		: bot.sendMessage(id, 'Спробуй ще!');
});

bot.on('location', (msg) => {
	const id = msg.chat.id;
	location = msg.location;

	bot.sendMessage(id, 'Майже готово! Тепер передай мені фото місця.', { reply_markup: { remove_keyboard: true } });
});

bot.on('photo', async (msg) => {
	const id = msg.chat.id;
	//
	//
	const fileId = msg.photo[0].file_id;

	const file = await bot.getFile(fileId).catch(() => {
		throw new Error(`error with getFile function!`);
	});

	const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

	const image = await takeImageFromUrl(url);
	// receive image from telegram
	//

	const caseDescription = `Description: ${description}\n-Longitude: ${location.longitude}\n-Latitude: ${location.latitude}`;

	bot.sendPhoto(id, image, { caption: caseDescription }).catch((err) => {
		console.error(err);
	});
});

const invalidInputHandler = (msg) => {
	if (msg.text != '/start') {
		bot.sendMessage(msg.chat.id, 'Please, send me only photo format.');
	}
};
