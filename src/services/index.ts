import { ApiService } from './api.service';
import { TelegrafService } from './telegraf.service';

// todo refactor via DI
export const apiService = new ApiService();
export const telegrafHandler = new TelegrafService();
