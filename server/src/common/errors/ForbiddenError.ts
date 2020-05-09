import { BaseError } from 'common/errors/BaseError';

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super(message, 403, 'Forbidden');
  }
}
