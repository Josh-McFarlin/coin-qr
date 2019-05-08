const _ = require('lodash');

const admin = require('../firebase');
const firebaseActions = require('../firebase/actions');
const urls = require('../../utils/urls');
const hashUtil = require('../../utils/hash');


module.exports = (server) => {
    function isLocal(req, res, cont) {
        const hostMachine = req.headers.host.split(':')[0];

        if (req.ip === '127.0.0.1' || req.ip === '::1' || hostMachine === 'localhost') {
            cont();
        } else {
            res.status(403).send('This route is for internal use only!');
        }
    }

    server.post('/firebase/addPage', isLocal, async (req, res) => {
        const currentUserId = _.get(res, 'locals.userId');
        const page = _.get(req, 'body.page');

        const isOwner =
            _.isNil(_.get(page, 'owner'))
                || (_.isString(currentUserId)
                && currentUserId === _.get(page, 'owner'));

        if (_.isObject(page) && isOwner) {
            await firebaseActions.pages.addPage(page)
                .then((createdPage) => {
                    res.status(201).json(createdPage);
                })
                .catch(() => {
                    res.status(403).send('An unknown error occurred while creating the page!');
                });
        } else if (!isOwner) {
            res.status(403).send('Page owners do not match!');
        } else {
            res.status(500).send('Provided an invalid page!');
        }
    });
};
