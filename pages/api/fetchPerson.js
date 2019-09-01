const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    const { email } = req.body;

    await firebaseActions.people.fetchPerson(email)
        .then((person) => {
            res.status(200).json({
                status: 'success',
                person
            });
        })
        .catch(() => {
            res.status(500).json({
                status: 'failed'
            });
        });
}
