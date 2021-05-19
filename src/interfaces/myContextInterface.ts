import { Context, Scenes } from 'telegraf';

import { WizardStateInterface } from './wizardStateInterface';

export interface MyContextInterface extends Context {
  scene: Scenes.SceneContextScene<MyContextInterface, Scenes.WizardSessionData>,
  update: any, // todo remove and fix any with telegram or custom type
  wizard: WizardStateInterface
}
