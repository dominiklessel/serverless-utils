
// Modules
const is = require('@sindresorhus/is')
const { reqContext, setRequestContext } = require('../lib')

test('should set proper defaults', () => {
  const anEvent = {}
  const aContext = {
    awsRequestId: 'ava-unit-test'
  }
  setRequestContext(anEvent, aContext)

  const reqContextObj = reqContext.get()

  expect(is.object(reqContextObj)).toBe(true)
  expect(is.string(reqContextObj.awsRequestId)).toBe(true)
  expect(is.string(reqContextObj['x-correlation-id'])).toBe(true)
  expect(reqContextObj.awsRequestId).toBe(aContext.awsRequestId)
  expect(reqContextObj['x-correlation-id']).toBe(aContext.awsRequestId)
})

test('should carry over x-correlation-id from headers', () => {
  const anEvent = {
    headers: {
      'x-correlation-id': 'parent-ava-unit-test'
    }
  }
  const aContext = {
    awsRequestId: 'ava-unit-test'
  }
  setRequestContext(anEvent, aContext)

  const reqContextObj = reqContext.get()

  expect(is.object(reqContextObj)).toBe(true)
  expect(is.string(reqContextObj.awsRequestId)).toBe(true)
  expect(is.string(reqContextObj['x-correlation-id'])).toBe(true)
  expect(reqContextObj.awsRequestId).toBe(aContext.awsRequestId)
  expect(reqContextObj['x-correlation-id']).toBe(anEvent.headers['x-correlation-id'])
})

test('should clear request context', () => {
  reqContext.clearAll()
  expect(global.REQ_CONTEXT).toBeUndefined()
})

test('should set value for unprefixed key with proper prefix', () => {
  reqContext.set('foo', 'bar')
  expect(global.REQ_CONTEXT['x-correlation-foo']).toBe('bar')
})

test('should set value for prefixed key', () => {
  reqContext.set('x-correlation-foo-2', 'bar2')
  expect(global.REQ_CONTEXT['x-correlation-foo-2']).toBe('bar2')
})
