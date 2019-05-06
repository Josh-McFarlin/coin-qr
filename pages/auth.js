/* eslint-disable import/no-dynamic-require */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import _ from 'lodash';
import {
    Collapse, Alert, Button, Form, FormGroup, InputGroup, InputGroupAddon,
    InputGroupText, FormInput, Card, CardHeader, CardBody, CardFooter
} from 'shards-react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { loginUser, registerNewUser, resetPassword } from '../src/redux/actions/auth';
import { createProfile } from '../src/redux/actions/profiles';
import {
    AUTH_SUCCESSFUL,
    AUTH_FAILURE,
    RESET_PASSWORD_SUCCESSFUL,
    RESET_PASSWORD_FAILURE
} from '../src/redux/actions/auth/types';
import urls from '../src/utils/urls';
import TermsModal from '../src/components/Terms/TermsModal';


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
        const { dispatch } = this.props;
        const { email } = this.state;

        dispatch(resetPassword(email)).then(({ type }) => {
            if (type === RESET_PASSWORD_SUCCESSFUL) {
                this.setState({
                    success: 'Successfully reset password. Please check your email.'
                });
            } else if (type === RESET_PASSWORD_FAILURE) {
                this.setState({
                    error: 'Failed to reset password. Is the email correct?'
                });
            }
        });
    };

    handleAuth = () => {
        const { dispatch, router } = this.props;
        const { email, password, isRegistering } = this.state;

        if (isRegistering) {
            dispatch(registerNewUser(email, password))
                .then(({ type, payload }) => {
                    if (type === AUTH_FAILURE) {
                        this.setState({
                            error: payload.authFailure
                        });
                    } else if (type === AUTH_SUCCESSFUL) {
                        router.push(urls.home());
                    }

                    return payload;
                })
                .then(({ user }) => dispatch(createProfile(user)));
        } else {
            dispatch(loginUser(email, password))
                .then(({ type, payload }) => {
                    if (type === AUTH_FAILURE) {
                        this.setState({
                            error: payload.authFailure
                        });
                    } else if (type === AUTH_SUCCESSFUL) {
                        router.push(urls.home());
                    }
                });
        }
    };

    toggleRegister = () => {
        this.setState((prevState) => ({
            isRegistering: !prevState.isRegistering
        }));
    };

    render() {
        const { classes, user, router } = this.props;
        const { email, password, error, isRegistering, success, termsOpen } = this.state;

        if (_.isObject(user)) {
            router.push(urls.home());
        }

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
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    user: PropTypes.object
};

AuthPage.defaultProps = {
    user: null
};

const styledPage = withRouter(withStyles(styles)(AuthPage));

export default connect(
    (state) => {
        const { auth } = state;

        return {
            user: _.get(auth, 'user')
        };
    }
)(withRouter(styledPage));
