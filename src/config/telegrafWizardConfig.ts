import { Composer, Scenes } from 'telegraf';

import { TYPES } from '../constants';
import { container } from './inversifyConfig';
import { TelegrafComposer } from '../types';
import { TelegrafServiceInterface } from '../interfaces';

const telegrafService = container.get<TelegrafServiceInterface>(TYPES.TelegrafService);

const scenes: Composer<TelegrafComposer>[] = [
  telegrafService.botInitHandler(),
  telegrafService.createCaseHandler(),
  telegrafService.textHandler(),
  telegrafService.photoHandler(),
  telegrafService.locationHandler(),
  telegrafService.validateCaseHandler(),
];

export const superWizard = new Scenes.WizardScene<any>(
  'super-wizard',
  ...scenes,
);
