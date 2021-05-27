import { MyContextInterface } from './myContextInterface';
import { WizardStateInterface } from './wizardStateInterface';

export interface TelegrafHelperInterface {
  locationComposerOnLocation(ctx: MyContextInterface): Promise<WizardStateInterface | void>;
  validateCaseComposerOnApproved(ctx: MyContextInterface): Promise<void>;
}
