const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const config = require('./config');
const controllers = require('./controllers');

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + config.MONGO_URL);
});

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

mongoose.Promise = Promise;
mongoose.connect(config.MONGO_URL);

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
config.IS_PRODUCTION || app.use(morgan('tiny'));

controllers.handle(app);

app.listen(config.PORT, config.IP, () => {
    console.log(`Express listens ${config.IP}:${config.PORT}`);
});
