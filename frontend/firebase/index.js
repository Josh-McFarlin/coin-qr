import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';


const config = {
    apiKey: 'AIzaSyA837S0q33uSvnEK5L6Rba3b6HCnJS2x0Q',
    authDomain: 'kitchen-jobs-88e5c.firebaseapp.com',
    databaseURL: 'https://kitchen-jobs-88e5c.firebaseio.com',
    projectId: 'kitchen-jobs-88e5c',
    storageBucket: '',
    messagingSenderId: '786920529497',
    appId: '1:786920529497:web:4b636eefb03ef01f'
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export default firebase;
