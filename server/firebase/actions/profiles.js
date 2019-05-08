const _ = require('lodash');

const firebase = require('../index');
const hashUtils = require('../../../utils/hash');


module.exports.fetchProfile = (id) =>
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

            throw Error('Profile not found');
        });

module.exports.createProfile = (userId) => {
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
        .set(profile)
        .then(() => profile);
};

module.exports.updateProfile = (profile) => {
    const profileClone = _.cloneDeep(profile);
    const date = new Date();

    profileClone.modified = firebase.firestore.Timestamp.fromDate(date);

    return firebase.firestore()
        .collection('profiles')
        .doc(profileClone.profileId)
        .update(profileClone)
        .then(() => profileClone);
};
