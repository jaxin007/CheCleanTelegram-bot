import NodeGeocoder from 'node-geocoder';
import { injectable } from 'inversify';

import { envConfig } from '../config';
import { CoordsModel } from '../models';
import { GeocoderServiceInterface } from '../interfaces';

@injectable()
export class GeocoderService implements GeocoderServiceInterface {
  private readonly geocoder: NodeGeocoder.Geocoder;

  constructor() {
    this.geocoder = NodeGeocoder({
      provider: 'google',
      apiKey: envConfig.GOOGLE_API_KEY,
      formatter: null,
      language: 'eu',
    });
  }

  async isCoordsValid(coords: CoordsModel): Promise<boolean> {
    const location = await this.geocoder.reverse({
      lat: coords.latitude,
      lon: coords.longitude,
    });

    return location[0].countryCode === 'UA';
  }
}
