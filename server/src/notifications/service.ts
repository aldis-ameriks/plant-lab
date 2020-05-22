import Knex from 'knex';
import { Inject, Service } from 'typedi';

import { NotificationType, NotificationEntity } from 'common/types/entities';

@Service()
export class NotificationsService {
  @Inject('knex')
  private readonly knex: Knex;

  getUnsentNotifications(userId: string): Promise<NotificationEntity[]> {
    return this.knex('notifications')
      .update('sent_at', new Date())
      .where('sent_at', null)
      .andWhere('user_id', userId)
      .returning('*');
  }

  getLastNotificationTimestamp(
    deviceId: string,
    type: NotificationType
  ): Promise<Pick<NotificationEntity, 'created_at' | 'sent_at'>> {
    return this.knex('notifications')
      .select('created_at', 'sent_at')
      .where('device_id', deviceId)
      .andWhere('type', type)
      .orderBy('created_at', 'desc')
      .first();
  }

  async createDeviceNotification(deviceId: string, type: NotificationType, title: string, body: string): Promise<void> {
    const userId = await this.knex('users_devices')
      .select('user_id')
      .where('device_id', deviceId)
      .first()
      .then((result) => (result ? result.user_id : result));

    if (!userId) {
      return;
    }

    await this.knex('notifications').insert({
      user_id: userId,
      device_id: deviceId,
      type,
      title,
      body,
    });
  }
}
