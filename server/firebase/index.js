const admin = require('firebase-admin');

const serviceAccount = require('../admin-credentials.json');


const config = {
    credential: admin.credential.cert(serviceAccount),
    apiKey: 'AIzaSyCOxxu5T3uuy6ySoI5pOSb3mza739pIUV4',
    authDomain: 'crypto-qr.firebaseapp.com',
    databaseURL: 'https://crypto-qr.firebaseio.com',
    projectId: 'crypto-qr',
    storageBucket: 'crypto-qr.appspot.com',
    messagingSenderId: '444062320028'
};

if (!admin.apps.length) {
    admin.initializeApp(config);
}

module.exports = admin;
