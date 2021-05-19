import axios from 'axios';
import path from 'path';
import { Storage } from '@google-cloud/storage';

import { envConfig } from '../config';
import { WizardStateDataInterface } from '../interfaces';

export class ApiService {
  private readonly apiUrl: string;

  private readonly googleBuckenName: string;

  private readonly googleAccountFile: string;

  private readonly googleProjectId: string;

  private readonly gc: Storage;

  constructor() {
    this.apiUrl = envConfig.API_URL;
    this.googleBuckenName = envConfig.GOOGLE_BUCKET_NAME;
    this.googleAccountFile = path.join(__dirname, `../google-storage-config/${envConfig.GOOGLE_PROJECT_ACCOUNT_FILE}`);
    this.googleProjectId = envConfig.GOOGLE_GOOGLE_PROJECT_ID;

    this.gc = new Storage({
      keyFilename: this.googleAccountFile,
      projectId: this.googleProjectId,
    });
  }

  async loginBot(): Promise<string> {
    const { data } = await axios.post(
      `${this.apiUrl}/login`,
      {
        username: process.env.JWT_USERNAME,
        password: process.env.JWT_PASSWORD,
      },
    );

    return data.token;
  }

  // todo fix types
  async sendCase(createdCase: any, token: string): Promise<string> {
    const { data } = await axios.post(`${this.apiUrl}/cases`, createdCase,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

    return data.id;
  }

  async uploadFileByUrl(url: string, fileName: string): Promise<void> {
    const { data } = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    await this.gc.bucket(this.googleBuckenName).file(fileName).save(data);
  }
}

module.exports = {
  ApiService,
};
