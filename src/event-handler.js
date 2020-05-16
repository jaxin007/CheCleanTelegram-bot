const Composer = require('telegraf/composer');
const { apiService } = require('./dependencies');

const createCaseText = 'Щоб розпочати роботу, пришли мені опис, фото та локацію місця події. Роби все послідовно, тобто спочатку опис, потім фото, а в кінці локація.\n\n*Чекаю від тебе опис того, що ти бачиш.*';

const botUseHandler = (ctx) => {
  if (ctx.update.message.text === '/create' && ctx.update.callback_query.data === 'create') {
    ctx.replyWithMarkdown(createCaseText);
    return ctx.wizard.selectStep(2);
  }
  ctx.replyWithMarkdown(
    'Привіт, мене звати CheClean. Я створений для допомоги нашому місту 😊 \nДля *початку* роботи натисни на кнопку внизу, або використай команду /create.',
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Допомога', callback_data: 'help' },
            { text: 'Відмінити', callback_data: 'cancel' },
          ],
          [{ text: 'Почати роботу', callback_data: 'create' }],
        ],
      },
    },
  );
  return ctx.wizard.next();
};

function createCase(ctx) {
  ctx.editMessageReplyMarkup({});
  ctx.replyWithMarkdown(createCaseText);
  return ctx.wizard.next();
}

const createCaseHandler = new Composer();
createCaseHandler.command('create', createCase);
createCaseHandler.action('create', createCase);

const textHandler = new Composer();
textHandler.on('text', (ctx) => {
  ctx.wizard.state.data = {};
  const details = ctx.update.message.text;
  ctx.wizard.state.data.details = details;
  ctx.reply('Круто! Тепер пришли мені фото місця.');
  return ctx.wizard.next();
});
textHandler.use((ctx) => ctx.reply('Будь-ласка, пришли мені опис того, що ти бачиш.'));

const photoHandler = new Composer();
photoHandler.on('photo', async (ctx) => {
  const photosList = ctx.update.message.photo;
  const lastPhoto = photosList.length - 1;
  const biggestPhoto = photosList[lastPhoto];

  const url = await ctx.telegram.getFileLink(biggestPhoto);

  ctx.wizard.state.data.image_url = url;

  ctx.reply('Майже готово! Тепер передай мені свою локацію.', {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [[{ text: 'Передати локацію', request_location: true }]],
    },
  });
  return ctx.wizard.next();
});
photoHandler.use((ctx) => ctx.reply('Будь-ласка, пришли мені спочатку фото.'));

const locationHandler = new Composer();
locationHandler.on('location', async (ctx) => {
  const { location } = ctx.update.message;
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
            { text: 'Відхилити', callback_data: 'declined' },
          ],
        ],
      },
    },
  );
  return ctx.wizard.next();
});
locationHandler.use((ctx) => ctx.reply('Будь-ласка, пришли мені свою локацію.'));

const validateHandler = new Composer();
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

module.exports = {
  botUseHandler,
  createCaseHandler,
  textHandler,
  photoHandler,
  locationHandler,
  validateHandler,
};
