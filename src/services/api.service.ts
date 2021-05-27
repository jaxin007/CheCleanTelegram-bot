import path from 'path';
import axios, { AxiosInstance } from 'axios';
import { Bucket, Storage } from '@google-cloud/storage';
import { injectable } from 'inversify';

import { envConfig } from '../config';
import { ApiServiceInterface, WizardStateDataInterface } from '../interfaces';

@injectable()
export class ApiService implements ApiServiceInterface {
  private readonly googleAccountFile: string;

  private readonly gc: Bucket;

  private readonly axios: AxiosInstance;

  constructor() {
    this.googleAccountFile = path.join(__dirname, `../google-storage-config/${envConfig.GOOGLE_PROJECT_ACCOUNT_FILE}`);

    this.gc = new Storage({
      keyFilename: this.googleAccountFile,
      projectId: envConfig.GOOGLE_GOOGLE_PROJECT_ID,
    }).bucket(envConfig.GOOGLE_BUCKET_NAME);

    this.axios = axios.create({
      baseURL: envConfig.API_URL,
    });
  }

  async loginBot(): Promise<string> {
    const response = await this.axios.post<{token: string}>(
      '/auth/login',
      {
        login: envConfig.BOT_LOGIN,
        password: envConfig.BOT_PASSWORD,
      },
    );

    return response.data.token;
  }

  async sendCase(createdCase: WizardStateDataInterface, token: string): Promise<string> {
    const { data } = await this.axios.post('/cases', createdCase,
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

    await this.gc.file(fileName).save(data);
  }
}
