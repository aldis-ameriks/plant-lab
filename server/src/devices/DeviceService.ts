import { knex } from '../common/db';

class DeviceService {
  public getUserSensors() {
    return knex('sensors')
      .select('sensors.*')
      .from('sensors')
      .leftJoin('users_sensors', 'users_sensors.sensor_id', 'sensors.id')
      .where('users_sensors.user_id', 1)
      .andWhereNot('test', true)
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

export default DeviceService;
