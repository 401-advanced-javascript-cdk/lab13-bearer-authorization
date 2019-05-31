## Lab 13 - Bearer Authorization
Implements Bearer authorization tokens
### Author: Chris Kozlowski

### Links and Resources
* [Submission PR](https://github.com/401-advanced-javascript-cdk/lab11-authentication/pull/1)
* [Travis](https://travis-ci.com/401-advanced-javascript-cdk/lab11-authentication)
* [Heroku Deployment](https://lab11-authentication.herokuapp.com/)

### Modules
#### `auth/router.js`
Contains routes to test authorization with bearer token.
#### `auth/middleware.js`
Updated to also accept bearer authorization header.
#### `auth/users-model.js`
Contains methods for verifying token integrity and for supplying timed tokens or unexpiring token keys.

#### Operation
Users that sign up on the `/signup` route will receive a response with a token attached.  With this token in the Authorization header, the user can now access the `/test-token` route.  The user's token will expire after 15 minuets.  If the user signs up with the role of 'admin', they will be assigned a token key with no expiration date.  They will also have access to the `key` route.  Non-admins will receive a 403 Forbidden status on this route.

#### Testing
`npm test`