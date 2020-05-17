import { IsNumber, MaxLength } from 'class-validator';
import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql';

import { devices } from 'common/types/entities';

export enum DeviceVersion {
  hub_10 = 'hub_10',
  sensor_10 = 'sensor_10',
}

export enum DeviceType {
  hub = 'hub',
  sensor = 'sensor',
}

registerEnumType(DeviceVersion, {
  name: 'DeviceVersion',
  description: 'Device version',
});

registerEnumType(DeviceType, {
  name: 'DeviceType',
  description: 'Device type',
});

export enum DeviceStatus {
  new = 'new',
  pairing = 'pairing',
  paired = 'paired',
  reset = 'reset',
}

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

  @Field((_type) => DeviceType)
  type: DeviceType;

  @Field((_type) => DeviceVersion)
  version: DeviceVersion;
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
  version: DeviceVersion;
}
