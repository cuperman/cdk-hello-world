import { handler } from '../index';
import ApiGatewayProxyEvent = require('../../../__fixtures__/api_gateway_proxy_event');

describe('app-asset', () => {
  describe('index', () => {
    describe('handler', () => {
      let event = ApiGatewayProxyEvent;

      it('returns status code 200', async done => {
        const response = await handler(event);
        expect(response.statusCode).toEqual(200);
        done();
      });

      it('returns "Hello, World" in body by default', async done => {
        const response = await handler(event);
        expect(response.body).toEqual('"Hello, World"');
        done();
      });

      describe('with query string name=Jeff', () => {
        beforeEach(() => {
          event = Object.assign({}, ApiGatewayProxyEvent, {
            queryStringParameters: {
              name: 'Jeff'
            }
          });
        });

        it('returns "Hello, Jeff" in body when name=Jeff is passed in query string', async done => {
          const response = await handler(event);
          expect(response.body).toEqual('"Hello, Jeff"');
          done();
        });
      });
    });
  });
});
