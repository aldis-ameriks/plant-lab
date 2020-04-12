import { ForbiddenError } from 'type-graphql';

import { NewDeviceInput } from './models';

import { knex } from 'common/db';

export class DeviceService {
  public async addDevice(input: NewDeviceInput, userId: string) {
    return knex.transaction(async (trx) => {
      const device = await trx('devices')
        .insert(input)
        .returning('*')
        .then((rows) => rows[0]);

      await trx('users_devices').where('user_id', userId).andWhere('device_id', device.id).del();

      await trx('users_devices').insert({ device_id: device.id, user_id: userId });

      return device;
    });
  }

  public getUserDevice(deviceId: string, userId: string) {
    return knex('devices')
      .select('*')
      .from('devices')
      .leftJoin('users_devices', 'users_devices.device_id', 'devices.id')
      .where('devices.id', deviceId)
      .andWhere('users_devices.user_id', userId)
      .first();
  }

  public getUserDevices(userId: string) {
    return knex('devices')
      .select('devices.*')
      .from('devices')
      .leftJoin('users_devices', 'users_devices.device_id', 'devices.id')
      .where('users_devices.user_id', userId)
      .andWhereNot('test', true)
      .orderBy('id');
  }

  public async removeDevice(deviceId: string, userId: string) {
    return knex.transaction(async (trx) => {
      await trx('users_devices').where('user_id', userId).andWhere('device_id', deviceId).del();

      return trx('devices').where('id', deviceId).del();
    });
  }

  public async updateDeviceName(deviceId: string, name: string) {
    return knex('devices')
      .where('id', deviceId)
      .update('name', name)
      .returning('*')
      .then((rows) => rows[0]);
  }

  public async updateDeviceRoom(deviceId: string, room: string) {
    return knex('devices')
      .where('id', deviceId)
      .update('room', room)
      .returning('*')
      .then((rows) => rows[0]);
  }

  public async verifyUserOwnsDevice(deviceId: string, userId: string) {
    const res = await knex('users_devices').where('user_id', userId).andWhere('device_id', deviceId).first();

    if (!res) {
      throw new ForbiddenError();
    }
  }

  public async pairDevice(type: string, userId: string, address: string): Promise<boolean> {
    const device = await knex('devices').select('id').where('address', address).andWhere('type', type).first();
    if (!device) {
      return false;
    }
    await knex('users_devices').insert({ user_id: userId, device_id: device.id });
    return true;
  }
}
