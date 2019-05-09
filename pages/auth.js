import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import _ from 'lodash';
import {
    Collapse, Alert, Button, Form, FormGroup, InputGroup, InputGroupAddon,
    InputGroupText, FormInput, Card, CardHeader, CardBody, CardFooter
} from 'shards-react';

import { loginUser, registerNewUser, resetPassword } from '../frontend/firebase/actions';
import TermsModal from '../frontend/components/Terms/TermsModal';


const styles = () => ({
    otherText: {
        textAlign: 'center',
        cursor: 'pointer',
        margin: 0,
        padding: 5,
        border: '1px solid #becad6',
        borderRadius: 5,
        background: '#f9fafb',
        fontSize: 14
    },
    clickable: {
        cursor: 'pointer'
    }
});

class AuthPage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: null,
            isRegistering: false,
            success: null,
            termsOpen: false
        };
    }

    toggleTerms = () => {
        this.setState((prevState) => ({
            termsOpen: !prevState.termsOpen
        }));
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handlePasswordReset = () => {
        const { email } = this.state;

        resetPassword(email)
            .then(() => {
                this.setState({
                    success: 'Successfully reset password. Please check your email.'
                });
            })
            .catch(() => {
                this.setState({
                    error: 'Failed to reset password. Is the email correct?'
                });
            });
    };

    handleAuth = () => {
        const { email, password, isRegistering } = this.state;

        if (isRegistering) {
            registerNewUser(email, password)
                .catch((error) => {
                    const errorCode = error.code;

                    let errorTarget;
                    let errorMessage;

                    if (errorCode === 'auth/invalid-email') {
                        errorTarget = 'email';
                        errorMessage = 'The entered email is invalid!';
                    } else if (errorCode === 'auth/email-already-in-use') {
                        errorTarget = 'email';
                        errorMessage = 'An account already exists with the provided email address!';
                    } else if (errorCode === 'auth/weak-password') {
                        errorTarget = 'password';
                        errorMessage = 'The provided password is too weak!';
                    } else {
                        errorTarget = 'email';
                        errorMessage = 'Could not register at this time. Please try again later!';
                    }

                    this.setState({
                        error: {
                            target: errorTarget,
                            message: errorMessage
                        }
                    });
                });
        } else {
            loginUser(email, password)
                .catch((error) => {
                    const errorCode = error.code;

                    let errorTarget;
                    let errorMessage;

                    if (errorCode === 'auth/invalid-email') {
                        errorTarget = 'email';
                        errorMessage = 'The entered email is invalid!';
                    } else if (errorCode === 'auth/wrong-password') {
                        errorTarget = 'password';
                        errorMessage = 'The entered password is invalid!';
                    } else if (errorCode === 'auth/user-not-found') {
                        errorTarget = 'email';
                        errorMessage = 'The entered email is not a user!';
                    } else {
                        errorTarget = 'email';
                        errorMessage = 'Could not auth at this time. Please try again later!';
                    }

                    this.setState({
                        error: {
                            target: errorTarget,
                            message: errorMessage
                        }
                    });
                });
        }
    };

    toggleRegister = () => {
        this.setState((prevState) => ({
            isRegistering: !prevState.isRegistering,
            error: null
        }));
    };

    render() {
        const { classes } = this.props;
        const { email, password, error, isRegistering, success, termsOpen } = this.state;

        return (
            <Card>
                <CardHeader>
                    {isRegistering ? 'Register' : 'Login'}
                </CardHeader>
                <CardBody>
                    <Collapse open={isRegistering}>
                        <Alert
                            className={classes.clickable}
                            theme='danger'
                            onClick={this.toggleTerms}
                        >
                            By registering, you agree with the <u>Terms of Use</u>.
                        </Alert>
                    </Collapse>
                    <Collapse open={!_.isNil(success)}>
                        <Alert theme='success'>
                            {_.isPlainObject(success) ? success.message : success}
                        </Alert>
                    </Collapse>
                    <Collapse open={!_.isNil(error)}>
                        <Alert theme='danger'>
                            {_.isPlainObject(error) ? error.message : error}
                        </Alert>
                    </Collapse>
                    <Form>
                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon type='prepend'>
                                    <InputGroupText>Email</InputGroupText>
                                </InputGroupAddon>
                                <FormInput
                                    name='email'
                                    type='email'
                                    onChange={this.handleChange}
                                    value={email}
                                />
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon type='prepend'>
                                    <InputGroupText>Password</InputGroupText>
                                </InputGroupAddon>
                                <FormInput
                                    name='password'
                                    type='password'
                                    onChange={this.handleChange}
                                    value={password}
                                />
                            </InputGroup>
                        </FormGroup>
                    </Form>
                    {!isRegistering && (
                        <FormGroup>
                            <p
                                className={classes.otherText}
                                onClick={this.handlePasswordReset}
                            >
                                    Forgot Your Password?
                            </p>
                        </FormGroup>
                    )}
                    <FormGroup>
                        <p
                            className={classes.otherText}
                            onClick={this.toggleRegister}
                        >
                            {isRegistering ? 'Already Have An Account? Login' : 'Need An Account? Register'}
                        </p>
                    </FormGroup>
                </CardBody>
                <CardFooter>
                    <Button
                        theme='primary'
                        onClick={this.handleAuth}
                    >
                        {isRegistering ? 'Register' : 'Login'}
                    </Button>
                </CardFooter>

                <TermsModal
                    isOpen={termsOpen}
                    toggleModal={this.toggleTerms}
                />
            </Card>
        );
    }
}

AuthPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AuthPage);
