import { IsNumber, IsString } from 'class-validator';

export class BaseError extends Error {
  @IsNumber()
  readonly statusCode;

  @IsString()
  readonly error;

  @IsString()
  readonly message;

  constructor(message: string, statusCode: number, error: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
  }
}
