const firebase = require('../index');


const createPerson = (user) =>
    firebase.firestore()
        .collection('people')
        .doc(user.email)
        .set({
            name: user.displayName,
            email: user.email,
            jobsCompleted: 0,
            isAdmin: false
        });

const fetchPeople = () =>
    firebase.firestore()
        .collection('people')
        .get()
        .then(async (querySnapshot) => {
            const people = [];

            await querySnapshot.forEach((person) => {
                people.push(person.data());
            });

            return people;
        });

const fetchEmails = () =>
    firebase.firestore()
        .collection('people')
        .get()
        .then(async (querySnapshot) => {
            const emailsToNames = {};

            await querySnapshot.forEach((person) => {
                const { name } = person.data();

                emailsToNames[person.id] = name;
            });

            return emailsToNames;
        });

const fetchPerson = (email) =>
    firebase.firestore()
        .collection('people')
        .doc(email)
        .get()
        .then((doc) => doc.data());

module.exports = {
    createPerson,
    fetchPeople,
    fetchEmails,
    fetchPerson
};
