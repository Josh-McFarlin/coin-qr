import fetch from 'isomorphic-unfetch';

import firebase from '../index';
import urls from '../../../utils/urls';
import { createPerson } from './people';


export const loginUser = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const token = result.credential.accessToken;

        const { user, additionalUserInfo } = result;

        await user.getIdToken()
            .then((idToken) =>
                fetch(urls.auth.sessionLogin, {
                    method: 'post',
                    mode: 'same-origin',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idToken
                    })
                }))
            .then(() => firebase.auth().signOut())
            .then(async () => {
                if (additionalUserInfo.isNewUser) {
                    await createPerson(user);
                }
            })
            .then(() => {
                window.location.assign(urls.home);
            });
    });
};

export const signOut = () =>
    fetch(urls.auth.sessionLogout, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

export const getCurrentUser = (session) =>
    fetch(urls.base + urls.auth.getCurrentUser, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session
        })
    })
        .then((response) => response.json())
        .then((json) => json.user);
