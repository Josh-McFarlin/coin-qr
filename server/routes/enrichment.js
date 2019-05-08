const _ = require('lodash');

const admin = require('../firebase');
const firebaseActions = require('../firebase/actions');
const urls = require('../../utils/urls');
const hashUtil = require('../../utils/hash');


module.exports = (server) => {
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

    server.get('/profile/:profileId', async (req, res, cont) => {
        const profileId = _.get(req, 'params.profileId');

        await firebaseActions.profiles.fetchProfile(profileId)
            .then(async (profile) => {
                res.locals.profile = profile;

                await firebaseActions.pages.fetchRecent(profile.userId)
                    .then((recentPages) => {
                        res.locals.recentPages = recentPages;
                    });
            })
            .catch((error) => {
                res.locals.error = {
                    message: 'Profile Page Not Found',
                    statusCode: 404
                };
            });

        cont();
    });

    server.get('/myprofile/edit', async (req, res, cont) => {
        const sessionCookie = _.get(req, 'cookies.session', '');

        if (_.isString(sessionCookie) && !_.isEmpty(sessionCookie)) {
            // Verify the session cookie. In this case an additional check is added to detect
            // if the user's Firebase session was revoked, user deleted/disabled, etc.
            await admin.auth()
                .verifySessionCookie(sessionCookie, true /** checkRevoked */)
                .then(async (decodedClaims) => {
                    const profileId = hashUtil.hashUID(decodedClaims.uid);

                    await firebaseActions.profiles.fetchProfile(profileId)
                        .then(async (profile) => {
                            res.locals.profile = profile;
                        })
                        .catch((error) => {
                            res.locals.error = {
                                message: 'Profile Page Not Found',
                                statusCode: 404
                            };
                        });
                })
                .catch(() => {
                    res.redirect(urls.auth());
                });
        } else {
            res.redirect(urls.auth());
        }

        cont();
    });
};
