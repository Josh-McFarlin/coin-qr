const admin = require('firebase-admin');


let firebaseCert;

try {
    firebaseCert = require('../../serviceAccountKey.json');
} catch (e) {
    firebaseCert = JSON.parse(process.env.FIREBASE_CERT);
}

const config = {
    credential: admin.credential.cert(firebaseCert),
    apiKey: 'AIzaSyA837S0q33uSvnEK5L6Rba3b6HCnJS2x0Q',
    authDomain: 'kitchen-jobs-88e5c.firebaseapp.com',
    databaseURL: 'https://kitchen-jobs-88e5c.firebaseio.com',
    projectId: 'kitchen-jobs-88e5c',
    storageBucket: '',
    messagingSenderId: '786920529497',
    appId: '1:786920529497:web:4b636eefb03ef01f'
};

if (!admin.apps.length) {
    admin.initializeApp(config);
}

module.exports = admin;
