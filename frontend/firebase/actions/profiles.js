import isNil from 'lodash/isNil';
import firebase from '../index';


const fetchProfile = (uid) =>
    firebase.firestore()
        .collection('profiles')
        .doc(uid)
        .get()
        .then((profile) => {
            if (!profile.exists) throw new Error('Profile not found');
            const data = profile.data();

            if (!isNil(data.created)) {
                data.created = data.created.toDate();
            }

            if (!isNil(data.modified)) {
                data.modified = data.modified.toDate();
            }

            return data;
        });

export const createProfile = (uid) =>
    firebase.firestore()
        .collection('profiles')
        .doc(uid)
        .set(() => {
            const curDate = firebase.firestore.FieldValue.serverTimestamp();

            return {
                created: curDate,
                modified: curDate,
                userId: uid,
                data: {
                    addresses: [],
                    bio: '',
                    name: '',
                    picture: ''
                }
            };
        });

export const updateProfile = (uid, data) => {
    const modified = firebase.firestore.FieldValue.serverTimestamp();

    return firebase.firestore()
        .collection('profiles')
        .doc(uid)
        .update({
            data,
            modified
        });
};
