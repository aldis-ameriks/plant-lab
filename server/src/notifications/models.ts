import { IsArray, IsEnum, IsString } from 'class-validator';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';

import { NotificationType, NotificationEntity } from 'common/types/entities';

registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: 'Notification type',
});

@ObjectType()
export class Notification {
  @Field((_type) => ID)
  @IsString()
  id: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  body: string;

  @Field((_type) => NotificationType)
  @IsEnum(NotificationType)
  type: NotificationType;

  static from(notification: NotificationEntity): Notification {
    return {
      id: notification.id,
      body: notification.body,
      title: notification.title,
      type: notification.type,
    };
  }
}

export class NotificationResponse {
  @IsArray()
  data: Notification[];

  constructor(_notifications: Notification[]) {
    this.data = _notifications;
  }
}
