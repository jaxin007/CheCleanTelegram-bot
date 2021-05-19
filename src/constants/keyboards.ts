import { botTexts } from './botTexts';
import { TelegrafKeyboard } from '../types';
import { createTelegrafKeyboard } from '../helpers';

export class Keyboards {
  static async greetingKeyboard(): Promise<TelegrafKeyboard> {
    return createTelegrafKeyboard({
      one_time_keyboard: true,
      inline_keyboard: [
        [
          {
            text: botTexts.helpButtonText,
            callback_data: 'help',
          },
          {
            text: botTexts.declineButtonText,
            callback_data: 'cancel',
          },
        ],
        [{
          text: botTexts.createCaseButtonText,
          callback_data: 'create',
        }],
      ],
    });
  }

  static async photoComposerLocationRequestKeyboard(): Promise<TelegrafKeyboard> {
    return createTelegrafKeyboard({
      one_time_keyboard: true,
      keyboard: [[{
        text: botTexts.locationRequestButtonText,
        request_location: true,
      }]],
    });
  }

  static async locationComposerCaseApproveKeyboard(): Promise<TelegrafKeyboard> {
    return createTelegrafKeyboard({
      inline_keyboard: [
        [
          {
            text: botTexts.caseApproveButtonText,
            callback_data: 'approved',
          },
          {
            text: botTexts.caseDeclineButtonText,
            callback_data: 'declined',
          },
        ],
      ],
    });
  }

  static async recreateCaseKeyboard(): Promise<TelegrafKeyboard> {
    return createTelegrafKeyboard({
      inline_keyboard: [
        [
          {
            text: botTexts.startWorkText,
            callback_data: 'create',
          },
        ],
      ],
    });
  }
}
