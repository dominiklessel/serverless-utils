
// Modules
const is = require('@sindresorhus/is')
const serializeError = require('serialize-error')
const reqContext = require('./requestContext')

// Helpers
const isDebugEnabled = () => process.env.DEBUG_LOG === 'true' || reqContext.get()['Debug-Log-Enabled'] === 'true'

// Log
const log = (level, msg, params = {}) => {
  if (level === 'DEBUG' && !isDebugEnabled()) {
    return
  }

  const now = new Date()
  const timestamp = now.toISOString()
  const logMsg = Object.assign({ timestamp }, reqContext.get(), {
    level,
    msg,
    params: is.error(params) ? Object.assign({ isSerializeError: true }, serializeError(params)) : params
  })

  console.log(JSON.stringify(logMsg))
}

// Export
module.exports = {
  log,
  debug: (msg, params = {}) => log('DEBUG', msg, params),
  info: (msg, params = {}) => log('INFO', msg, params),
  warn: (msg, params = {}) => log('WARN', msg, params),
  error: (msg, params = {}) => log('ERROR', msg, params)
}
