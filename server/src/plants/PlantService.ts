import { knex } from '../common/db';

export class PlantService {
  public async getPlants() {
    return knex('plants').select('*');
  }
}
