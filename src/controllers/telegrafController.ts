import { TelegrafComposer } from '../types';
import { botTexts, Keyboards } from '../constants';
import { WizardStateInterface } from '../interfaces';

export default class TelegrafController {
  static async botUse(ctx: TelegrafComposer): Promise<WizardStateInterface> {
    if (ctx.update.callback_query) {
      await ctx.editMessageReplyMarkup({
        inline_keyboard: [],
      });
    }

    if (ctx.update?.message?.text === '/create' || ctx.update?.callback_query?.data === 'create') {
      await ctx.replyWithMarkdown(botTexts.createCaseText);

      return ctx.wizard.selectStep(2);
    }

    const greetingKeyboard = await Keyboards.greetingKeyboard();

    await ctx.replyWithMarkdown(
      botTexts.greetingsText,
      {
        reply_markup: greetingKeyboard,
      },
    );

    return ctx.wizard.next();
  }
}
