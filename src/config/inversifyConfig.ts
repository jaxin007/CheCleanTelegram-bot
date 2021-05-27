import { Container } from 'inversify';

import { TYPES } from '../constants';
import { TelegrafHelper } from '../helpers';
import {
  ApiService,
  TelegrafService,
  GeocoderService,
} from '../services';
import {
  ApiServiceInterface,
  GeocoderServiceInterface,
  TelegrafHelperInterface,
  TelegrafServiceInterface,
} from '../interfaces';

export const container = new Container();

container.bind<ApiServiceInterface>(TYPES.ApiService).to(ApiService);
container.bind<TelegrafHelperInterface>(TYPES.TelegrafHelper).to(TelegrafHelper);
container.bind<TelegrafServiceInterface>(TYPES.TelegrafService).to(TelegrafService);
container.bind<GeocoderServiceInterface>(TYPES.GeocoderService).to(GeocoderService);
