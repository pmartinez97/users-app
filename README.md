# users-app
Challenge FlyDevs

A challenge project
CRUD operations with users
RESTful APis using Node.js, Express, Mongoose.

## Features
- **Testing**: integration test using [Jest](https://jestjs.io)
- **Develop**: [Nodemon](https://nodemon.io/)
- **Dependency management**: with [Npm](https://docs.npmjs.com/about-npm/)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)

## Getting Started
### Installation

```bash
git clone https://github.com/pmartinez97/users-app.git
cd users-app
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:
```bash
cp .env.example .env
# open .env and modify the environment variables
```

### Commands

Running locally:

```bash
npm run dev
```

Running in production:

```bash
npm run prod
```

Testing:

```bash
# run all tests
npm run test
```

Linting:

```bash
# run ESLint
npm run pretest
```

### API Endpoints

List of available routes:

**User routes**:\
`POST /users/create` - create a user\
`POST /users/login` - login user\
`PUT /users/update/:userId` - update user\
`GET /users/userlist` - get all users\
`GET /users/userlist?param=value` - filter users\
`DELETE /users/delete/:userId` - delete user

## Validation

Request data is validated using [express-validator](https://express-validator.github.io). Check the [documentation](https://express-validator.github.io/docs/index.html) for more details.

## Authorization

To require authentication for certain routes, you can use the `checkAuth` middleware.

```javascript
const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const userController = require('../controllers/users');

const router = express.Router();

router.post('/users/update', checkAuth(), userController.updateUser);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the login (`POST /users/login`) endpoint. The response of these endpoints contains the JW token.

An access token is valid forever. Does not have expiration time

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

To modify the ESLint configuration, update the `.eslintrc.json` file.
