import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Form from './Form'; // Make sure to adjust the import path as needed

jest.mock('axios');

// Tests for the sum function
describe('sum function', () => {
  test('throws an error when no arguments are passed', () => {
    expect(() => sum()).toThrow('pass valid numbers');
  });

  test('throws an error when a non-number string is passed', () => {
    expect(() => sum(2, 'seven')).toThrow('pass valid numbers');
  });

  test('returns the correct sum when valid numbers are passed', () => {
    expect(sum(1, 3)).toBe(4);
    expect(sum('1', 2)).toBe(3);
    expect(sum('10', '3')).toBe(13);
  });
});

// Tests for the HelloWorld component
describe('<HelloWorld /> component', () => {
  beforeEach(() => {
    render(<HelloWorld />);
  });

  test('renders a link that reads "Home"', () => {
    const homeLink = screen.queryByText('Home');
    expect(homeLink).toBeInTheDocument();
  });

  test('renders a link that reads "About"', () => {
    const aboutLink = screen.queryByText('About');
    expect(aboutLink).toBeInTheDocument();
  });

  test('renders a link that reads "Blog"', () => {
    const blogLink = screen.queryByText('Blog');
    expect(blogLink).toBeInTheDocument();
  });

  test('renders a text that reads "The Truth"', () => {
    const truthText = screen.queryByText('The Truth');
    expect(truthText).toBeInTheDocument();
  });

  test('renders a text that reads "JavaScript is pretty awesome"', () => {
    const jsText = screen.queryByText('JavaScript is pretty awesome');
    expect(jsText).toBeInTheDocument();
  });

  test('renders a text that includes "javaScript is pretty" (case-insensitive)', () => {
    const jsPartialText = screen.queryByText('javaScript is pretty', { exact: false });
    expect(jsPartialText).toBeInTheDocument();
  });
});

// Tests for the Form component
describe('<Form /> component', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({});
    render(<Form />);
  });

  test('successfully submits an order with no toppings and clears the form', async () => {
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Size/i), { target: { value: 'M' } });

    fireEvent.click(screen.getByText(/Submit Order/i));

    await waitFor(() => {
      expect(screen.getByText(/Thank you for your order with no toppings!/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Size/i)).toHaveValue('');
  });

  test('successfully submits an order with some toppings and clears the form', async () => {
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Size/i), { target: { value: 'L' } });

    fireEvent.click(screen.getByLabelText(/Pepperoni/i));
    fireEvent.click(screen.getByLabelText(/Mushrooms/i));

    fireEvent.click(screen.getByText(/Submit Order/i));

    await waitFor(() => {
      expect(screen.getByText(/Thank you for your order with toppings!/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Size/i)).toHaveValue('');
    expect(screen.getByLabelText(/Pepperoni/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Mushrooms/i)).not.toBeChecked();
  });
});

// sum function implementation
function sum(a, b) {
  a = Number(a);
  b = Number(b);
  if (isNaN(a) || isNaN(b)) {
    throw new Error('pass valid numbers');
  }
  return a + b;
}

// HelloWorld component implementation
function HelloWorld() {
  return (
    <div>
      <h1>Hello World Component</h1>
      <nav>
        <a href='#'>Home</a>
        <a href='#'>About</a>
        <a href='#'>Blog</a>
      </nav>
      <main>
        <section>
          <h2>The Truth</h2>
          <p>JavaScript is pretty awesome</p>
        </section>
      </main>
    </div>
  );
}