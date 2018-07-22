
// Modules
const is = require('@sindresorhus/is')
const { parseParams } = require('../lib')

// Tests
test('Should return proper params for empty event', () => {
  const anEvent = {}
  const {
    err,
    headers,
    queryStringParams,
    pathParams,
    body
  } = parseParams(anEvent)

  expect(err).toBeNull()
  expect(is.object(headers)).toBe(true)
  expect(is.object(queryStringParams)).toBe(true)
  expect(is.object(pathParams)).toBe(true)
  expect(is.object(body)).toBe(true)
  expect(Object.keys(headers).length).toBe(0)
  expect(Object.keys(queryStringParams).length).toBe(0)
  expect(Object.keys(pathParams).length).toBe(0)
  expect(Object.keys(body).length).toBe(0)
})

test('Should return error for malformed event', () => {
  const anEvent = {
    body: '|{'
  }
  const {
    err,
    headers,
    queryStringParams,
    pathParams,
    body
  } = parseParams(anEvent)

  expect(err).toEqual(new SyntaxError('Unexpected token | in JSON at position 0'))
  expect(is.object(headers)).toBe(true)
  expect(is.object(queryStringParams)).toBe(true)
  expect(is.object(pathParams)).toBe(true)
  expect(is.object(body)).toBe(true)
  expect(Object.keys(headers).length).toBe(0)
  expect(Object.keys(queryStringParams).length).toBe(0)
  expect(Object.keys(pathParams).length).toBe(0)
  expect(Object.keys(body).length).toBe(0)
})
