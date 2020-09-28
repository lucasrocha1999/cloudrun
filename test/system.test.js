const assert = require('assert');
const request = require('got');
const {resolve} = require('url');

const get = (route, base_url) => {
  const {ID_TOKEN} = process.env;
  if (!ID_TOKEN) {
    throw Error('"ID_TOKEN" environment variable is required.');
  }

  return request(resolve(base_url.trim(), route), {
    headers: {
      Authorization: `Bearer ${ID_TOKEN.trim()}`,
    },
    throwHttpErrors: false,
  });
};

describe('End-to-End Tests', () => {
  const {NAME} = process.env;
  if (!NAME) {
    throw Error('"NAME" environment variable is required. For example: Cosmos');
  }

  describe('Service relying on defaults', () => {
    const {BASE_URL} = process.env;
    if (!BASE_URL) {
      throw Error(
        '"BASE_URL" environment variable is required. For example: https://service-x8xabcdefg-uc.a.run.app'
      );
    }

    it('Service uses the NAME override', async () => {
      const response = await get('/', BASE_URL);
      assert.strictEqual(
        response.statusCode,
        200,
        'Did not fallback to default as expected'
      );
      assert.strictEqual(
        response.body,
        `Hello ${NAME}!`,
        `Expected override "${NAME}" not found`
      );
    });
  });
});
