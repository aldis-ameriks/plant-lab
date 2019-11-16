import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Sensor {
  @Field(type => ID)
  id: number;

  @Field({ nullable: true })
  room: string;
}
