import request from 'request';
import errorList from './SmsPilotClientErrors';

export default class SmsPilotClient {
  constructor(options = {}) {
    this.apikey = options.apikey ||
      'XXXXXXXXXXXXYYYYYYYYYYYYZZZZZZZZXXXXXXXXXXXXYYYYYYYYYYYYZZZZZZZZ';
    this.from = options.from || 'INFORM';
    this.test = options.test || false;
    this.url = 'https://smspilot.ru/api2.php';
  }

  makeQuery(to, text) {
    const q = {
      apikey: this.apikey,
      test: this.test ? 1 : 0,
      send: [{
        from: this.from,
        to,
        text: text
      }]
    };
    return { json: JSON.stringify(q) };
  }

  parseResponseBody(body) {
    return JSON.parse(body);
  }

  send(to, text) {
    return new Promise((resolve, reject) => {
      request.get({ url: this.url, qs: this.makeQuery(to, text) }, (err, response, body) => {
        if (err) {
          reject(err);
        } else if (response.statusCode !== 200) {
          reject(`Http request error: ${response.statusCode}`);
        } else {
          resolve(this.parseResponseBody(body));
        }
      });
    });
  }

  humanizeError(code) {
    return errorList[code];
  }
};
