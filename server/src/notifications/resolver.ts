import { Ctx, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { Context } from 'common/types/context';
import { Notification } from 'notifications/models';
import { NotificationsService } from 'notifications/service';

@Service()
@Resolver()
export class NotificationsResolver {
  @Inject()
  private readonly notificationsService: NotificationsService;

  @Query((_returns) => [Notification])
  async newNotifications(@Ctx() ctx: Context): Promise<Notification[]> {
    const userId = ctx.user.id;
    const result = await this.notificationsService.getUnsentNotifications(userId);
    return result.map((entry) => Notification.from(entry));
  }
}
