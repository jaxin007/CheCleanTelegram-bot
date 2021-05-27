import { Scenes } from 'telegraf';

import { MyContextInterface } from './myContextInterface';

export interface WizardStateDataInterface {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  details: string;
  url: string;
}

export interface WizardStateInterface extends Scenes.WizardContextWizard<MyContextInterface>{
  state: WizardStateDataInterface;
}
