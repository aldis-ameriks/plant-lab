import { IsEnum, IsString } from 'class-validator';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';

import { notifications } from 'common/types/entities';

export enum NotificationType {
  low_moisture = 'low_moisture',
  low_battery = 'low_battery',
}

registerEnumType(NotificationType, {
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

  @Field((_type) => NotificationType)
  @IsEnum(NotificationType)
  type: NotificationType;
}

export class LastNotification implements Pick<notifications, 'created_at' | 'sent_at'> {
  created_at: Date;
  sent_at: Date;
}
