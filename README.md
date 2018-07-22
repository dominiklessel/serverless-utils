# @dominiklessel/serverless-utils
> Opinionated utils for serverless applications.

[![npm](https://img.shields.io/npm/v/@dominiklessel/serverless-utils.svg)](https://www.npmjs.com/package/@dominiklessel/serverless-utils)

Intended to be used with [AWS Lambda](https://aws.amazon.com/lambda/) and [AWS API Gateway](https://aws.amazon.com/api-gateway/).

## Usage

```js
// Modules
const boom = require('boom')
const { setRequestContext, parseParams, sendRes } = require('@dominiklessel/serverless-utils')
const joi = require('joi')

// Config
const cors = true
const callbackWaitsForEmptyEventLoop = false

// Schemas
const pathParamsSchema = joi.object().keys({
  idFoo: joi.number().required()
})

const queryParamsSchema = joi.object().keys({
  fields: joi.string().allow('').default('*')
})

const bodySchema = joi.object().keys({
  buz: joi.string().allow('').default(null)
})

module.exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = callbackWaitsForEmptyEventLoop
  setRequestContext(event, context)

  const {
    err,
    pathParams: {
      idFoo
    } = {},
    queryStringParams: {
      fields
    } = {},
    body
  } = parseParams(event, { pathParamsSchema, queryParamsSchema, bodySchema })

  if (err) {
    return sendRes({ body: boom.badRequest(err.details[0].message), cors }, callback)
  }

  // Send body back …
  sendRes({ body, cors }, callback)
}
```

## API

### `sendRes(options, handlerCallback)`

Sends an [AWS API Gateway integration response](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-integration-settings-integration-response.html). If `body` is a [boom-object](https://github.com/hapijs/boom), the correct status code is automatically set and AWS API Gateway can send the appropriate HTTP status code.

#### options

*Required*<br/>
Type: `Object`

##### statusCode

Type: `Number`<br/>
Default: `200`

##### headers

Type: `Object`<br/>
Default: `{}`

##### body

Type: `Object`<br/>
Default: `null`

##### cors

Type: `Boolean`<br/>
Default: `false`

#### handlerCallback

*Required*<br/>
Type: `Function`

AWS Lambda handler callback

### `parseParams(lambdaHttpEvent, schemas)`

Parse an AWS Lambda HTTP event

#### lambdaHttpEvent

*Required*<br/>
Type: `Object`

AWS Lambda HTTP event

#### schemas

Type: `Object`

##### queryParamsSchema

Type: `Joi Schema`<br/>
Default: `joi.object().empty({})`

##### pathParamsSchema

Type: `Joi Schema`<br/>
Default: `joi.object().empty({})`

##### bodySchema

Type: `Joi Schema`<br/>
Default: `joi.object().empty({})`

### `setRequestContext(lambaEvent, lambaContext)`

Initializes the request context, which is necessary for proper logging.

### `log.debug(msg, params)`<br/>`log.info(msg, params)`<br/>`log.warn(msg, params)`<br/>`log.error(msg, params)`

Structured Logging Helper

#### msg

*Required*<br/>
Type: `String`

#### params

Type: `Object` or `Error`  
Default: `{}`

## License

This project is licensed under the terms of the MIT license.
