import { knex } from '../common/db';

class SensorService {
  public getUserSensors() {
    return knex('sensors')
      .select('sensors.*')
      .from('sensors')
      .leftJoin('users_sensors', 'users_sensors.sensor_id', 'sensors.id')
      .where('users_sensors.user_id', 1)
      .orderBy('id');
  }

  public getUserSensor(sensorId: string) {
    return knex('sensors')
      .select('*')
      .from('sensors')
      .where('id', sensorId)
      .first();
  }
}

export default SensorService;
