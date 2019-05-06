import Cookies from 'universal-cookie';

import firebase from './index';
import Hashids from 'hashids';


const createProfile = (user) => {
    const date = new Date();

    const hashids = new Hashids(user.uid, 5);
    const profileId = hashids.encode(1);

    const profile = {
        created: firebase.firestore.Timestamp.fromDate(date),
        modified: firebase.firestore.Timestamp.fromDate(date),
        userId: user.uid,
        data: {
            profileId,
            bio: '',
            email: {
                email: user.email,
                public: false
            },
            featuredPage: {
                featuredPage: '',
                public: false
            },
            name: {
                name: '',
                public: false
            },
            picture: {
                picture: '',
                public: false
            }
        }
    };

    return firebase.firestore()
        .collection('profiles')
        .doc(profileId)
        .set(profile);
};

export const registerNewUser = (email, password) =>
    firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
            const cookies = new Cookies();
            const csrfToken = cookies.get('csrfToken');

            user.user.getIdToken()
                .then((idToken) =>
                    fetch('/sessionLogin', {
                        method: 'post',
                        mode: 'same-origin',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            idToken,
                            csrfToken
                        })
                    }))
                .then(() => firebase.auth().signOut())
                .then(() => {
                    window.location.assign('/');
                });
        });

export const loginUser = (email, password) =>
    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
            const cookies = new Cookies();
            const csrfToken = cookies.get('csrfToken');

            user.user.getIdToken()
                .then((idToken) =>
                    fetch('/sessionLogin', {
                        method: 'post',
                        mode: 'same-origin',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            idToken,
                            csrfToken
                        })
                    }))
                .then(() => firebase.auth().signOut())
                .then(() => {
                    window.location.assign('/');
                });
        });

export const signOut = () =>
    fetch('/sessionLogout', {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

export const resetPassword = (email) =>
    firebase.auth()
        .sendPasswordResetEmail(email);
