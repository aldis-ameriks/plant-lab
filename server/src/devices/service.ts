import Knex from 'knex';
import { Logger } from 'pino';
import { Inject, Service } from 'typedi';

import { NewDeviceInput } from './models';

import { ForbiddenError } from 'common/errors/ForbiddenError';
import { DeviceEntity, DeviceStatus, DeviceVersion } from 'common/types/entities';

@Service()
export class DeviceService {
  @Inject('knex')
  private readonly knex: Knex;

  public async addDevice(input: NewDeviceInput, userId: string): Promise<DeviceEntity> {
    return this.knex.transaction(async (trx) => {
      const device = await trx('devices')
        .insert(input)
        .returning('*')
        .then((rows) => rows[0]);

      await trx('users_devices').where('user_id', userId).andWhere('device_id', device.id).del();
      await trx('users_devices').insert({ device_id: device.id, user_id: userId });
      return device;
    });
  }

  public getUserDevice(deviceId: string, userId: string): Promise<DeviceEntity> {
    return this.knex<DeviceEntity>('devices')
      .select('*')
      .from('devices')
      .leftJoin('users_devices', 'users_devices.device_id', 'devices.id')
      .where('devices.id', deviceId)
      .andWhere('users_devices.user_id', userId)
      .first();
  }

  public getUserDevices(userId: string): Promise<DeviceEntity[]> {
    return this.knex<DeviceEntity>('devices')
      .select('devices.*')
      .from('devices')
      .leftJoin('users_devices', 'users_devices.device_id', 'devices.id')
      .where('users_devices.user_id', userId)
      .andWhereNot('test', true)
      .orderBy('id');
  }

  public async removeDevice(deviceId: string, userId: string): Promise<void> {
    return this.knex.transaction(async (trx) => {
      await trx('users_devices').where('user_id', userId).andWhere('device_id', deviceId).del();

      return trx('devices').where('id', deviceId).del();
    });
  }

  public async updateDeviceName(deviceId: string, name: string): Promise<DeviceEntity> {
    return this.knex<DeviceEntity>('devices')
      .where('id', deviceId)
      .update('name', name)
      .returning('*')
      .then((rows) => rows[0]);
  }

  public async updateDeviceRoom(deviceId: string, room: string): Promise<DeviceEntity> {
    return this.knex<DeviceEntity>('devices')
      .where('id', deviceId)
      .update('room', room)
      .returning('*')
      .then((rows) => rows[0]);
  }

  public async verifyUserOwnsDevice(deviceId: string, userId: string): Promise<void> {
    const res = await this.knex('users_devices').where('user_id', userId).andWhere('device_id', deviceId).first();

    if (!res) {
      throw new ForbiddenError('Access denied');
    }
  }

  public async pairDevice(log: Logger, version: DeviceVersion, userId: string, address: string): Promise<boolean> {
    const device = await this.knex('devices')
      .select('id')
      .where('address', address)
      .andWhere('version', version)
      .andWhere('status', DeviceStatus.pairing)
      .first();

    if (!device) {
      log.error('Failed to initiate pairing');
      return false;
    }

    log.info(`Found device, assigning device: ${device.id} to user: ${userId}`);
    await this.knex('users_devices').insert({ user_id: userId, device_id: device.id });
    return true;
  }
}
