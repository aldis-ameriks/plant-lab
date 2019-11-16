import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Plant {
  @Field(type => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;
}
