import { Scenes } from 'telegraf';

import { telegrafHandler } from '../services';

const scenes = [
  telegrafHandler.botInitHandler(),
  telegrafHandler.createCaseHandler(),
  telegrafHandler.textHandler(),
  telegrafHandler.photoHandler(),
  telegrafHandler.locationHandler(),
  telegrafHandler.validateCaseHandler(),
];

export const superWizard = new Scenes.WizardScene<any>(
  'super-wizard',
  ...scenes,
);
