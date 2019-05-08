const _ = require('lodash');

const firebase = require('../index');
const hashUtils = require('../../../utils/hash');

// ~~~~~ Fetch ~~~~~
module.exports.fetchPage = (postId) =>
    firebase.firestore()
        .collection('pages')
        .where('postId', '==', postId)
        .limit(1)
        .get()
        .then((querySnapshot) => querySnapshot.docs[0].data());

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
// ~~~~~~~~~~~~~~~


// ~~~~~ Set ~~~~~
module.exports.addPage = (page) => {
    const pageClone = _.cloneDeep(page);

    const date = new Date();
    pageClone.created = firebase.firestore.Timestamp.fromDate(date);
    pageClone.modified = firebase.firestore.Timestamp.fromDate(date);

    const docRef = firebase.firestore()
        .collection('pages')
        .doc();

    pageClone.postId = hashUtils.hashUID(docRef.id);

    return docRef
        .set(pageClone)
        .then(() => pageClone);
};

module.exports.updatePage = (page) => {
    const pageClone = _.cloneDeep(page);
    const date = new Date();

    pageClone.modified = firebase.firestore.Timestamp.fromDate(date);

    return firebase.firestore()
        .collection('pages')
        .doc(pageClone.postId)
        .update(pageClone)
        .then(() => pageClone);
};

module.exports.deletePage = (postId) =>
    firebase.firestore()
        .collection('pages')
        .doc(postId)
        .delete();
// ~~~~~~~~~~~~~~~
