import { MyContextInterface } from './myContextInterface';

export interface TelegrafHelperInterface {
  validateCaseComposerOnApproved(ctx: MyContextInterface): Promise<void>;
}
