import { CoordsModel } from '../models';

export interface GeocoderServiceInterface {
  isCoordsValid(coords: CoordsModel): Promise<boolean>;
}
