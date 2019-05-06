const _ = require('lodash');

const firebase = require('../index');
const hashUtils = require('../../../utils/hash');


module.exports.fetchPage = (id) =>
    firebase.firestore()
        .collection('pages')
        .doc(id)
        .get()
        .then((page) => {
            if (page.exists) {
                return {
                    ...page.data(),
                    id
                };
            }

            throw Error('Page does not exist!');
        });

module.exports.addPage = (data, owner) => {
    const date = new Date();

    const page = {
        created: firebase.firestore.Timestamp.fromDate(date),
        modified: firebase.firestore.Timestamp.fromDate(date),
        data
    };

    if (_.isString(owner)) {
        page.owner = owner;
    }

    const docRef = firebase.firestore()
        .collection('pages')
        .doc();

    console.log('docRef', docRef);

    page.postId = hashUtils.hashUID(docRef.id);

    console.log('page', page);

    return docRef
        .set(page)
        .then(() => page);
};

module.exports.updatePage = (data, id) => {
    const date = new Date();

    const page = {
        modified: firebase.firestore.Timestamp.fromDate(date),
        data
    };

    return firebase.firestore()
        .collection('pages')
        .doc(id)
        .update(page)
        .then(() => page);
};

module.exports.deletePage = (id) =>
    firebase.firestore()
        .collection('pages')
        .doc(id)
        .delete();

module.exports.fetchRecent = (userId) => {
    let pages = firebase.firestore().collection('pages');

    if (_.isString(userId)) {
        pages = pages.where('owner', '==', userId);
    }

    return pages
        .orderBy('modified', 'desc')
        .limit(25)
        .get()
        .then((snapshot) => {
            const recentPages = [];

            snapshot.forEach((doc) => {
                const data = doc.data();

                data.created = data.created.toDate();
                data.modified = data.modified.toDate();

                recentPages.push({
                    ...data,
                    id: doc.id
                });
            });

            return recentPages;
        });
};
