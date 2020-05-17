import { IsString, MaxLength } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class UserSetting {
  @Field()
  @IsString()
  @MaxLength(255)
  name: string;

  @Field()
  @IsString()
  @MaxLength(255)
  value: string;
}

@InputType()
export class UserSettingInput {
  @Field()
  @IsString()
  @MaxLength(255)
  name: string;

  @Field()
  @IsString()
  @MaxLength(255)
  value: string;
}

export class LoginResponse {
  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }

  @IsString()
  @MaxLength(256)
  accessKey: string;
}

export class LoginInput {
  @IsString()
  @MaxLength(256)
  accessKey: string;
}
