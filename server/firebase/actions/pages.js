const _ = require('lodash');

const firebase = require('../index');
const hashUtils = require('../../../utils/hash');


// ~~~~~ Fetch ~~~~~
const fetchPageById = (id) =>
    firebase.firestore()
        .collection('pages')
        .doc(id)
        .get()
        .then((page) => page.data());

const fetchPageByPostId = (postId) =>
    firebase.firestore()
        .collection('pages')
        .where('postId', '==', postId)
        .limit(1)
        .get()
        .then((querySnapshot) => querySnapshot.docs[0].data());

const fetchRecent = (userId) => {
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
const addPage = (data, owner) => {
    const docRef = firebase.firestore()
        .collection('pages')
        .doc();

    const curDate = firebase.firestore.FieldValue.serverTimestamp();

    const page = {
        created: curDate,
        modified: curDate,
        postId: hashUtils.hashUID(docRef.id),
        id: docRef.id,
        data
    };

    if (_.isString(owner)) {
        page.owner = owner;
    }

    return docRef
        .set(page)
        .then(() => page);
};

const updatePage = (page, data) => {
    const modified = firebase.firestore.FieldValue.serverTimestamp();

    return firebase.firestore()
        .collection('pages')
        .doc(page.postId)
        .update({
            data,
            modified
        });
};

const deletePage = (postId) =>
    firebase.firestore()
        .collection('pages')
        .doc(postId)
        .delete();
// ~~~~~~~~~~~~~~~

module.exports = {
    fetchPageById,
    fetchPageByPostId,
    fetchRecent,
    addPage,
    updatePage,
    deletePage
};
