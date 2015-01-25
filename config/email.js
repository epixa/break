'use strict';

module.exports = {
  meta: {
    from: 'Break <no-reply@example.com>'
  },
  transport: {
    name: 'smtp',
    host: '127.0.0.1',
    port: '1025'
  }/*,
  transport: {
    name: 'ses',
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    rateLimit: 1 // no more than 1 message per second
  }*/
};
