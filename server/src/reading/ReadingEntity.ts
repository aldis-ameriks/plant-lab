import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Reading {
  @Field()
  time: Date;

  @Field()
  moisture: number;

  @Field()
  temperature: number;

  @Field()
  batteryVoltage: number;

  @Field()
  light?: number;
}

@ObjectType()
export class Readings {
  @Field(type => [Reading])
  readings: Reading[];

  @Field({ nullable: true })
  watered?: Date;
}
