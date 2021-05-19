import { Scenes } from 'telegraf';

import { TelegrafHelper } from '../helpers';
import { superWizard } from './telegrafWizardConfig';

export const stage = new Scenes.Stage([superWizard], {
  default: 'super-wizard',
});

stage
  .help(TelegrafHelper.helpHandler)
  .action('help', TelegrafHelper.helpHandler)
  .action('cancel', TelegrafHelper.cancelCreatingCase)
  .command('cancel', TelegrafHelper.cancelCreatingCase);
