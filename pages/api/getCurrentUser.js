const _ = require('lodash');

const admin = require('../../server/firebase');
const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    const sessionCookie = req.body.session;

    if (_.isString(sessionCookie) && !_.isEmpty(sessionCookie)) {
        // Verify the session cookie
        await admin.auth()
            .verifySessionCookie(sessionCookie, false)
            .then(async (decodedClaims) => {
                const userEmail = decodedClaims.firebase.identities.email[0];

                await firebaseActions.people.fetchPerson(userEmail)
                    .then((person) => {
                        res.status(200).json({
                            status: 'success',
                            user: {
                                isUser: true,
                                ...person
                            }
                        });
                    });
            })
            .catch(() => {
                res.status(500).json({
                    status: 'failed',
                    user: {
                        isUser: false
                    }
                });
            });
    } else {
        res.status(500)
            .json({
                status: 'failed',
                user: {
                    isUser: false
                }
            });
    }
}
