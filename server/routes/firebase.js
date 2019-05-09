const _ = require('lodash');
const slowDown = require('express-slow-down');

const firebaseActions = require('../firebase/actions');
const admin = require('../firebase');
const hashUtils = require('../../utils/hash');


const authSpeedLimiter = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 20, // allow 20 requests to go at full-speed, then...
    delayMs: 500 // 21st request has a 500ms delay, 22nd has a 1000ms delay, 23rd has a 1500ms delay, etc.
});

const publicSpeedLimiter = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 3, // allow 10 requests to go at full-speed, then...
    delayMs: 500 // 4th request has a 500ms delay, 5th has a 1000ms delay, 6th has a 1500ms delay, etc.
});

async function isRealUser(req, res, cont) {
    const sessionCookie = _.get(req, 'cookies.session');

    if (_.isString(sessionCookie) && !_.isEmpty(sessionCookie)) {
        // Verify the session cookie
        await admin.auth()
            .verifySessionCookie(sessionCookie, true)
            .then((decodedClaims) => {
                res.locals.authedUid = decodedClaims.uid || decodedClaims.user_id;
                cont();
            })
            .catch(() => {
                res.status(403).send('You must be authenticated to use this route!');
            });
    } else {
        res.status(403).send('You must be authenticated to use this route!');
    }
}

module.exports = (server) => {
    // ~~~~~ Pages ~~~~~
    server.post('/firebase/addPage', publicSpeedLimiter, async (req, res) => {
        const userId = _.get(res, 'locals.authedUid');
        const data = _.get(req, 'body.data');

        if (_.isObject(data)) {
            await firebaseActions.pages.addPage(data, userId)
                .then((createdPage) => {
                    res.status(201).json(createdPage);
                })
                .catch(() => {
                    res.status(500).send('An unknown error occurred while creating the page!');
                });
        } else {
            res.status(400).send('Provided invalid data!');
        }
    });

    server.post('/firebase/updatePage', authSpeedLimiter, isRealUser, async (req, res) => {
        const currentUserId = _.get(res, 'locals.authedUid');
        const data = _.get(req, 'body.data');
        const id = _.get(req, 'body.id');

        await firebaseActions.pages.fetchPageById(id)
            .then(async (page) => {
                if (_.isObject(page) && _.has(page, 'owner') && currentUserId === page.owner) {
                    await firebaseActions.pages.updatePage(page, data)
                        .then(() => {
                            res.status(201).send('Updated page successfully!');
                        })
                        .catch(() => {
                            res.status(500).send('An unknown error occurred while creating the page!');
                        });
                } else if (currentUserId !== page.owner) {
                    res.status(403).send('Page owners do not match!');
                } else {
                    res.status(400).send('Provided an invalid page!');
                }
            });
    });

    server.post('/firebase/deletePage', authSpeedLimiter, isRealUser, async (req, res) => {
        const currentUserId = _.get(res, 'locals.authedUid');
        const id = _.get(req, 'body.id');

        if (_.isString(id)) {
            await firebaseActions.pages.fetchPageById(id)
                .then(async (page) => {
                    if (_.isObject(page) && _.has(page, 'owner') && currentUserId === page.owner) {
                        await firebaseActions.pages.deletePage(id)
                            .then(() => {
                                res.status(200).send('Deleted page successfully!');
                            })
                            .catch(() => {
                                res.status(500).send('An unknown error occurred while deleting the page!');
                            });
                    }
                });
        } else {
            res.status(400).send('Provided an empty id!');
        }
    });
    // ~~~~~~~~~~~~~~~~~~~~

    // ~~~~~ Profiles ~~~~~
    server.post('/firebase/createProfile', authSpeedLimiter, isRealUser, async (req, res) => {
        const currentUserId = _.get(res, 'locals.authedUid');

        await firebaseActions.profiles.fetchProfile(hashUtils.hashUID(currentUserId))
            .then((profile) => {
                if (_.isObject(profile)) {
                    res.status(409).send('Attempted to create a profile for an existing user!');
                } else {
                    throw new Error('Empty profile in Firebase, can overwrite.');
                }
            })
            .catch(async () => {
                await firebaseActions.profiles.createProfile(currentUserId)
                    .then(() => {
                        res.status(200).send('Profile created successfully!');
                    })
                    .catch(() => {
                        res.status(500).send('An unknown error occurred while creating the profile!');
                    });
            });
    });

    server.post('/firebase/updateProfile', authSpeedLimiter, isRealUser, async (req, res) => {
        const currentUserId = _.get(res, 'locals.authedUid');
        const data = _.get(req, 'body.data');

        if (_.isObject(data)) {
            await firebaseActions.profiles.fetchProfile(hashUtils.hashUID(currentUserId))
                .then(async (profile) => {
                    if (currentUserId === profile.userId) {
                        await firebaseActions.profiles.updateProfile(data, currentUserId)
                            .then(() => {
                                res.status(201).send('Updated profile successfully!');
                            })
                            .catch(() => {
                                res.status(500).send('An unknown error occurred while updating the profile!');
                            });
                    } else {
                        res.status(403).send('Profile owners do not match!');
                    }
                });
        } else {
            res.status(400).send('Provided invalid data!');
        }
    });
    // ~~~~~~~~~~~~~~~~~~~~
};
