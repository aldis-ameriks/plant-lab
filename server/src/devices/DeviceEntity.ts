import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Device {
  @Field(type => ID)
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  room: string;

  @Field({ nullable: true })
  firmware: string;
}
