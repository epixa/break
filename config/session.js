'use strict';

module.exports = {
  name: 'connect.sid',
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: null
  },
  resave: false,
  saveUninitialized: false,
  secret: 'oWfhsd$k3j2.[jN32^8cuI12oie#r31k@1nRm'/*,
  store: {
    type: 'redis',
    host: '127.0.0.1',
    port: 6379
  }*/
};
