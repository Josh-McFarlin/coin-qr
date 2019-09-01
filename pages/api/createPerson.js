const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    const { user } = req.body;

    await firebaseActions.people.createPerson(user)
        .then(() => {
            res.status(201).json({
                status: 'success'
            });
        })
        .catch(() => {
            res.status(500).json({
                status: 'failed'
            });
        });
}
