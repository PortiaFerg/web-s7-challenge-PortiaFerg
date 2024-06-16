const yup = require('yup')

const e = {
  fullNameType: 'fullName must be a string',
  fullNameRequired: 'fullName is required',
  fullNameMin: 'fullName must be at least 3 characters',
  fullNameMax: 'fullName cannot exceed 20 characters',
  sizeRequired: 'size is required',
  sizeOptions: 'size must be one of the following values: S, M, L',
  toppingsRequired: 'toppings is required',
  toppingsType: 'toppings must be an array of IDs',
  toppingInvalid: 'topping ID invalid',
  toppingRepeated: 'topping IDs cannot be repeated',
}

const toppings = [
  { id: 1, name: 'Pepperoni' },
  { id: 2, name: 'Green Peppers' },
  { id: 3, name: 'Pineapple' },
  { id: 4, name: 'Mushrooms' },
  { id: 5, name: 'Ham' },
]

const sizes = {
  S: 'small',
  M: 'medium',
  L: 'large',
}

const pizzaSchema = yup.object().shape({
  fullName: yup.string().typeError(e.fullNameType).trim()
    .required(e.fullNameRequired).min(3, e.fullNameMin).max(20, e.fullNameMax),
  size: yup.string().oneOf(['S', 'M', 'L'], e.sizeOptions).required(e.sizeRequired).trim(),
  toppings: yup.array().typeError(e.toppingsType)
    .of(
      yup.number().typeError(e.toppingsType)
        .integer(e.toppingsType)
        .min(1, e.toppingInvalid)
        .max(5, e.toppingInvalid)
    )
    .test('is-unique', e.toppingRepeated, list => {
      if (!list) return true
      const set = new Set(list)
      return set.size === list.length
    })
})

const validatePizza = async data => {
  try {
    const valid = await pizzaSchema.validate(data)
    return [null, valid]
  } catch (err) {
    const error = err.message
    return [error, null]
  }
}

const postPizza = async pizza => {
  const [error, valid] = await validatePizza(pizza)
  if (error) return {
    status: 422,
    data: { message: error }
  }

  const result = {
    status: 201,
    data: {
      message: `Thank you for your order, ${valid.fullName}! \
Your ${sizes[valid.size]} pizza with ${valid.toppings?.length || 'no'} \
topping${valid.toppings?.length === 1 ? '' : 's'} is on the way.`,
      data: {
        size: valid.size,
        customer: valid.fullName,
      }
    }
  }
  if (valid.toppings?.length) {
    result.data.data.toppings = valid.toppings.map(id => toppings.find(top => top.id == id).name)
  }
  return result
}

module.exports = {
  postPizza,
}
