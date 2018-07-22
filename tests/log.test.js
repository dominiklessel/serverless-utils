
// Modules
const { log, reqContext } = require('../lib')
const is = require('@sindresorhus/is')

// Helpers
const grabLogMessage = (fn, ...fnParams) => {
  const oldLog = console.log
  let result

  console.log = (s) => {
    result = s
  }

  fn(...fnParams)

  console.log = oldLog

  return result
}

// Test
test('Write no DEBUG log message when debugging is not enabled', () => {
  const msg = 'ava-test'
  const params = { test: true }
  const jsonLogMessageStr = grabLogMessage(log.debug, msg, params)

  expect(jsonLogMessageStr).toBeUndefined()
})

test('Write proper DEBUG log message when debugging is enabled via ENV var', () => {
  process.env.DEBUG_LOG = true

  const msg = 'ava-test'
  const params = { test: true }
  const jsonLogMessageStr = grabLogMessage(log.debug, msg, params)
  const jsonLogMessage = JSON.parse(jsonLogMessageStr)

  process.env.DEBUG_LOG = false

  expect(is.string(jsonLogMessage.timestamp)).toBe(true)
  expect(is.date(new Date(jsonLogMessage.timestamp))).toBe(true)
  expect(is.string(jsonLogMessage.level)).toBe(true)
  expect(is.string(jsonLogMessage.msg)).toBe(true)
  expect(jsonLogMessage.level).toBe('DEBUG')
  expect(jsonLogMessage.msg).toBe(msg)
  expect(jsonLogMessage.params).toMatchObject(params)
})

test('Write proper DEBUG log message when debugging is enabled via context', () => {
  reqContext.replaceAllWith({ 'Debug-Log-Enabled': 'true' })

  const msg = 'ava-test'
  const params = { test: true }
  const jsonLogMessageStr = grabLogMessage(log.debug, msg, params)
  const jsonLogMessage = JSON.parse(jsonLogMessageStr)

  reqContext.clearAll()

  expect(is.string(jsonLogMessage.timestamp)).toBe(true)
  expect(is.date(new Date(jsonLogMessage.timestamp))).toBe(true)
  expect(is.string(jsonLogMessage.level)).toBe(true)
  expect(is.string(jsonLogMessage.msg)).toBe(true)
  expect(jsonLogMessage.level).toBe('DEBUG')
  expect(jsonLogMessage.msg).toBe(msg)
  expect(jsonLogMessage.params).toMatchObject(params)
})

test('Write proper INFO log message', () => {
  const msg = 'ava-test'
  const params = { test: true }
  const jsonLogMessageStr = grabLogMessage(log.info, msg, params)
  const jsonLogMessage = JSON.parse(jsonLogMessageStr)

  expect(is.string(jsonLogMessage.timestamp)).toBe(true)
  expect(is.date(new Date(jsonLogMessage.timestamp))).toBe(true)
  expect(is.string(jsonLogMessage.level)).toBe(true)
  expect(is.string(jsonLogMessage.msg)).toBe(true)
  expect(jsonLogMessage.level).toBe('INFO')
  expect(jsonLogMessage.msg).toBe(msg)
  expect(jsonLogMessage.params).toMatchObject(params)
})

test('Write proper WARN log message', () => {
  const msg = 'ava-test'
  const params = { test: true }
  const jsonLogMessageStr = grabLogMessage(log.warn, msg, params)
  const jsonLogMessage = JSON.parse(jsonLogMessageStr)

  expect(is.string(jsonLogMessage.timestamp)).toBe(true)
  expect(is.date(new Date(jsonLogMessage.timestamp))).toBe(true)
  expect(is.string(jsonLogMessage.level)).toBe(true)
  expect(is.string(jsonLogMessage.msg)).toBe(true)
  expect(jsonLogMessage.level).toBe('WARN')
  expect(jsonLogMessage.msg).toBe(msg)
  expect(jsonLogMessage.params).toMatchObject(params)
})

test('Write proper ERROR log message', () => {
  const msg = 'ava-test'
  const params = { test: true }
  const jsonLogMessageStr = grabLogMessage(log.error, msg, params)
  const jsonLogMessage = JSON.parse(jsonLogMessageStr)

  expect(is.string(jsonLogMessage.timestamp)).toBe(true)
  expect(is.date(new Date(jsonLogMessage.timestamp))).toBe(true)
  expect(is.string(jsonLogMessage.level)).toBe(true)
  expect(is.string(jsonLogMessage.msg)).toBe(true)
  expect(jsonLogMessage.level).toBe('ERROR')
  expect(jsonLogMessage.msg).toBe(msg)
  expect(jsonLogMessage.params).toMatchObject(params)
})

test('Write proper ERROR log message if params is an Error object', () => {
  const msg = 'ava-test'
  const params = new Error('Foo')
  const jsonLogMessageStr = grabLogMessage(log.error, msg, params)
  const jsonLogMessage = JSON.parse(jsonLogMessageStr)

  expect(is.string(jsonLogMessage.timestamp)).toBe(true)
  expect(is.date(new Date(jsonLogMessage.timestamp))).toBe(true)
  expect(is.string(jsonLogMessage.level)).toBe(true)
  expect(is.string(jsonLogMessage.msg)).toBe(true)
  expect(jsonLogMessage.level).toBe('ERROR')
  expect(jsonLogMessage.msg).toBe(msg)
  expect(is.object(jsonLogMessage.params)).toBe(true)
  expect(jsonLogMessage.params.isSerializeError).toBe(true)
  expect(is.string(jsonLogMessage.params.message)).toBe(true)
  expect(is.string(jsonLogMessage.params.name)).toBe(true)
  expect(is.string(jsonLogMessage.params.stack)).toBe(true)
})
