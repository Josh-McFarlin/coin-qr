const next = require('next');
const express = require('express');
const shortid = require('shortid-extend');
var helmet = require('helmet');

const routes = require('./src/utils/routes');


const nextApp = next({
    dev: process.env.NODE_ENV !== 'production'
});

const handler = routes.getRequestHandler(nextApp);

nextApp.prepare().then(() => {
    const server = express();
    server.use(helmet());

    shortid.config({
        disableDefaultAlphabetLength: true,
        disableDefaultIdLength: true,
        idLength: 6
    });

    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    server.get('/generateId', (req, res) => res.send(shortid.generate()));

    server.use(handler).listen(3000);
});
