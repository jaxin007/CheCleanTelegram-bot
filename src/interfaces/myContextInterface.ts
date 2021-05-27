import { Context, Scenes } from 'telegraf';

import { WizardStateInterface } from './wizardStateInterface';

export interface MyContextInterface extends Context {
  scene: Scenes.SceneContextScene<MyContextInterface, Scenes.WizardSessionData>;
  update: any;
  wizard: WizardStateInterface;
}
