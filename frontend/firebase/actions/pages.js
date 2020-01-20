import firebase from '../index';


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
