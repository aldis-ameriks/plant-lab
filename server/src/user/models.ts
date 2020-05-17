import { IsString, MaxLength } from 'class-validator';

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
