import { handler } from '../index';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('app-assets', () => {
  describe('index', () => {
    describe('handler', () => {
      // FIXME: don't lie; use a fixture
      let event = {} as APIGatewayProxyEvent;

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

      it('returns "Hello, Jeff" in body when name=Jeff is passed in query string', async done => {
        event = Object.assign({}, event, {
          queryStringParameters: {
            name: 'Jeff'
          }
        });
        const response = await handler(event);
        expect(response.body).toEqual('"Hello, Jeff"');
        done();
      });
    });
  });
});
