const _ = require('lodash');

const firebaseActions = require('../firebase/actions');


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
        const userId = _.get(res, 'locals.userId');
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

    server.post('/firebase/updatePage', isLocal, async (req, res) => {
        const currentUserId = _.get(res, 'locals.userId');
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

    server.post('/firebase/deletePage', isLocal, async (req, res) => {
        const currentUserId = _.get(res, 'locals.userId');
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
