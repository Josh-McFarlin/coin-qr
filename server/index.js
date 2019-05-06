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
const routes = require('../utils/routes');
const urls = require('../utils/urls');
const hashUtil = require('../utils/hash');


const nextApp = next({
    dev: process.env.NODE_ENV !== 'production'
});

const handler = routes.getRequestHandler(nextApp);

const csrfProtection = csurf({
    cookie: {
        key: '_csrf',
        path: urls.auth(),
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

    server.post('/sessionLogin', async (req, res) => {
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
        await admin.auth()
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

    server.use(async (req, res, cont) => {
        res.locals.modified = false;

        const sessionCookie = _.get(req, 'cookies.session');

        if (_.isString(sessionCookie) && !_.isEmpty(sessionCookie)) {
            res.locals.modified = true;
            // Verify the session cookie. In this case an additional check is added to detect
            // if the user's Firebase session was revoked, user deleted/disabled, etc.
            await admin.auth()
                .verifySessionCookie(sessionCookie, false)
                .then((decodedClaims) => {
                    res.locals.userId = decodedClaims.uid || decodedClaims.user_id;
                });
        }

        cont();
    });

    server.post('/sessionLogout', (req, res) => {
        res.clearCookie('session');
        res.redirect(urls.home());
    });

    server.get('/myprofile', async (req, res, cont) => {
        const sessionCookie = _.get(req, 'cookies.session', '');

        if (_.isString(sessionCookie) && !_.isEmpty(sessionCookie)) {
            // Verify the session cookie. In this case an additional check is added to detect
            // if the user's Firebase session was revoked, user deleted/disabled, etc.
            await admin.auth()
                .verifySessionCookie(sessionCookie, true /** checkRevoked */)
                .then((decodedClaims) => {
                    res.redirect(
                        urls.profile.view(
                            hashUtil.hashUID(decodedClaims.uid)
                        )
                    );
                })
                .catch(() => {
                    res.redirect(urls.auth());
                });
        } else {
            res.redirect(urls.auth());
        }

        cont();
    });

    server.use(handler).listen(3000);
});
