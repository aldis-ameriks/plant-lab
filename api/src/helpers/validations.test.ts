import { regex } from './validations'

test('regex - number', () => {
  let validNumber = '4444444444'
  let result = regex.number.test(validNumber)
  expect(result).toBeTruthy()

  validNumber = '09452888173'
  result = regex.number.test(validNumber)
  expect(result).toBeTruthy()

  const invalidNumber = 'xxx'
  result = regex.number.test(invalidNumber)
  expect(result).toBeFalsy()
})
