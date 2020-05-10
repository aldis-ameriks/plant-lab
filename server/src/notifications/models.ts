import { IsString } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';

export enum NotificationType {
  low_moisture = 'low_moisture',
  low_battery = 'low_battery',
}

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
}

export class LastNotification {
  created_at: Date;
  sent_at: Date;
}
