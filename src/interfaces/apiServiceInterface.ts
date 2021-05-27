import { WizardStateDataInterface } from './wizardStateInterface';

export interface ApiServiceInterface {
  loginBot(): Promise<string>;

  sendCase(createdCase: WizardStateDataInterface, token: string): Promise<string>;

  uploadFileByUrl(url: string, fileName: string): Promise<void>;
}
