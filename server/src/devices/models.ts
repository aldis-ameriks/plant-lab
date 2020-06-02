import { IsNumber, MaxLength } from 'class-validator';
import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql';

import { DeviceEntity, DeviceStatus, DeviceType, DeviceVersion } from 'common/types/entities';

registerEnumType(DeviceVersion, {
  name: 'DeviceVersion',
  description: 'Device version',
});

registerEnumType(DeviceType, {
  name: 'DeviceType',
  description: 'Device type',
});

registerEnumType(DeviceStatus, {
  name: 'DeviceStatus',
  description: 'Device status',
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

  @Field((_type) => DeviceVersion)
  version: DeviceVersion;

  static from(device: DeviceEntity): Device {
    return {
      id: `${device.id}`,
      firmware: device.firmware,
      name: device.name,
      room: device.room,
      type: device.type,
      version: device.version,
    };
  }
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
  version: DeviceVersion;
}
