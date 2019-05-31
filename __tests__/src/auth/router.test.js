'use strict';

process.env.SECRET='test';

const jwt = require('jsonwebtoken');

const server = require('../../../src/app.js').server;
const supergoose = require('../../supergoose.js');

const mockRequest = supergoose.server(server);

let users = {
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('Auth Router', () => {
  
  Object.keys(users).forEach( userType => {
    
    describe(`${userType} users`, () => {
      
      let encodedToken;
      let id;
      
      it('can create one', () => {
        return mockRequest.post('/signup')
          .send(users[userType])
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            id = token.id;
            encodedToken = results.text;
            expect(token.id).toBeDefined();
          });
      });

      it('can signin with basic', () => {
        return mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            expect(token.id).toEqual(id);
          });
      });

    });
    
  });

  it('once the user has a token, the user can access the /test-token route', () => {
    let req = {};
    let res = {};
    let next = jest.fn();
    let middleware = auth;
    mockRequest.get('/test-token')
    .then(results => {
      expect(results.body).toBe('Forbidden');
    })
    .then(
      mockRequest.post('/signin')
        .auth('a_user', 'a_password')
      )
    .then(response => {
      let token = response.body;
      return mockRequest.get('/test-token')
        .set('Authorization', `Bearer ${token}`)
        .then(results => {
          expect(results.status).toBe(200);
        });
    });
  });
});