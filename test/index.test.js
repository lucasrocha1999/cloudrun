const assert = require('assert');
const path = require('path');
const supertest = require('supertest');

let request;
describe('Unit Tests', () => {
  before(() => {
    const app = require(path.join(__dirname, '..', 'index'));
    request = supertest(app);
  });

  it('Service uses the NAME override', async () => {
    process.env.NAME = 'Cloud';
    const response = await request.get('/').expect(200);
    assert.equal(response.text, 'Hello Cloud!');
  });

  it('Service uses the NAME default', async () => {
    process.env.NAME = '';
    const response = await request.get('/').expect(200);
    assert.equal(response.text, 'Hello World!');
  });
});
