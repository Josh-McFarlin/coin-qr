const firebase = require('../index');


const fetchJobs = () =>
    firebase.firestore()
        .collection('jobs')
        .where('date', '>=', new Date())
        .get()
        .then(async (querySnapshot) => {
            const jobs = [];

            await querySnapshot.forEach((doc) => {
                jobs.push(doc.data());
            });

            return jobs;
        });

module.exports = {
    fetchJobs
};
