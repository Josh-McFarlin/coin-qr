const _ = require('lodash');
const slowDown = require('express-slow-down');

const firebaseActions = require('../firebase/actions');
const hashUtils = require('../../utils/hash');


const speedLimiter = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 10, // allow 10 requests to go at full-speed, then...
    delayMs: 300 // 11th request has a 300ms delay, 12th has a 600ms delay, 13th has a 900ms delay, etc.
});

module.exports = (server) => {
    server.post('/qr/:postId', speedLimiter, async (req, res) => {
        const postId = _.get(req, 'params.postId');

        await firebaseActions.pages.fetchPageByPostId(postId)
            .then((page) => {
                const pageClone = _.cloneDeep(page);

                pageClone.owner = hashUtils.hashUID(pageClone.owner);
                delete pageClone.id;

                if (_.has(pageClone, 'created')) {
                    pageClone.created = pageClone.created.toDate();
                }

                if (_.has(pageClone, 'modified')) {
                    pageClone.modified = pageClone.modified.toDate();
                }

                res.status(200).json(pageClone);
            })
            .catch(() => {
                res.status(404).status('QR page not found!');
            });
    });
};
