import { knex } from '../common/db';

class SensorService {
  public getUserSensors() {
    return knex('sensors')
      .select('sensors.*')
      .from('sensors')
      .leftJoin('users_sensors', 'users_sensors.sensor_id', 'sensors.id')
      .where('users_sensors.user_id', 1);
  }
}

export default SensorService;
