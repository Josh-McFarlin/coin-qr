import Hashids from 'hashids';
import _ from 'lodash';

import firebase from '../index';


export const fetchProfile = (id) =>
    firebase.firestore()
        .collection('profiles')
        .doc(id)
        .get()
        .then((profile) => {
            if (profile.exists) {
                const data = profile.data();

                if (!_.isNil(data.created)) {
                    data.created = data.created.toDate();
                }

                if (!_.isNil(data.modified)) {
                    data.modified = data.modified.toDate();
                }

                data.id = profile.id;

                return data;
            }

            throw Error('Profile not found');
        });

export const createProfile = (user) => {
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
        .then(() => profile);
};

export const updateProfile = (data, id) => {
    const date = new Date();

    const profile = {
        modified: firebase.firestore.Timestamp.fromDate(date),
        data
    };

    return firebase.firestore()
        .collection('profiles')
        .doc(id)
        .update(profile)
        .then(() => profile);
};
