const admin = require('firebase-admin');


let firebaseCert;

try {
    firebaseCert = require('../../admin-credentials.json');
} catch (e) {
    firebaseCert = JSON.parse(process.env.FIREBASE_CERT);
}

const config = {
    credential: admin.credential.cert(firebaseCert),
    apiKey: 'AIzaSyAXG55l9hgKgTaSmJU8Tw5YUjHQUC3ATVk',
    authDomain: 'coin-qr.firebaseapp.com',
    databaseURL: 'https://coin-qr.firebaseio.com',
    projectId: 'coin-qr',
    storageBucket: 'coin-qr.appspot.com',
    messagingSenderId: '29450757109',
    appId: '1:29450757109:web:6a045db5e040c596'
};

if (!admin.apps.length) {
    admin.initializeApp(config);
}

module.exports = admin;
