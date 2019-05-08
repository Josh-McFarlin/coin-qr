const _ = require('lodash');
const slowDown = require('express-slow-down');

const firebaseActions = require('../firebase/actions');
const admin = require('../firebase');


const speedLimiter = slowDown({
    windowMs: 10 * 60 * 1000, // 15 minutes
    delayAfter: 5, // allow 5 requests to go at full-speed, then...
    delayMs: 200 // 6th request has a 200ms delay, 7th has a 400ms delay, 8th gets 600ms, etc.
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
                res.status(403).send('This route is for internal use only!');
            });
    } else {
        res.status(403).send('This route is for internal use only!');
    }
}

module.exports = (server) => {
    server.post('/firebase/addPage', speedLimiter, isRealUser, async (req, res) => {
        const userId = _.get(res, 'locals.authedUid');
        const data = _.get(req, 'body.data');

        if (_.isObject(data)) {
            await firebaseActions.pages.addPage(data, userId)
                .then((createdPage) => {
                    res.status(201).json(createdPage);
                })
                .catch(() => {
                    res.status(403).send('An unknown error occurred while creating the page!');
                });
        } else {
            res.status(500).send('Provided invalid data!');
        }
    });

    server.post('/firebase/updatePage', speedLimiter, isRealUser, async (req, res) => {
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
                            res.status(403).send('An unknown error occurred while creating the page!');
                        });
                } else if (currentUserId !== page.owner) {
                    res.status(403).send('Page owners do not match!');
                } else {
                    res.status(500).send('Provided an invalid page!');
                }
            });
    });

    server.post('/firebase/deletePage', speedLimiter, isRealUser, async (req, res) => {
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
                                res.status(403).send('An unknown error occurred while deleting the page!');
                            });
                    }
                });
        } else {
            res.status(500).send('Provided an empty id!');
        }
    });
};
