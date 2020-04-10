import { UserInputError } from 'apollo-server-fastify';
import { validate as classValidator } from 'class-validator';

export async function validate(target: {}) {
  const err = await classValidator(target);
  if (err.length) {
    throw new UserInputError('Invalid input', { validationErrors: err });
  }
}
