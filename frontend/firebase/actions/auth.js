import Cookies from 'universal-cookie';

import firebase from '../index';
import urls from '../../../utils/urls';
import { createProfile } from './profiles';


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
                .then(() => createProfile())
                .then(() => {
                    window.location.assign(urls.home());
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
                    window.location.assign(urls.home());
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
