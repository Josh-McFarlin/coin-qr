const csurf = require('csurf');
const _ = require('lodash');

const admin = require('../firebase');
const urls = require('../../utils/urls');


const csrfProtection = csurf({
    cookie: {
        key: '_csrf',
        path: urls.auth(),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 // 1-hour
    }
});

module.exports = (server) => {
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

    server.post('/sessionLogout', (req, res) => {
        res.clearCookie('session');
        res.redirect(urls.home());
    });
};
