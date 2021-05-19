import { Context } from 'telegraf';
import { v4 as uuidv4 } from 'uuid';

import { apiService } from '../services';
import { botTexts, Keyboards } from '../constants';
import { MyContextInterface, WizardStateInterface } from '../interfaces';

export class TelegrafHelper {
  static async helpHandler(ctx: Context): Promise<any> {
    return ctx.replyWithMarkdown(botTexts.helpButtonAnswerText);
  }

  static async cancelCreatingCase(ctx: any): Promise<void> {
    if (ctx.update.callback_query) {
      await ctx.editMessageReplyMarkup({
        inline_keyboard: [],
      });
    }

    await ctx.reply(botTexts.cancelButtonAnswerText);

    return ctx.scene.leave();
  }

  static async createCase(ctx: MyContextInterface): Promise<WizardStateInterface> {
    await ctx.replyWithMarkdown(botTexts.createCaseText);

    return ctx.wizard.next();
  }

  static async textComposerOnText(ctx: MyContextInterface): Promise<WizardStateInterface> {
    ctx.wizard.state.details = ctx.update.message.text;

    await ctx.reply(botTexts.photoRequestText);

    return ctx.wizard.next();
  }

  static async photoComposerOnPhoto(ctx: MyContextInterface): Promise<WizardStateInterface> {
    const photosList = ctx.update.message.photo;

    const lastPhoto = photosList.length - 1;

    const biggestPhoto = photosList[lastPhoto];

    const url = await ctx.telegram.getFileLink(biggestPhoto);

    ctx.wizard.state.image_url = url.href;

    const locationRequestKeyboard = await Keyboards.photoComposerLocationRequestKeyboard();

    await ctx.reply(botTexts.locationRequestText, {
      reply_markup: locationRequestKeyboard,
    });

    return ctx.wizard.next();
  }

  static async locationComposerOnLocation(ctx: MyContextInterface): Promise<WizardStateInterface> {
    const { image_url, details } = ctx.wizard.state;

    ctx.wizard.state.location = ctx.update.message.location;

    await ctx.telegram.sendChatAction(ctx.update.message.chat.id, 'upload_document');

    await ctx.reply('Збираємо всі ваші дані до купи :)', {
      reply_markup: {
        remove_keyboard: true,
      },
    });

    const approveCaseKeyboard = await Keyboards.locationComposerCaseApproveKeyboard();

    await ctx.replyWithPhoto(
      {
        url: image_url,
      },
      {
        caption: `${details} \n\n\n\n${botTexts.caseVerificationText}`,
        reply_markup: approveCaseKeyboard,
      },
    );

    return ctx.wizard.next();
  }

  static async validateCaseComposerOnApproved(ctx: MyContextInterface): Promise<void> {
    const { image_url } = ctx.wizard.state;

    const uniqueFileName = uuidv4();

    const fileName = `${uniqueFileName}.jpeg`;

    const filePublicUrl = `https://storage.googleapis.com/telegram-photos-test-checlean/${fileName}`;

    await apiService.uploadFileByUrl(image_url, fileName);

    ctx.wizard.state.image_url = filePublicUrl;

    await ctx.telegram.sendChatAction(ctx.update.callback_query.message.chat.id, 'upload_document');

    const token = await apiService.loginBot();

    const res = await apiService.sendCase(ctx.wizard.state, token);

    await ctx.reply(`${botTexts.caseApprovedText} ${botTexts.caseUrl}${res}`);

    await ctx.editMessageReplyMarkup({
      inline_keyboard: [],
    });

    const recreateCaseKeyboard = await Keyboards.recreateCaseKeyboard();

    await ctx.reply(botTexts.recreateCaseText, {
      reply_markup: recreateCaseKeyboard,
    });

    return ctx.scene.leave();
  }
}
