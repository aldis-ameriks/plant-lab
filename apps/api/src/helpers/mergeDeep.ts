import { UserInputError } from './errors.ts'

function isObject(obj) {
  return obj && typeof obj === 'object'
}

export function mergeDeep(...objects) {
  const target = {}

  for (const object of objects) {
    if (!isObject(object)) {
      throw new UserInputError('Not an object')
    }

    Object.keys(object).forEach((key) => {
      const targetValue = target[key]
      const sourceValue = object[key]

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue)
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = mergeDeep(targetValue, sourceValue)
      } else {
        target[key] = sourceValue
      }
    })
  }

  return target
}
