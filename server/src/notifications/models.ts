import { IsString } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Notification {
  @Field((_type) => ID)
  @IsString()
  id: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  body: string;
}
