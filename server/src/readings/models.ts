import { IsNumber, IsOptional, IsPositive, Length, Max, Min } from 'class-validator';
import { Field, ID, InputType, ObjectType } from 'type-graphql';

import { readings } from 'common/types/entities';

@ObjectType()
export class Reading implements Pick<readings, 'moisture' | 'temperature' | 'battery_voltage' | 'light'> {
  @Field((_type) => ID)
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

@InputType()
export class ReadingInput
  implements
    Pick<
      readings,
      | 'reading_id'
      | 'moisture'
      | 'moisture_raw'
      | 'moisture_min'
      | 'moisture_max'
      | 'temperature'
      | 'battery_voltage'
      | 'light'
    > {
  @Field()
  @Length(1, 6)
  device_id: string;

  @Field()
  @Min(0)
  @Max(65535)
  reading_id: number;

  @Field()
  @Min(0)
  @Max(100)
  moisture: number;

  @Field()
  @Min(0)
  @Max(10000)
  moisture_raw: number;

  @Field()
  @Min(0)
  @Max(10000)
  moisture_min: number;

  @Field()
  @Min(0)
  @Max(10000)
  moisture_max: number;

  @Field()
  @Min(-100)
  @Max(100)
  temperature: number;

  @Field()
  @IsPositive()
  battery_voltage: number;

  @Field({ nullable: true })
  @IsOptional()
  @Min(0)
  light?: number;

  @Field()
  @IsNumber()
  signal: number;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 10)
  firmware?: string;
}
