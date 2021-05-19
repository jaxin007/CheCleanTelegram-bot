import { Scenes } from 'telegraf';

import { MyContextInterface } from './myContextInterface';

export interface WizardStateDataInterface {
  details: string,
  image_url: string,
  location: string,
}

export interface WizardStateInterface extends Scenes.WizardContextWizard<MyContextInterface>{
  state: WizardStateDataInterface,
}
