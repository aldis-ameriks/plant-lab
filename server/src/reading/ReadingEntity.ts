import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Reading {
  @Field(type => ID)
  sensor_id: string;

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
