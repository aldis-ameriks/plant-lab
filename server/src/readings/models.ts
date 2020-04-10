import { Field, ID, ObjectType } from 'type-graphql';
import { Length, Max, Min, IsDate } from 'class-validator';

@ObjectType()
export class Reading {
  @Field((type) => ID)
  device_id: string;

  @Field()
  time: Date;

  @Field()
  moisture: number;

  @Field()
  temperature: number;

  @Field()
  battery_voltage: number;

  @Field({ nullable: true })
  light?: number;
}

export class ReadingInput {
  constructor({
    device_id,
    moisture,
    moisture_raw,
    moisture_min,
    moisture_max,
    temperature,
    battery_voltage,
    light,
    timestamp,
    signal,
  }: {
    device_id: string;
    moisture: number;
    moisture_raw: number;
    moisture_min: number;
    moisture_max: number;
    temperature: number;
    battery_voltage: number;
    light: number;
    timestamp: Date;
    signal: number;
  }) {
    this.device_id = device_id;
    this.moisture = moisture;
    this.moisture_raw = moisture_raw;
    this.moisture_min = moisture_min;
    this.moisture_max = moisture_max;
    this.temperature = temperature;
    this.battery_voltage = battery_voltage;
    this.light = light;
    this.timestamp = timestamp;
    this.signal = signal;
  }

  @Length(1, 3)
  device_id: string;

  @Min(0)
  @Max(100)
  moisture: number;

  @Min(0)
  @Max(1024)
  moisture_raw: number;

  @Min(0)
  @Max(1024)
  moisture_min: number;

  @Min(0)
  @Max(1024)
  moisture_max: number;

  @Min(-100)
  @Max(100)
  temperature: number;

  @Min(0)
  @Max(7)
  battery_voltage: number;

  @Min(0)
  light: number;

  @IsDate()
  timestamp: Date;

  @Min(0)
  @Max(1)
  signal: number;
}
