import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('Full name is required'),
  size: yup
    .string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('Size is required'),
  toppings: yup
    .array()
    .of(yup.string().oneOf(['1', '2', '3', '4', '5']))
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
  const [formState, setFormState] = useState({
    fullName: '',
    size: '',
    toppings: []
  });
  const [errors, setErrors] = useState({});
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      setSubmitDisabled(!valid);
    });
  }, [formState]);

  const validateChange = (name, value) => {
    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({ ...errors, [name]: '' });
      })
      .catch(err => {
        setErrors({ ...errors, [name]: err.errors[0] });
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (type === 'checkbox') {
      const newToppings = formState.toppings.includes(value) 
        ? formState.toppings.filter(t => t !== value) 
        : [...formState.toppings, value];
      setFormState({ ...formState, toppings: newToppings });
      validateChange('toppings', newToppings);
    } else {
      setFormState({ ...formState, [name]: newValue });
      validateChange(name, newValue);
    }
  };
  function getToppingNames(toppingIds) {
    return toppingIds.map(id => toppings.find(topping => topping.topping_id === id).text);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:9009/api/order', formState)
      .then(response => {
        console.log('Order submitted successfully', response);
        const toppingNames = getToppingNames(formState.toppings);
        setSuccess(response.data.message)
        setFailure(false);
        setFormState({
          fullName: '',
          size: '',
          toppings: []
        });
      })
      .catch(error => {
        console.error('There was an error submitting the order!', error);
        setSuccess(false);
        setFailure(true);
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
    {success && <div className='success'>{success} </div>}
      {failure && <div className='failure'>Something went wrong. Please try again.</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            name="fullName"
            value={formState.fullName}
            onChange={handleChange}
          />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName} </div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" value={formState.size} onChange={handleChange} >
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size} </div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              name="toppings"
              value={topping.topping_id}
              checked={formState.toppings.includes(topping.topping_id)}
              onChange={handleChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={submitDisabled} value="Submit Order" />
    </form>
  )
}
