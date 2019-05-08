/* eslint-disable prefer-destructuring */
const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const _ = require('lodash');

const admin = require('./firebase');
const nextRoutes = require('../utils/routes');


const nextApp = next({
    dev: process.env.NODE_ENV !== 'production'
});

const handler = nextRoutes.getRequestHandler(nextApp);

nextApp.prepare().then(() => {
    const server = express();

    server.use(cors());
    server.use(helmet());
    server.use(bodyParser.json());
    server.use(cookieParser());

    if (process.env.NODE_ENV === 'production') {
        server.use(compression());
    }

    server.use(async (req, res, cont) => {
        const sessionCookie = _.get(req, 'cookies.session');

        if (_.isString(sessionCookie) && !_.isEmpty(sessionCookie)) {
            // Verify the session cookie
            await admin.auth()
                .verifySessionCookie(sessionCookie, false)
                .then((decodedClaims) => {
                    res.locals.userId = decodedClaims.uid || decodedClaims.user_id;
                });
        }

        cont();
    });

    require('./routes')(server);

    server.use(handler).listen(3000);
});
