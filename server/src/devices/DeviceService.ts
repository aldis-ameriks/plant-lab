import { knex } from '../common/db';

export class DeviceService {
  public getUserDevices() {
    return knex('devices')
      .select('devices.*')
      .from('devices')
      .leftJoin('users_devices', 'users_devices.device_id', 'devices.id')
      .where('users_devices.user_id', 1)
      .andWhereNot('test', true)
      .orderBy('id');
  }

  public getUserDevice(deviceId: string) {
    return knex('devices')
      .select('*')
      .from('devices')
      .where('id', deviceId)
      .first();
  }
}
