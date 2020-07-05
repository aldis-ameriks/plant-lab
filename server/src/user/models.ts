import { IsString, MaxLength } from 'class-validator';

import { Field, InputType, ObjectType } from 'type-graphql';

import { UserSettingEntity } from 'common/types/entities';

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

  static from(userSetting: UserSettingEntity): UserSetting {
    return userSetting
      ? {
          name: userSetting.name,
          value: userSetting.value,
        }
      : undefined;
  }
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
