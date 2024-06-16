/*
Codegrade Setup

1- Global setup script
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get install -y nodejs; cg-jest install; npm i -g jest@29.6.4
2- Per-student setup script
mv $FIXTURES/* . && npm install
3- Levels
3A- Codegrade tests
cg-jest run -- mvpA.test.js --runInBand --forceExit
3B Learner tests
cg-jest run -- mvpB.test.js --runInBand --forceExit
4- Fixtures
mvpA.test.js
*/
import React from 'react'
import App from './frontend/components/App'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import server from './backend/mock-server'

jest.setTimeout(750) // default 5000 too long for Codegrade

const waitForOptions = { timeout: 250 }
const queryOptions = { exact: false }

const renderApp = ui => {
  window.localStorage.clear()
  window.history.pushState({}, 'Test page', '/')
  return render(ui)
}

beforeAll(() => { server.listen() })
afterAll(() => { server.close() })
beforeEach(() => { renderApp(<Router><App /></Router>) })
afterEach(() => { server.resetHandlers() })

describe('Sprint 7 Challenge Codegrade Tests', () => {
  describe('App routing', () => {
    test('[1] <App /> Renders without crashing', () => {
      // screen.debug()
    })
    test('[2] The <a>Home</a> and <a>Order</a> links navigate to "/" and "/order"', () => {
      expect(document.location.pathname).toBe('/')
      fireEvent.click(screen.getByText('Order', queryOptions))
      expect(document.location.pathname).toBe('/order')
      fireEvent.click(screen.getByText('Home', queryOptions))
      expect(document.location.pathname).toBe('/')
    })
    test('[3] Renders the <Home /> component on path "/"', () => {
      screen.getByText('Welcome to Bloom Pizza', queryOptions)
    })
    test('[4] Renders the <Form /> component on path "/order"', () => {
      fireEvent.click(screen.getByText('Order', queryOptions))
      screen.getByText('Order Your Pizza', queryOptions)
    })
    test('[5] Clicking on the pizza image navigates to "/order"', () => {
      fireEvent.click(screen.getByAltText('order-pizza'))
      expect(document.location.pathname).toBe('/order')
    })
  })
  let name, size, pepperoni, peppers, pineapple, mushrooms, ham, submit
  function getFormElements() {
    name = document.querySelector('#fullName')
    size = document.querySelector('#size')
    pepperoni = document.querySelectorAll('input[type=checkbox]')[0]
    peppers = document.querySelectorAll('input[type=checkbox]')[1]
    pineapple = document.querySelectorAll('input[type=checkbox]')[2]
    mushrooms = document.querySelectorAll('input[type=checkbox]')[3]
    ham = document.querySelectorAll('input[type=checkbox]')[4]
    submit = document.querySelector('input[type=submit]')
  }
  function getValues() { // eslint-disable-line
    return {
      name: name.value,
      size: size.value,
      pepperoni: pepperoni.checked,
      peppers: peppers.checked,
      pineapple: pineapple.checked,
      mushrooms: mushrooms.checked,
      ham: ham.checked,
      submitDisabled: submit.disabled,
    }
  }
  describe('Form submission success', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByText('Order', queryOptions))
      getFormElements()
    })
    test('[6] Successful order with no toppings renders correct message', async () => {
      await waitFor(() => {
        fireEvent.change(name, { target: { value: 'Mollusk' } })
        fireEvent.change(size, { target: { value: 'L' } })
      }, waitForOptions)
      await waitFor(() => expect(submit).toBeEnabled())
      await waitFor(() => {
        fireEvent.click(submit)
      }, waitForOptions)
      await waitFor(() => {
        screen.getByText('Thank you for your order, Mollusk!', queryOptions)
        screen.getByText('Your large pizza', queryOptions)
        screen.getByText('with no toppings', queryOptions)
      }, waitForOptions)
    })
    test('[7] Successful order with some toppings renders correct message', async () => {
      await waitFor(() => {
        fireEvent.change(name, { target: { value: 'Fish' } })
        fireEvent.change(size, { target: { value: 'S' } })
        fireEvent.click(pepperoni)
        fireEvent.click(pineapple)
        fireEvent.click(ham)
      }, waitForOptions)
      await waitFor(() => expect(submit).toBeEnabled())
      await waitFor(() => {
        fireEvent.click(submit)
      }, waitForOptions)
      await waitFor(() => {
        screen.getByText('Thank you for your order, Fish!', queryOptions)
        screen.getByText('Your small pizza', queryOptions)
        screen.getByText('with 3 toppings', queryOptions)
      }, waitForOptions)
    })
    test('[8] A successful order clears the form', async () => {
      await waitFor(() => {
        fireEvent.change(name, { target: { value: 'Fish' } })
        fireEvent.change(size, { target: { value: 'S' } })
      }, waitForOptions)
      await waitFor(() => expect(submit).toBeEnabled())
      await waitFor(() => {
        fireEvent.click(submit)
      }, waitForOptions)
      await waitFor(() => {
        screen.getByText('Thank you', queryOptions)
      }, waitForOptions)
      await waitFor(() => {
        expect(name.value).toBeFalsy()
        expect(size.value).toBeFalsy()
        expect(pepperoni.checked).toBeFalsy()
        expect(peppers.checked).toBeFalsy()
        expect(pineapple.checked).toBeFalsy()
        expect(mushrooms.checked).toBeFalsy()
        expect(ham.checked).toBeFalsy()
      })
    })
  })
  describe('Form validation', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByText('Order', queryOptions))
      getFormElements()
    })
    test('[9] Submit only enables if `fullName` and `size` pass validation', async () => {
      expect(submit).toBeDisabled() // initial state
      await waitFor(() => {
        fireEvent.change(name, { target: { value: '123' } })
        fireEvent.change(size, { target: { value: 'S' } })
      }, waitForOptions)
      await waitFor(() => expect(submit).toBeEnabled())

      await waitFor(() => {
        fireEvent.change(name, { target: { value: '12' } }) // BAD VALUE
        fireEvent.change(size, { target: { value: 'S' } })
      }, waitForOptions)
      await waitFor(() => expect(submit).toBeDisabled())

      await waitFor(() => {
        fireEvent.change(name, { target: { value: '123' } })
        fireEvent.change(size, { target: { value: 'M' } })
      }, waitForOptions)
      await waitFor(() => expect(submit).toBeEnabled())

      await waitFor(() => {
        fireEvent.change(name, { target: { value: '123' } })
        fireEvent.change(size, { target: { value: 'X' } }) // BAD VALUE
      }, waitForOptions)
      await waitFor(() => expect(submit).toBeDisabled())

      await waitFor(() => {
        fireEvent.change(name, { target: { value: '123' } })
        fireEvent.change(size, { target: { value: 'L' } })
      }, waitForOptions)
      await waitFor(() => expect(submit).toBeEnabled())
    })
    test('[10] Validation of `fullName` renders correct error message', async () => {
      const validationError = 'full name must be at least 3 characters'

      await waitFor(() => {
        fireEvent.change(name, { target: { value: '1' } }) // BAD VALUE
      }, waitForOptions)
      await waitFor(() => screen.getByText(validationError, queryOptions))

      await waitFor(() => {
        fireEvent.change(name, { target: { value: '123' } })
      }, waitForOptions)
      await waitFor(() => {
        expect(screen.queryByText(validationError, queryOptions)).not.toBeInTheDocument()
      }, waitForOptions)

      await waitFor(() => {
        fireEvent.change(name, { target: { value: '  12  ' } }) // BAD VALUE (trying to fool validation with whitespace)
      }, waitForOptions)
      await waitFor(() => screen.getByText(validationError, queryOptions))

      await waitFor(() => {
        fireEvent.change(name, { target: { value: '1234' } })
      }, waitForOptions)
      await waitFor(() => {
        expect(screen.queryByText(validationError, queryOptions)).not.toBeInTheDocument()
      }, waitForOptions)
    })
    test('[11] Validation of `size` renders correct error message', async () => {
      const validationError = 'size must be S or M or L'

      await waitFor(() => {
        fireEvent.change(size, { target: { value: 'S' } })
      }, waitForOptions)
      await waitFor(() => {
        expect(screen.queryByText(validationError, queryOptions)).not.toBeInTheDocument()
      }, waitForOptions)

      await waitFor(() => {
        fireEvent.change(size, { target: { value: '' } }) // BAD VALUE
      }, waitForOptions)
      await waitFor(() => screen.getByText(validationError, queryOptions))

      await waitFor(() => {
        fireEvent.change(size, { target: { value: 'M' } })
      }, waitForOptions)
      await waitFor(() => {
        expect(screen.queryByText(validationError, queryOptions)).not.toBeInTheDocument()
      }, waitForOptions)

      await waitFor(() => {
        fireEvent.change(size, { target: { value: 'X' } }) // BAD VALUE
      }, waitForOptions)
      await waitFor(() => screen.getByText(validationError, queryOptions))

      await waitFor(() => {
        fireEvent.change(size, { target: { value: 'L' } })
      }, waitForOptions)
      await waitFor(() => {
        expect(screen.queryByText(validationError, queryOptions)).not.toBeInTheDocument()
      }, waitForOptions)
    })
  })
})
