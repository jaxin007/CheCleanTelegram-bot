const Composer = require('telegraf/composer');
const { getSafe } = require('../utils/get-safe');
const { botTexts } = require('../bot-text');

class MessageHandlerService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async botUseHandler(ctx) {
    if (ctx.update.callback_query) {
      await ctx.editMessageReplyMarkup({});
    }

    if (getSafe(() => ctx.update.message.text === '/create') || getSafe(() => ctx.update.callback_query.data === 'create')) {
      await ctx.replyWithMarkdown(botTexts.createCaseText);
      return ctx.wizard.selectStep(2);
    }

    await ctx.replyWithMarkdown(
      botTexts.greetingsText,
      {
        reply_markup: {
          one_time_keyboard: true,
          inline_keyboard: [
            [
              { text: botTexts.helpButtonText, callback_data: 'help' },
              { text: botTexts.declineButtonText, callback_data: 'cancel' },
            ],
            [{ text: botTexts.createCaseButtonText, callback_data: 'create' }],
          ],
        },
      },
    );
    return ctx.wizard.next();
  }

  createCaseComposer() {
    const createCaseHandler = new Composer();
    createCaseHandler.command('create', (ctx) => this.createCase(ctx));
    createCaseHandler.action('create', (ctx) => this.createCase(ctx));

    return createCaseHandler;
  }

  createCase(ctx) {
    ctx.replyWithMarkdown(botTexts.createCaseText);
    return ctx.wizard.next();
  }

  textComposer() {
    const textHandler = new Composer();
    textHandler.on('text', (ctx) => {
      ctx.wizard.state.data = {};
      const details = ctx.update.message.text;
      ctx.wizard.state.data.details = details;
      ctx.reply(botTexts.photoRequestText);
      return ctx.wizard.next();
    });
    textHandler.use((ctx) => ctx.reply(botTexts.forceTextRequest));

    return textHandler;
  }

  photoComposer() {
    const photoHandler = new Composer();
    photoHandler.on('photo', async (ctx) => {
      const photosList = ctx.update.message.photo;
      const lastPhoto = photosList.length - 1;
      const biggestPhoto = photosList[lastPhoto];

      const url = await ctx.telegram.getFileLink(biggestPhoto);

      ctx.wizard.state.data.image_url = url;
      ctx.wizard.state.data.file_id = biggestPhoto.file_unique_id;

      ctx.reply(botTexts.locationRequestText, {
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [[{ text: botTexts.locationRequestButtonText, request_location: true }]],
        },
      });
      return ctx.wizard.next();
    });
    photoHandler.use((ctx) => ctx.reply(botTexts.forcePhotoRequestText));

    return photoHandler;
  }

  locationComposer() {
    const locationHandler = new Composer();
    locationHandler.on('location', async (ctx) => {
      const { location } = ctx.update.message;
      const createdCase = ctx.wizard.state.data;
      ctx.wizard.state.data.location = location;

      await ctx.telegram.sendChatAction(ctx.update.message.chat.id, 'upload_document');
      await ctx.reply('Збираємо всі ваші дані до купи :)', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      await ctx.replyWithPhoto(
        { url: createdCase.image_url },
        {
          caption: `${createdCase.details} \n\n\n\n${botTexts.caseVerificationText}`,
          reply_markup: {
            inline_keyboard: [
              [
                { text: botTexts.caseApproveButtonText, callback_data: 'approved' },
                { text: botTexts.caseDeclineButtonText, callback_data: 'declined' },
              ],
            ],
          },
        },
      );
      return ctx.wizard.next();
    });
    locationHandler.use((ctx) => ctx.reply(botTexts.forceLocationRequestText));

    return locationHandler;
  }

  validateCaseComposer() {
    const validateHandler = new Composer();
    validateHandler.action('approved', async (ctx) => {
      const telegramPhotoUrl = ctx.wizard.state.data.image_url;
      try {
        const fileUniqueName = ctx.wizard.state.data.file_id;
        const fileName = `${fileUniqueName}.jpeg`;
        const filePublicUrl = `https://storage.googleapis.com/telegram-photos-test-checlean/${fileName}`;

        await this.apiService.uploadFileByUrl(telegramPhotoUrl, fileName);
        ctx.wizard.state.data.image_url = filePublicUrl;
      } catch (err) {
        console.error(err);
      }

      delete ctx.wizard.state.data.file_id; // we don't need file id anymore, so we delete it

      const createdCase = ctx.wizard.state.data;
      ctx.telegram.sendChatAction(ctx.update.callback_query.message.chat.id, 'upload_document');

      const token = await this.apiService.loginBot().catch((err) => console.error(err));
      await this.apiService
        .sendCase(createdCase, token)
        .then((response) => ctx.reply(`${botTexts.caseApprovedText} ${botTexts.caseUrl}${response}`))
        .catch((err) => {
          console.error(err.message);
          return ctx.reply(botTexts.caseErrorText);
        });

      await ctx.editMessageReplyMarkup({});

      await ctx.reply(`
        Щоб створити нове звернення, натисни на кнопку.
      `, {
        reply_markup: {
          inline_keyboard: [[
            { text: 'Почати роботу', callback_data: 'create' },
          ],
          ],
        },
      });

      return ctx.scene.leave();
    });
    validateHandler.action('declined', (ctx) => {
      ctx.editMessageReplyMarkup({});
      ctx.reply(botTexts.caseDeclinedText);
      return ctx.scene.leave();
    });

    return validateHandler;
  }

  cancelHandler(ctx) {
    if (ctx.update.callback_query) {
      ctx.editMessageReplyMarkup({});
    }

    ctx.reply(botTexts.cancelButtonAnswerText);
    ctx.session = null;
    ctx.scene.leave('case-creator');
  }

  helpHandler(ctx) {
    ctx.replyWithMarkdown(botTexts.helpButtonAnswerText);
  }
}

module.exports = {
  MessageHandlerService,
};
