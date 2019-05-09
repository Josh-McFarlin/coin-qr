const _ = require('lodash');

const firebase = require('../index');
const hashUtils = require('../../../utils/hash');


// ~~~~~ Fetch ~~~~~
const fetchProfile = (id) =>
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

                return data;
            }

            throw new Error('Profile not found');
        });
// ~~~~~~~~~~~~~~~


// ~~~~~ Set ~~~~~
const createProfile = (userId) => {
    const date = new Date();

    const profileId = hashUtils.hashUID(userId);

    const profile = {
        created: firebase.firestore.Timestamp.fromDate(date),
        modified: firebase.firestore.Timestamp.fromDate(date),
        userId,
        profileId,
        data: {
            addresses: [],
            bio: '',
            name: '',
            picture: ''
        }
    };

    return firebase.firestore()
        .collection('profiles')
        .doc(profileId)
        .set(profile);
};

const updateProfile = (data, userId) => {
    const modified = firebase.firestore.Timestamp.fromDate(new Date());

    return firebase.firestore()
        .collection('profiles')
        .doc(hashUtils.hashUID(userId))
        .update({
            data,
            modified
        });
};
// ~~~~~~~~~~~~~~~

module.exports = {
    fetchProfile,
    createProfile,
    updateProfile
};
