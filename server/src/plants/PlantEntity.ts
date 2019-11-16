import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Plant {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;
}
