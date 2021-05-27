import { Context } from 'telegraf';
import { injectable, inject } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

import {
  botTexts,
  Keyboards,
  TYPES,
} from '../constants';
import {
  ApiServiceInterface,
  GeocoderServiceInterface,
  MyContextInterface,
  TelegrafHelperInterface,
  WizardStateInterface,
} from '../interfaces';

@injectable()
export class TelegrafHelper implements TelegrafHelperInterface {
  @inject(TYPES.ApiService)
  private readonly apiService: ApiServiceInterface;

  @inject(TYPES.GeocoderService)
  private readonly geocoderService: GeocoderServiceInterface;

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

    ctx.wizard.state.url = url.href;

    const locationRequestKeyboard = await Keyboards.photoComposerLocationRequestKeyboard();

    await ctx.reply(botTexts.locationRequestText, {
      reply_markup: locationRequestKeyboard,
    });

    return ctx.wizard.next();
  }

  async locationComposerOnLocation(ctx: MyContextInterface): Promise<WizardStateInterface> {
    const { url, details } = ctx.wizard.state;

    const { latitude, longitude } = ctx.update.message.location;

    const isCoordsValid = await this.geocoderService.isCoordsValid({
      latitude,
      longitude,
    });

    if (!isCoordsValid) {
      await ctx.reply(botTexts.invalidLocationText);

      return ctx.wizard.selectStep(4);
    }

    ctx.wizard.state.coordinates = {
      latitude,
      longitude,
    };

    await ctx.telegram.sendChatAction(ctx.update.message.chat.id, 'upload_document');

    await ctx.reply(botTexts.readyCasePreparation, {
      reply_markup: {
        remove_keyboard: true,
      },
    });

    const approveCaseKeyboard = await Keyboards.locationComposerCaseApproveKeyboard();

    await ctx.replyWithPhoto(
      {
        url,
      },
      {
        caption: `${details} \n\n\n\n${botTexts.caseVerificationText}`,
        reply_markup: approveCaseKeyboard,
      },
    );

    return ctx.wizard.next();
  }

  async validateCaseComposerOnApproved(ctx: MyContextInterface): Promise<any> {
    try {
      const { url } = ctx.wizard.state;

      const uniqueFileName = uuidv4();

      const fileName = `${uniqueFileName}.jpeg`;

      const filePublicUrl = `https://storage.googleapis.com/telegram-photos-test-checlean/${fileName}`;

      await this.apiService.uploadFileByUrl(url, fileName);

      ctx.wizard.state.url = filePublicUrl;

      await ctx.telegram.sendChatAction(ctx.update.callback_query.message.chat.id, 'upload_document');

      const token = await this.apiService.loginBot();

      const res = await this.apiService.sendCase(ctx.wizard.state, token);

      await ctx.reply(`${botTexts.caseApprovedText} ${botTexts.caseUrl}${res}`);

      await ctx.editMessageReplyMarkup({
        inline_keyboard: [],
      });

      const recreateCaseKeyboard = await Keyboards.recreateCaseKeyboard();

      await ctx.reply(botTexts.recreateCaseText, {
        reply_markup: recreateCaseKeyboard,
      });

      return ctx.scene.leave();
    } catch (err) {
      return ctx.reply(botTexts.caseErrorText);
    }
  }
}
