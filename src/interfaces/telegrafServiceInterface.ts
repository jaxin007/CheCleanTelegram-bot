import { Composer } from 'telegraf';
import { TelegrafComposer } from '../types';

export interface TelegrafServiceInterface {
  botInitHandler(): Composer<TelegrafComposer>;

  createCaseHandler(): Composer<TelegrafComposer>;

  locationHandler(): Composer<TelegrafComposer> ;

  photoHandler(): Composer<TelegrafComposer>;

  textHandler(): Composer<TelegrafComposer>;

  validateCaseHandler(): Composer<TelegrafComposer>;
}
