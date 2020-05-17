import { IsNumber, MaxLength } from 'class-validator';
import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql';

import { device_status, device_type, device_version, devices } from 'common/types/entities';

registerEnumType(device_version, {
  name: 'DeviceVersion',
  description: 'Device version',
});

registerEnumType(device_type, {
  name: 'DeviceType',
  description: 'Device type',
});

registerEnumType(device_status, {
  name: 'DeviceStatus',
  description: 'Device status',
});

@ObjectType()
export class Device implements Pick<devices, 'name' | 'room' | 'firmware' | 'type' | 'version'> {
  @Field((_type) => ID)
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  room: string;

  @Field({ nullable: true })
  firmware: string;

  @Field((_type) => device_type)
  type: device_type;

  @Field((_type) => device_version)
  version: device_version;
}

@InputType()
export class NewDeviceInput implements Pick<devices, 'id' | 'name' | 'room' | 'firmware'> {
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
  version: device_version;
}
