import { knex } from 'common/db';

export class NotificationsService {
  getUnsentNotifications(userId: string) {
    return knex('notifications').where('sent_at', null).andWhere('user_id', userId);
  }
}
