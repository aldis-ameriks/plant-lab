import { Ctx, Query, Resolver } from 'type-graphql';

import { Context } from 'common/types/context';
import { Notification } from 'notifications/models';
import { NotificationsService } from 'notifications/service';

@Resolver()
export class NotificationsResolver {
  private readonly notificationsService;

  constructor() {
    this.notificationsService = new NotificationsService();
  }

  @Query((_returns) => Notification)
  newNotifications(@Ctx() ctx: Context) {
    const userId = ctx.user.id;
    return this.notificationsService.getUnsentNotifications(userId);
  }
}
