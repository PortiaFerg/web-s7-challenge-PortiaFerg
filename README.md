# Sprint 7 Challenge

## Introduction

Welcome to Sprint 7 Challenge! In this project, you will demonstrate your ability using React Router, creating forms with proper validation, and testing React components.

Your main goal is to implement a form that handles a pizza order, validates user input, and POSTs the order to the backend. Your next goal will be to demonstrate basic ability testing functions and components.

To successfully complete this project, you will need the following technical knowledge:

1. **React Router**, to render different components depending on the path.
2. **Forms in React**, to track the values entered by the user.
3. **Input types** like text, checkboxes and dropdowns.
4. **Form Validation** using Yup, to help the user fill out the form correctly.
5. **Testing** components using Jest and React Testing Library.

Additionally, the following soft skills will greatly impact your performance:

1. Attention to detail. Make sure there isn't a single character out of place!
1. Perseverance. Keep trying until you figure it out!
1. Patience. Make sure to read the entire README for important information.

## Instructions

You have been given a take-home coding assessment as part of the hiring process for a Web Developer position. Your task is to implement basic routing for a home-delivery pizza site and create a form to take pizza orders.

### 💾 Setup

**Here are the steps to set up this project:**

1. **Clone this repository** to your computer.
2. Within your terminal, navigate to the project folder **and execute `npm i`**.
3. After successful installation **execute `npm run dev`**.
4. Run tests locally **executing `npm test`**.
5. Load the app in Chrome by **navigating to `http://localhost:3003`**.

**❗ Note:** On the event of NPM errors during setup, delete the `node_modules` folder and the `package-lock.json` file, and retry `npm i` and `npm run dev`.

### 🥷 Tasks

#### 👉 TASK 1 - Study the mock site

Your fully-functional **design mock** is <https://bloominstituteoftechnology.github.io/W_S7_Challenge/>

Study it using Chrome Dev Tools, paying special attention to the Elements tab.

Your finished product will have to match the functionality of the design exactly.

#### 👉 TASK 2 - Study the pizza order endpoint

Study with Postman the following endpoint: `[POST] http://localhost:9009/api/order`

Here is an example of a **valid** request payload:

```js
{ "fullName": "Jane Doe", "size": "L", "toppings": ["1","2","3","4","5"] }
```

**❗ Endpoint notes:**

- `fullName` is required and must have min length of 3 chars, and max length of 20 chars.
- `fullName` length requirement ignores whitespace padding (E.G. " x " is _not_ valid as the server will trim whitespace and count its length as 1).
- `size` is required and only has three possible values: "S", "M" or "L".
- The `toppings` array is optional and can only contain valid topping IDs:
  - "1" or 1 means Pepperoni
  - "2" or 2 means Green Peppers
  - "3" or 3 means Pineapple
  - "4" or 4 means Mushrooms
  - "5" or 5 means Ham

Here are more **valid** payloads (test in Postman!):

```js
{"fullName": "Jane Doe", "size": "S", "toppings": [2,"3",1]}
{"fullName": "Jane Doe", "size": "M", "toppings": []}
{"fullName": "Jane Doe", "size": "L"}
```

Here are some **invalid** payloads (test in Postman!):

```js
{ "fullName": "   X   ", "size": "S" }
{ "fullName": "Jane Doe", "size": "X" }
{ "fullName": "Jane Doe", "size": "L", "toppings": ["1","1",6] }
```

#### 👉 TASK 3 - Set up routing for the project

**Inside the [index.js](frontend/index.js) module:**

- Wrap the `<App />` element using `BrowserRouter` from React Router.

**Inside the [App.js](./frontend/components/App.js) module:**

- Inside the `nav`, render two `NavLinks`:
    1. One with text content **Home** that navigates to "/".
    2. One with text content **Order** that navigates to "/order".

- Below the `nav`, render a `Routes` element containing two `Route` elements:
    1. When the path is "/" it renders `<Home />`.
    2. When the path is "/order" it renders `<Form />`.

**Inside the [Home.js](./frontend/components/Home.js) module:**

- Create a click handler so that clicking on the image navigates the user to "/order".

#### 👉 TASK 4 - Create a form to submit pizza orders

**Continue inside the [Form.js](./frontend/components/Form.js) module.**

#### 👉 TASK 5 - Write unit tests and integration tests

**Continue inside the [mvpB.test.js](./mvpB.test.js) module.**

### 📝 Notes on grading and troubleshooting tests

- This assignment is graded by running the tests in the `mvpA.test.js` and `mvpB.tests.js` modules.

- You can run the same tests by executing `npm test`.

- The tests depend on being able to locate some crucial elements on the page:
  - The **text input** is located using `#fullName` CSS selector. Do not delete this id from the JSX.
  - The **dropdown** is located using `#size`. Do not delete this id from the JSX.
  - The **checkboxes** are located using `input[type=checkbox]`. Render only the checkboxes you see in the mock, in the same order.
  - The **submit input** is located using `input[type=submit]`. Do not convert it into a button.
  - The **success message** from the server is located by its text content.
  - The **validation errors** are located by their text content.
  - The **pizza image** is located by its alt text "order-pizza".

Also **do not create accidental duplicates** of elements:

```js
// this FAILS if more than one element on the page has the text content "hurrah"
const element = screen.queryByText('hurrah')
```

## FAQ

<details>
  <summary>I feel very stuck. What can I do?</summary>

Do not struggle for an unreasonable amount of time! Request support via one of the available channels.

</details>

<details>
  <summary>How do I run tests against my code?</summary>

Run `npm test`. Note that Codegrade will run your code against its own copy of the `mvpA.test.js` test file.

</details>

<details>
  <summary>I believe my code is correct and the test is wrong. What can I do?</summary>

On occasion the test runner will get stuck. Use CTRL-C to kill the tests, and then `npm test` to launch them again. Try to reproduce the problem the test is complaining about by interacting with the site in Chrome, and do not code "to make the test happy". Code so that **your app does exactly what the mock does**. The tests are there for confirmation. Although it's possible that a particular test be flawed, it's more likely that the bug is in your own code. If the problem persists, please request assistance from Staff.

</details>

<details>
  <summary>The terminal output of the tests is just too overwhelming! What can I do?</summary>

If you need to disable all tests except the one you are focusing on, edit the test file and, as an example, change `test('👉 focus on this', () => { etc })` to be `test.only('👉 focus on this', () => { etc })`. (Note the "only".) This won't affect Codegrade, because Codegrade runs its own version of the tests. Keep in mind though, if there is a syntax problem with your code that is causing an error to be thrown, all tests will fail.

</details>

<details>
  <summary>I am getting errors when I run npm install. What is going on?</summary>

This project requires Node to be correctly installed on your computer to work. Try deleting `node_modules` and running `npm install`. If that fails, try deleting both `node_modules` and `package-lock.json` before reinstalling. If all fails, please request support!

</details>

<details>
  <summary>Do I need to install extra libraries with NPM?</summary>

No. Everything you need should be installed already, including Yup, Axios and React Testing Library.

</details>

<details>
  <summary>Can I edit the styles?</summary>

Of course! Have at it. But solve the challenge first, and then careful not to break any tests!

</details>

<details>
  <summary>My page does not work! How do I debug it?</summary>

With React, it's very important that we use the React Dev Tools to monitor the state of our components as we interact with the App. If the state is not adjusting like it should, that's one situation. If the state does change correctly but the UI does not respond, that's a different problem.

If your code has a syntax problem, the app will print error messages in the console. Focus on the first message. Place console logs right before the crash site and see if your variables contain the data you think they do. Comment out chunks of code until you get the app to compile!

</details>

<details>
  <summary>I messed up and want to start over! How do I do that?</summary>

**Do NOT delete your repository from GitHub!** Instead, commit frequently as you work. Make a commit whenever you achieve anything and the app isn't crashing in Chrome. This in practice creates restore points you can use should you wreak havoc with your app. If you find yourself in a mess, use git reset --hard to simply discard all changes to your code since your last commit.

</details>

**Project created with [@bloomtools/react@0.1.10](https://github.com/bloominstituteoftechnology/npm-tools-react) and Node v18.17.1 on Tue, August 22, 2023 at 04:09 PM**
