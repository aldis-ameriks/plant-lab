class BaseError extends Error {
  readonly message
  readonly extensions

  constructor(message?: string, extensions?: Record<string, unknown>) {
    super(message)
    this.extensions = extensions
    this.message = message
  }
}

export class UserInputError extends BaseError {}

export class Forbidden extends BaseError {
  constructor(message = 'Forbidden', extensions?: Record<string, unknown>) {
    super(message, extensions)
  }
}

export class TechnicalError extends BaseError {
  constructor(message = 'Technical Error', extensions?: Record<string, unknown>) {
    super(message, extensions)
  }
}
