import Router from 'next/router';
import firebase from '../index';
import urls from '../../../utils/urls';
import { createProfile } from './profiles';


export const registerNewUser = (email, password) =>
    firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((resp) => createProfile(resp.user.uid))
        .then(() => Router.push(urls.myProfile.edit()));

export const loginUser = (email, password) =>
    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((resp) => Router.push(urls.profile.view(resp.user.uid)));

export const signOut = () =>
    firebase.auth()
        .signOut()
        .then(() => Router.push(urls.home()));

export const resetPassword = (email) =>
    firebase.auth()
        .sendPasswordResetEmail(email);
