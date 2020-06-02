export function mockClassMethods<T extends Function>(clazz: T) {
  const methods = Object.getOwnPropertyNames(clazz.prototype).filter((property) => property !== 'constructor');
  return methods.reduce((acc, curr) => {
    acc[curr] = jest.fn();
    return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {}) as any;
}
