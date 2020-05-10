import { knex } from 'common/db';
import { NotificationType } from 'notifications/models';

export class NotificationsService {
  getUnsentNotifications(userId: string) {
    return knex('notifications').where('sent_at', null).andWhere('user_id', userId);
  }

  getLastNotificationTimestamp(deviceId: string, type: NotificationType): Promise<Date> {
    return knex('notifications')
      .select('created_at')
      .where('device_id', deviceId)
      .andWhere('type', type)
      .orderBy('created_at', 'desc')
      .first()
      .then((result) => (result ? result.created_at : result));
  }

  async createDeviceNotification(deviceId: string, type: NotificationType, title: string, body: string): Promise<void> {
    const userId = await knex('users_devices')
      .select('user_id')
      .where('device_id', deviceId)
      .first()
      .then((result) => (result ? result.user_id : result));

    if (!userId) {
      return;
    }

    await knex('notifications').insert({
      user_id: userId,
      device_id: deviceId,
      type,
      title,
      body,
    });
  }
}
