import { Composer } from 'telegraf';
import { inject, injectable } from 'inversify';

import TelegrafController from '../controllers/telegrafController';
import { TelegrafHelper } from '../helpers';
import { botTexts, TYPES } from '../constants';
import { TelegrafComposer } from '../types';
import { TelegrafHelperInterface, TelegrafServiceInterface } from '../interfaces';

@injectable()
export class TelegrafService implements TelegrafServiceInterface {
  createComposer: () => Composer<TelegrafComposer>;

  @inject(TYPES.TelegrafHelper) private readonly telegrafHelper: TelegrafHelperInterface;

  constructor() {
    this.createComposer = () => new Composer<TelegrafComposer>();
  }

  botInitHandler(): Composer<TelegrafComposer> {
    const botUseHandler = this.createComposer();

    botUseHandler.use(TelegrafController.botUse);

    return botUseHandler;
  }

  createCaseHandler(): Composer<TelegrafComposer> {
    const createCaseComposer = this.createComposer();

    createCaseComposer.command('create', TelegrafHelper.createCase);

    createCaseComposer.action('create', TelegrafHelper.createCase);

    return createCaseComposer;
  }

  textHandler(): Composer<TelegrafComposer> {
    const textComposer = this.createComposer();

    textComposer.on('text', TelegrafHelper.textComposerOnText);

    textComposer.use((ctx) => ctx.reply(botTexts.forceTextRequest));

    return textComposer;
  }

  photoHandler(): Composer<TelegrafComposer> {
    const photoComposer = this.createComposer();

    photoComposer.on('photo', TelegrafHelper.photoComposerOnPhoto);

    photoComposer.use((ctx) => ctx.reply(botTexts.forcePhotoRequestText));

    return photoComposer;
  }

  locationHandler(): Composer<TelegrafComposer> {
    const locationComposer = this.createComposer();

    locationComposer.on('location', TelegrafHelper.locationComposerOnLocation);

    locationComposer.use((ctx) => ctx.reply(botTexts.forceLocationRequestText));

    return locationComposer;
  }

  validateCaseHandler(): Composer<TelegrafComposer> {
    const validateCaseCompose = this.createComposer();

    validateCaseCompose.action('approved', (ctx) => this.telegrafHelper.validateCaseComposerOnApproved(ctx));

    validateCaseCompose.action('declined', (ctx) => {
      ctx.editMessageReplyMarkup({
        inline_keyboard: [],
      });

      ctx.reply(botTexts.caseDeclinedText);

      return ctx.scene.leave();
    });

    return validateCaseCompose;
  }
}
