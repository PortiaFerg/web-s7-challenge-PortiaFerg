const { setupServer } = require('msw/node')
const { rest } = require('msw')
const Pizza = require('./helpers')

async function postPizza(req, res, ctx) {
  const { status, data } = await Pizza.postPizza(req.body)
  return res(
    ctx.status(status),
    ctx.json(data),
  )
}

const handlers = [
  rest.post('http://localhost:9009/api/order', postPizza),
  rest.post('https://webapis.bloomtechdev.com/pizza/order', postPizza),
]

module.exports = setupServer(...handlers)
