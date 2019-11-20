import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Sensor {
  @Field(type => ID)
  id: string;

  @Field({ nullable: true })
  room: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  firmware: string;

  @Field({ nullable: true })
  location: string;
}
