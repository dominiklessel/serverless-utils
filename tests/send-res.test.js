
// Modules
const boom = require('boom')
const is = require('@sindresorhus/is')
const { sendRes } = require('../lib')

// Tests
test('Send proper empty response', (done) => {
  const body = null

  sendRes({ body }, (err, res) => {
    expect(err).toBeNull()
    expect(is(res)).toBe('Object')
    expect(is(res.statusCode)).toBe('number')
    expect(is(res.headers)).toBe('Object')
    expect(is(res.body)).toBe('string')
    expect(res.statusCode).toBe(200)
    expect(res.headers).toMatchObject({})
    expect(res.body).toBe('{"statusCode":200}')

    done()
  })
})

test('Send proper response', (done) => {
  const body = { status: 'success' }

  sendRes({ body }, (err, res) => {
    expect(err).toBeNull()
    expect(is(res)).toBe('Object')
    expect(is(res.statusCode)).toBe('number')
    expect(is(res.headers)).toBe('Object')
    expect(is(res.body)).toBe('string')
    expect(res.statusCode).toBe(200)
    expect(res.headers).toMatchObject({})
    expect(res.body).toBe('{"statusCode":200,"status":"success"}')

    done()
  })
})

test('Send proper response with CORS enabled', (done) => {
  const body = { status: 'success' }
  const cors = true

  sendRes({ body, cors }, (err, res) => {
    expect(err).toBeNull()
    expect(is(res)).toBe('Object')
    expect(is(res.statusCode)).toBe('number')
    expect(is(res.headers)).toBe('Object')
    expect(is(res.body)).toBe('string')
    expect(res.statusCode).toBe(200)
    expect(res.headers).toMatchObject({ 'Access-Control-Allow-Origin': '*' })
    expect(res.body).toBe('{"statusCode":200,"status":"success"}')

    done()
  })
})

test('Send proper error', (done) => {
  const body = boom.badImplementation()

  sendRes({ body }, (err, res) => {
    expect(err).toBeNull()
    expect(is(res)).toBe('Object')
    expect(is(res.statusCode)).toBe('number')
    expect(is(res.headers)).toBe('Object')
    expect(is(res.body)).toBe('string')
    expect(res.statusCode).toBe(500)
    expect(res.headers).toMatchObject({})
    expect(res.body).toBe('{"statusCode":500,"error":"Internal Server Error","message":"An internal server error occurred"}')

    done()
  })
})
