import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class NewDeviceInput {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @MaxLength(255)
  name: string;

  @Field({ nullable: true })
  @MaxLength(255)
  room?: string;

  @Field()
  @MaxLength(255)
  firmware: string;
}
