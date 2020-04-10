import { UserInputError } from 'apollo-server-fastify';
import { validate as classValidator } from 'class-validator';

export async function validate(target: {}) {
  const err = await classValidator(target);
  if (err) {
    const constraints = err.reduce((acc, curr) => {
      acc[curr.property] = curr.constraints;
      return acc;
    }, {});
    throw new UserInputError('Invalid input', constraints);
  }
}
