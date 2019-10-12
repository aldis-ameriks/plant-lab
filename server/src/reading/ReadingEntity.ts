import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Reading {
  @Field()
  time: Date;

  @Field()
  value: number;
}

@ObjectType()
export class Readings {
  @Field(type => ID)
  id: string;

  @Field(type => [Reading])
  moisture: Reading[];

  @Field(type => [Reading])
  temperature: Reading[];

  @Field(type => [Reading])
  batteryVoltage: Reading[];

  @Field({ nullable: true })
  watered?: Date;
}
