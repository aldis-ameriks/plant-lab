import { IsArray, IsEnum, IsString } from 'class-validator';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';

import { notification_type, notifications } from 'common/types/entities';

registerEnumType(notification_type, {
  name: 'NotificationType',
  description: 'Notification type',
});

@ObjectType()
export class Notification implements Pick<notifications, 'id' | 'title' | 'body' | 'type'> {
  @Field((_type) => ID)
  @IsString()
  id: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  body: string;

  @Field((_type) => notification_type)
  @IsEnum(notification_type)
  type: notification_type;
}

export class NotificationResponse {
  @IsArray()
  notifications: Notification[];

  constructor(_notifications: Notification[]) {
    this.notifications = _notifications;
  }
}
