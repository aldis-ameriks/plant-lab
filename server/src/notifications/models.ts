import { IsArray, IsEnum, IsString } from 'class-validator';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';

import { NotificationType, NotificationEntity } from 'common/types/entities';

registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: 'Notification type',
});

@ObjectType()
export class Notification implements Pick<NotificationEntity, 'id' | 'title' | 'body' | 'type'> {
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
}

export class NotificationResponse {
  @IsArray()
  data: NotificationEntity[];

  constructor(_notifications: NotificationEntity[]) {
    this.data = _notifications;
  }
}
