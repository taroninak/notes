const api = require('./api');
const web = require('./web');

exports.handle = (app) => {
    api.handle(app);
    web.handle(app);
}
