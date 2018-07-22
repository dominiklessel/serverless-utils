
// Helpers
const clearAll = () => {
  global.REQ_CONTEXT = undefined
}

const replaceAllWith = (ctx) => {
  global.REQ_CONTEXT = ctx
}

const set = (aKey, value) => {
  const key = aKey.startsWith('x-correlation-') ? aKey : `x-correlation-${aKey}`

  if (!global.REQ_CONTEXT) {
    global.REQ_CONTEXT = {}
  }

  global.REQ_CONTEXT[key] = value
}

const get = () => global.REQ_CONTEXT || {}

// Export
module.exports = {
  clearAll,
  replaceAllWith,
  set,
  get
}
