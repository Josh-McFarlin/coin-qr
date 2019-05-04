import _ from 'lodash';

import {
    CREATE_PAGE_SUCCESSFUL,
    CREATE_PAGE_FAILURE,
    UPDATE_PAGE_SUCCESSFUL,
    UPDATE_PAGE_FAILURE,
    FETCH_RECENT_SUCCESSFUL,
    FETCH_PAGE_SUCCESSFUL,
    FETCH_PAGE_FAILURE,
    DELETE_PAGE_SUCCESSFUL,
    DELETE_PAGE_FAILURE
} from './types';
import firebase from '../../../firebase/index';


export const fetchPage = (id) => (dispatch) =>
    firebase.firestore()
        .collection('pages')
        .doc(id)
        .get()
        .then((page) => {
            if (page.exists) {
                const payload = {
                    page: {
                        ...page.data(),
                        id
                    }
                };

                return dispatch({
                    type: FETCH_PAGE_SUCCESSFUL,
                    payload
                });
            }

            return dispatch({
                type: FETCH_PAGE_FAILURE
            });
        })
        .catch(() => dispatch({
            type: FETCH_PAGE_FAILURE
        }));

export const addPage = (data, id, owner) => (dispatch) => {
    const date = new Date();

    const page = {
        created: firebase.firestore.Timestamp.fromDate(date),
        modified: firebase.firestore.Timestamp.fromDate(date),
        data
    };

    if (_.isString(owner)) {
        page.owner = owner;
    }

    return firebase.firestore()
        .collection('pages')
        .doc(id)
        .set(page)
        .then(() => dispatch({
            type: CREATE_PAGE_SUCCESSFUL,
            payload: page
        }))
        .catch(() => dispatch({
            type: CREATE_PAGE_FAILURE
        }));
};

export const updatePage = (data, id) => (dispatch) => {
    const date = new Date();

    const page = {
        modified: firebase.firestore.Timestamp.fromDate(date),
        data
    };

    return firebase.firestore()
        .collection('pages')
        .doc(id)
        .update(page)
        .then(() => dispatch({
            type: UPDATE_PAGE_SUCCESSFUL,
            payload: page
        }))
        .catch(() => dispatch({
            type: UPDATE_PAGE_FAILURE
        }));
};

export const deletePage = (id) => (dispatch) =>
    firebase.firestore()
        .collection('pages')
        .doc(id)
        .delete()
        .then(() => dispatch({
            type: DELETE_PAGE_SUCCESSFUL
        }))
        .catch(() => dispatch({
            type: DELETE_PAGE_FAILURE
        }));

export const fetchRecent = (userId) => (dispatch) => {
    let pages = firebase.firestore().collection('pages');

    if (_.isString(userId)) {
        pages = pages.where('owner', '==', userId);
    }

    return pages
        .orderBy('modified', 'desc')
        .limit(25)
        .get()
        .then((snapshot) => {
            const newState = {
                recentPages: []
            };

            snapshot.forEach((doc) => {
                const data = doc.data();

                data.created = data.created.toDate();
                data.modified = data.modified.toDate();

                newState.recentPages.push({
                    ...data,
                    id: doc.id
                });
            });

            return dispatch({
                type: FETCH_RECENT_SUCCESSFUL,
                payload: newState
            });
        })
        .catch(() => dispatch({
            type: FETCH_PAGE_FAILURE
        }));
};

export const listenRecent = () => (dispatch) =>
    firebase.firestore()
        .collection('pages')
        .orderBy('modified', 'desc')
        .limit(25)
        .onSnapshot((snapshot) => {
            const newState = {
                recentPages: []
            };

            snapshot.forEach((doc) => {
                const data = doc.data();

                data.created = data.created.toDate();
                data.modified = data.modified.toDate();

                newState.recentPages.push({
                    ...data,
                    id: doc.id
                });
            });

            return dispatch({
                type: FETCH_RECENT_SUCCESSFUL,
                payload: newState
            });
        });
