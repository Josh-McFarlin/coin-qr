import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';


const config = {
    apiKey: 'AIzaSyAXG55l9hgKgTaSmJU8Tw5YUjHQUC3ATVk',
    authDomain: 'coin-qr.firebaseapp.com',
    databaseURL: 'https://coin-qr.firebaseio.com',
    projectId: 'coin-qr',
    storageBucket: 'coin-qr.appspot.com',
    messagingSenderId: '29450757109',
    appId: '1:29450757109:web:6a045db5e040c596'
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
}

export default firebase;
