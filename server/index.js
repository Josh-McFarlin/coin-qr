const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const cors = require('cors');
const _ = require('lodash');

const admin = require('./firebase');
const routes = require('../src/utils/routes');


const nextApp = next({
    dev: process.env.NODE_ENV !== 'production'
});

const handler = routes.getRequestHandler(nextApp);

const csrfProtection = csurf({
    cookie: {
        key: '_csrf',
        path: '/login',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 // 1-hour
    }
});

nextApp.prepare().then(() => {
    const server = express();

    server.use(cors());
    server.use(helmet());
    server.use(bodyParser.json());
    server.use(cookieParser());

    if (process.env.NODE_ENV === 'production') {
        server.use(compression());
    }



    server.get('/login', csrfProtection, (req, res, cont) => {
        if (_.has(req, 'cookies.session')) {
            res.redirect('back');
            return;
        }

        res.cookie('csrfToken', req.csrfToken());

        cont();
    });


    server.post('/sessionLogin', (req, res) => {
        // Get the ID token passed and the CSRF token.
        const idToken = req.body.idToken.toString();
        const csrfToken = req.body.csrfToken.toString();

        // Guard against CSRF attacks.
        if (csrfToken !== req.cookies.csrfToken) {
            res.status(401).send('Unauthorized request!');
            return;
        }

        // Set session expiration to 5 days.
        const expiresIn = 60 * 60 * 24 * 5 * 1000;

        // Create the session cookie. This will also verify the ID token in the process.
        // The session cookie will have the same claims as the ID token.
        // To only allow session cookie setting on recent sign-in, auth_time in ID token
        // can be checked to ensure user was recently signed in before creating a session cookie.
        admin.auth()
            .createSessionCookie(idToken, { expiresIn })
            .then((sessionCookie) => {
                res.cookie('session', sessionCookie, {
                    maxAge: expiresIn,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                });

                res.end(JSON.stringify({
                    status: 'success'
                }));
            }, () => {
                res.status(401).send('Unauthorized request!');
            });
    });

    server.use((req, res, cont) => {
        if (req.url.match(/\/edit\/?$/g)) {
            console.log(req.url)
            console.log('ends with edit!')
            console.log('~~~~')

            res.locals.otherData = 'IT WORKS!'
            res.otherData = 'IT WORKS!'
        }

        cont();
    });

    server.post('/sessionLogout', (req, res) => {
        res.clearCookie('session');
        res.redirect('/');
    });

    server.get('/test', (req, res) => {
        const sessionCookie = _.get(req, 'cookies.session', '');

        // Verify the session cookie. In this case an additional check is added to detect
        // if the user's Firebase session was revoked, user deleted/disabled, etc.
        admin.auth()
            .verifySessionCookie(sessionCookie, true /** checkRevoked */)
            .then((decodedClaims) => {
                console.log('decodedClaims', decodedClaims);

                res.send('Hello World!');
            })
            .catch(() => {
                res.redirect('/login');
            });
    });



    server.use(handler).listen(3000);
});
