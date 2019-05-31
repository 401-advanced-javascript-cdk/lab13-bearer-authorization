## Lab 13 - Bearer Authorization
Implements Bearer authorization tokens and routes that use them.
### Author: Chris Kozlowski

### Links and Resources
* [Submission PR](https://github.com/401-advanced-javascript-cdk/lab13-bearer-authorization/pull/1)
* [Travis](https://travis-ci.com/401-advanced-javascript-cdk/lab13-bearer-authorization)
* [Heroku Deployment](https://lab13-bearer-auth.herokuapp.com/)

### Modules
#### `auth/router.js`
Added `/key` route for obtaining a key token that does not expire
#### `auth/middleware.js`
Updated to also accept bearer authorization header.
#### `auth/users-model.js`
Contains methods for verifying token integrity, supplying or consuming timed tokens, and supplying unexpiring token keys.

#### Operation
Users that sign up on the `/signup` route will receive a response with a single-use token attached.  The user's token will expire after 15 minutes.  With this token in the Authorization header, the user can now access the `/key` route, which will provide an unexpiring key token.  After using the original token to reach any route, that token can no longer be used.  

#### Testing
`npm test`