import { IsNumber, MaxLength } from 'class-validator';
import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql';

enum DeviceType {
  hub_10 = 'hub_10',
  sensor_10 = 'sensor_10',
}

registerEnumType(DeviceType, {
  name: 'DeviceType',
  description: 'Device type',
});

@ObjectType()
export class Device {
  @Field((_type) => ID)
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  room: string;

  @Field({ nullable: true })
  firmware: string;

  @Field((_type) => DeviceType)
  type: DeviceType;
}

@InputType()
export class NewDeviceInput {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @MaxLength(255)
  name: string;

  @Field({ nullable: true })
  @MaxLength(255)
  room?: string;

  @Field()
  @MaxLength(255)
  firmware: string;
}

@InputType()
export class PairDeviceInput {
  @Field()
  @MaxLength(20)
  type: DeviceType;
}
