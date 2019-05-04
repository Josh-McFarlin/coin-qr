import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';


const config = {
    apiKey: 'AIzaSyCOxxu5T3uuy6ySoI5pOSb3mza739pIUV4',
    authDomain: 'crypto-qr.firebaseapp.com',
    databaseURL: 'https://crypto-qr.firebaseio.com',
    projectId: 'crypto-qr',
    storageBucket: 'crypto-qr.appspot.com',
    messagingSenderId: '444062320028'
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export default firebase;
