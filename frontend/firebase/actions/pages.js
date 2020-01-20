import isString from 'lodash/isString';
import firebase from '../index';


export const getPage = (pageId) =>
    firebase.firestore()
        .collection('pages')
        .doc(pageId)
        .get()
        .then((page) => page.data());

export const getRecent = (userId) => {
    let pages = firebase.firestore().collection('pages');

    if (isString(userId)) {
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

export const addPage = (data) => {
    const { currentUser } = firebase.auth();

    if (currentUser == null) throw new Error('Not logged in!');

    const docRef = firebase.firestore()
        .collection('pages')
        .doc();

    const curDate = firebase.firestore.FieldValue.serverTimestamp();

    const page = {
        id: docRef.id,
        owner: currentUser.uid,
        created: curDate,
        modified: curDate,
        data
    };

    return docRef
        .set(page)
        .then(() => page);
};

export const updatePage = (pageId, data) => {
    const modified = firebase.firestore.FieldValue.serverTimestamp();

    return firebase.firestore()
        .collection('pages')
        .doc(pageId)
        .update({
            data,
            modified
        });
};

export const deletePage = (pageId) =>
    firebase.firestore()
        .collection('pages')
        .doc(pageId)
        .delete();
