import Hashids from 'hashids';

import firebase from '../../../firebase/index';
import {
    FETCH_PROFILE_SUCCESSFUL,
    FETCH_PROFILE_FAILURE,
    UPDATE_PROFILE_SUCCESSFUL,
    UPDATE_PROFILE_FAILURE,
    CREATE_PROFILE_SUCCESSFUL,
    CREATE_PROFILE_FAILURE
} from './types';


export const fetchProfile = (id) => (dispatch) =>
    firebase.firestore()
        .collection('profiles')
        .doc(id)
        .get()
        .then((profile) => {
            if (profile.exists) {
                const data = profile.data();

                data.created = data.created.toDate();
                data.modified = data.modified.toDate();
                data.id = profile.id;

                const payload = {
                    profile: data
                };

                return dispatch({
                    type: FETCH_PROFILE_SUCCESSFUL,
                    payload
                });
            }

            return dispatch({
                type: FETCH_PROFILE_FAILURE
            });
        })
        .catch(() => dispatch({
            type: FETCH_PROFILE_FAILURE
        }));

export const createProfile = (user) => (dispatch) => {
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
        .set(profile)
        .then(() => dispatch({
            type: CREATE_PROFILE_SUCCESSFUL,
            payload: { profile }
        }))
        .catch(() => dispatch({
            type: CREATE_PROFILE_FAILURE
        }));
};

export const updateProfile = (data, id) => (dispatch) => {
    const date = new Date();

    const profile = {
        modified: firebase.firestore.Timestamp.fromDate(date),
        data
    };

    return firebase.firestore()
        .collection('profiles')
        .doc(id)
        .update(profile)
        .then(() => dispatch({
            type: UPDATE_PROFILE_SUCCESSFUL,
            payload: profile
        }))
        .catch(() => dispatch({
            type: UPDATE_PROFILE_FAILURE
        }));
};
