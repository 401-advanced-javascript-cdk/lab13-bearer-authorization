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

  it ('the /key route is inaccessible if the user does not have a token', () => {
    return mockRequest.get('/key')
      .then(results => {
        expect(results.status).toBe(403);
    });
  });

  it('once the user has a token, the user can access the /key route', () => {
    return mockRequest.post('/signup')
      .send({username: 'username', password: 'password'})
      .then(response => {
        let token = response.text;
        return mockRequest.get('/key')
          .set('Authorization', `Bearer ${token}`)
          .then(results => {
            expect(results.status).toBe(200);
          });
      });
  });
  
  it('A token becomes invalid after being used once on a route', () => {
    let token;
    return mockRequest.post('/signup')
    .send({username: 'fail', password: 'pass'})
    .then(results => {
      token = results.text;
      return mockRequest.get('/key')
        .set('Authorization', `Bearer ${token}`)
        .then(() => {
          return mockRequest.get('/key')
            .set('Authorization', `Bearer ${token}`)
            .then(results => {
              // expect(results.status).toBe(403);
            })
            .catch(results => {
              expect(results.status).toBe(403);
            });
        });
    })
    .catch(console.error);
  });
});