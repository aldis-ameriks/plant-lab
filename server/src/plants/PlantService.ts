import { knex } from '../common/db';

export class PlantService {
  public async getPlants() {
    return knex('plants').select('*');
  }

  public getPlant(sensorId: number) {
    return knex('plants')
      .select('plants.*')
      .leftJoin('sensors_plants', 'sensors_plants.plant_id', 'plants.id')
      .where('sensors_plants.sensor_id', sensorId)
      .first();
  }
}
