import {
    AUTH_SUCCESSFUL,
    AUTH_FAILURE,
    SIGN_OUT_SUCCESSFUL,
    SIGN_OUT_FAILURE,
    RESET_PASSWORD_SUCCESSFUL,
    RESET_PASSWORD_FAILURE
} from './types';
import firebase from '../../../firebase/index';


export const registerNewUser = (email, password) => (dispatch) =>
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => dispatch({
            type: AUTH_SUCCESSFUL,
            payload: user
        }))
        .catch((error) => {
            const errorCode = error.code;

            let errorTarget;
            let errorMessage;

            if (errorCode === 'auth/invalid-email') {
                errorTarget = 'email';
                errorMessage = 'The entered email is invalid!';
            } else if (errorCode === 'auth/email-already-in-use') {
                errorTarget = 'email';
                errorMessage = 'An account already exists with the provided email address!';
            } else if (errorCode === 'auth/weak-password') {
                errorTarget = 'password';
                errorMessage = 'The provided password is too weak!';
            } else {
                errorTarget = 'email';
                errorMessage = 'Could not register at this time. Please try again later!';
            }

            const newState = {
                authFailure: {
                    target: errorTarget,
                    message: errorMessage
                }
            };

            return dispatch({
                type: AUTH_FAILURE,
                payload: newState
            });
        });

export const loginUser = (email, password) => (dispatch) =>
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) =>
            dispatch({
                type: AUTH_SUCCESSFUL,
                payload: user
            }))
        .catch((error) => {
            const errorCode = error.code;

            let errorTarget;
            let errorMessage;

            if (errorCode === 'auth/invalid-email') {
                errorTarget = 'email';
                errorMessage = 'The entered email is invalid!';
            } else if (errorCode === 'auth/wrong-password') {
                errorTarget = 'password';
                errorMessage = 'The entered password is invalid!';
            } else if (errorCode === 'auth/user-not-found') {
                errorTarget = 'email';
                errorMessage = 'The entered email is not a user!';
            } else {
                errorTarget = 'email';
                errorMessage = 'Could not auth at this time. Please try again later!';
            }

            const newState = {
                loginFailure: {
                    target: errorTarget,
                    message: errorMessage
                }
            };

            return dispatch({
                type: AUTH_FAILURE,
                payload: newState
            });
        });

export const listenForUser = () => (dispatch) =>
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const newState = {
                user
            };

            return dispatch({
                type: AUTH_SUCCESSFUL,
                payload: newState
            });
        }

        const newState = {
            user: null
        };

        return dispatch({
            type: AUTH_FAILURE,
            payload: newState
        });
    });

export const signOut = () => (dispatch) =>
    firebase.auth().signOut()
        .then(() => dispatch({
            type: SIGN_OUT_SUCCESSFUL
        }))
        .catch(() => dispatch({
            type: SIGN_OUT_FAILURE
        }));

export const resetPassword = (email) => (dispatch) =>
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => dispatch({
            type: RESET_PASSWORD_SUCCESSFUL
        }))
        .catch(() => dispatch({
            type: RESET_PASSWORD_FAILURE
        }));
