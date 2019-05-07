/* eslint-disable prefer-destructuring */
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
const firebaseActions = require('./firebase/actions');


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

    server.get('/recent', async (req, res, cont) => {
        await firebaseActions.pages.fetchRecent()
            .then((pages) => {
                res.locals.recentPages = pages;
            });

        cont();
    });

    server.get('/qr/:postId/:optional*?', async (req, res, cont) => {
        const postId = _.get(req, 'params.postId');
        const optional = _.get(req, 'params.optional');
        const userId = res.locals.userId;

        // console.log('req', req)

        if (optional === 'edit' && _.isNil(userId)) {
            res.redirect(urls.auth());
            return;
        }

        await firebaseActions.pages.fetchPage(postId)
            .then((page) => {
                if (optional === 'edit' && page.owner !== userId) {
                    res.redirect(urls.qr.view(postId));
                }

                res.locals.page = page;
            })
            .catch(() => {
                res.locals.error = {
                    statusCode: 404,
                    statusMessage: 'QR Page Not Found :('
                };
            });

        cont();
    });

    server.get('/profile/:profileId/:optional*?', async (req, res, cont) => {
        const profileId = _.get(req, 'params.profileId');
        const optional = _.get(req, 'params.optional');
        const userId = res.locals.userId;

        if (optional === 'edit' && _.isNil(userId)) {
            res.redirect(urls.auth());
            return;
        }

        await firebaseActions.profiles.fetchProfile(profileId)
            .then(async (profile) => {
                if (optional === 'edit' && profile.userId !== userId) {
                    res.redirect(urls.profile.view(profileId));
                }

                res.locals.profile = profile;

                await firebaseActions.pages.fetchRecent(profile.userId)
                    .then((recentPages) => {
                        res.locals.recentPages = recentPages;
                    });

                const featured = _.defaultTo(
                    _.get(profile, 'data.featuredPage'),
                    _.get(res, 'locals.recentPages[0].owner')
                );

                if (_.isString(featured) && !_.isEmpty(featured)) {
                    await firebaseActions.pages.fetchPage(featured)
                        .then((featuredPage) => {
                            res.locals.featuredPage = featuredPage;
                        });
                }
            })
            .catch((error) => {
                res.locals.error = {
                    message: 'Profile Page Not Found',
                    statusCode: 404
                };
            });

        cont();
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
