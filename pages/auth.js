import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import firebase from '../src/firebase';


const uiConfig = {
    signInFlow: 'redirect',
    signInSuccessUrl: '/profile',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ]
};

export default class AuthPage extends React.PureComponent {
    render() {
        return (
            <div>
                <h3>Please sign-in:</h3>
                <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                />
            </div>
        );
    }
}
