
// Modules
const joi = require('joi')
const log = require('./log')
const reqContext = require('./requestContext')

// Config
const emptySchema = joi.object().empty({})

// parseParams
const parseParams = (event, { queryParamsSchema = emptySchema, pathParamsSchema = emptySchema, bodySchema = emptySchema, headersSchema = emptySchema } = {}) => {
  const queryStringParams = event.queryStringParameters || {}
  const pathParams = event.pathParameters || {}
  const bodyStr = event.body || '{}'
  const headers = event.headers || {}
  let bodyParams = null

  try {
    bodyParams = JSON.parse(bodyStr)
  } catch (err) {
    return {
      err,
      headers: {},
      queryStringParams: {},
      pathParams: {},
      body: {}
    }
  }

  const { error: errHeaders, value: valueHeaders = {} } = joi.validate(headers, headersSchema)
  const { error: errQuery, value: valueQuery = {} } = joi.validate(queryStringParams, queryParamsSchema)
  const { error: errPath, value: valuePath = {} } = joi.validate(pathParams, pathParamsSchema)
  const { error: errBody, value: valueBody = {} } = joi.validate(bodyParams, bodySchema)

  return {
    err: errHeaders || errQuery || errPath || errBody,
    headers: valueHeaders,
    queryStringParams: valueQuery,
    pathParams: valuePath,
    body: valueBody
  }
}

// sendRes
const sendRes = ({ statusCode = 200, headers = {}, body = null, cors = false } = {}, callback) => {
  if (cors) {
    headers['Access-Control-Allow-Origin'] = '*'
  }

  if (!body) {
    return callback(null, {
      statusCode,
      headers,
      body: JSON.stringify({ statusCode })
    })
  }

  if (body.isBoom) {
    const { output: { statusCode, payload } } = body
    return callback(null, {
      statusCode,
      headers,
      body: JSON.stringify(payload)
    })
  }

  return callback(null, {
    statusCode,
    headers,
    body: JSON.stringify(Object.assign({ statusCode }, body))
  })
}

// setRequestContext
const setRequestContext = (event = {}, context = {}) => {
  const { awsRequestId = 'n/a' } = context
  const headers = event.headers || {}
  const requestContextObj = { awsRequestId }

  // Find all x-correlation-* headers
  Object.keys(headers).forEach((key) => {
    if (key.startsWith('x-correlation-')) {
      requestContextObj[key] = headers[key]
    }
  })

  // Set default x-correlation-id if missing
  if (!requestContextObj['x-correlation-id']) {
    requestContextObj['x-correlation-id'] = awsRequestId
  }

  reqContext.replaceAllWith(requestContextObj)
}

module.exports = {
  reqContext,
  setRequestContext,
  log,
  parseParams,
  sendRes
}
