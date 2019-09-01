const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    await firebaseActions.people.fetchEmails()
        .then((emails) => {
            res.status(200).json({
                status: 'success',
                emails
            });
        })
        .catch(() => {
            res.status(500).json({
                status: 'failed'
            });
        });
}
