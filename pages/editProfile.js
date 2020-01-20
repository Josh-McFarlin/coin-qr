import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import _ from 'lodash';
import {
    Card, CardHeader, CardBody, CardFooter, Row, Col,
    Form, FormGroup, FormInput, FormTextarea, Button
} from 'shards-react';

import Error from './_error';
import AddressListEditor from '../frontend/components/AddressList/AddressListEditor';
import noProfilePic from '../public/static/images/noProfilePic.png';
import { updateProfile } from '../frontend/firebase/actions';
import urls from '../utils/urls';


const styles = () => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 700
    },
    fullHeight: {
        height: '100%'
    },
    profileCol: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profilePicture: {
        width: '100%',
        maxWidth: 150,
        borderRadius: '50%'
    },
    rowNoPadding: {
        paddingBottom: '0 !important'
    },
    floatRight: {
        float: 'right'
    }
});

class EditProfilePage extends React.PureComponent {
    static async getInitialProps({ query, res }) {
        const { error, profile } = _.get(res, 'locals', {});

        return {
            error,
            profile
        };
    }

    constructor(props) {
        super(props);

        const profile = _.get(props, 'profile', null);
        const data = _.get(profile, 'data', {});

        this.state = {
            data,
            editError: null
        };
    }

    handleChange = ({ target: { id, value } }) => {
        const { data } = this.state;
        const dataCopy = _.cloneDeep(data);

        this.setState({
            data: _.set(dataCopy, id, value)
        });
    };

    updateAddresses = (addresses) => {
        const { data } = this.state;
        const dataCopy = _.cloneDeep(data);

        this.setState((prevState) => ({
            data: _.set(dataCopy, 'addresses', addresses),
            editError: _.get(prevState, 'editError.type') === 'addresses' && addresses.length > 0 ? null : prevState.editError
        }));
    };

    submitJson = () => {
        const { router, profile } = this.props;
        const { data } = this.state;

        if (data.addresses.length > 10) {
            this.setState({
                editError: {
                    type: 'addresses',
                    message: `Error: A profile can contain a maximum of 10 addresses, please remove at least ${data.addresses.length - 10} addresses!`
                }
            });
        } else if (!_.isEqual(data, profile.data)) {
            updateProfile(data, profile.profileId)
                .then(() => router.push(urls.profile.view(profile.profileId)));
        } else {
            router.push(urls.profile.view(profile.profileId));
        }
    };

    render() {
        const { classes, error } = this.props;
        const { data, editError } = this.state;

        if (_.isObject(error)) {
            return (
                <Error
                    statusCode={error.statusCode}
                    statusMessage={error.message}
                />
            );
        }

        const pictureSrc =
            _.has(data, 'picture') && !_.isEmpty(data.picture) ?
                data.picture : noProfilePic;

        const profileSection = (
            <Card>
                <CardHeader className={classes.header}>
                    Profile
                </CardHeader>
                <CardBody>
                    <Row className={classes.rowNoPadding}>
                        <Col sm={2}>
                            <Row className={classes.fullHeight}>
                                <Col className={classes.profileCol}>
                                    <img
                                        className={classes.profilePicture}
                                        src={pictureSrc}
                                        alt='Profile'
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={10}>
                            <Form>
                                <FormGroup>
                                    <label htmlFor='name'>Name</label>
                                    <FormInput
                                        id='name'
                                        onChange={this.handleChange}
                                        value={_.get(data, 'name', '')}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label htmlFor='picture'>Profile Picture URL</label>
                                    <FormInput
                                        id='picture'
                                        onChange={this.handleChange}
                                        value={_.get(data, 'picture', '')}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label htmlFor='bio'>Bio</label>
                                    <FormTextarea
                                        id='bio'
                                        onChange={this.handleChange}
                                        value={_.get(data, 'bio', '')}
                                    />
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter>
                    <Button
                        theme='success'
                        onClick={this.submitJson}
                        className={classes.floatRight}
                    >
                        Save Page
                    </Button>
                </CardFooter>
            </Card>
        );

        const addressSection = (
            <AddressListEditor
                className={classes.fullHeight}
                addresses={_.get(data, 'addresses', [])}
                error={editError}
                updateAddresses={this.updateAddresses}
            />
        );

        return (
            <Row>
                <Col>
                    <Row>
                        <Col>
                            {profileSection}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {addressSection}
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

EditProfilePage.propTypes = {
    classes: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    error: PropTypes.object
};

EditProfilePage.defaultProps = {
    error: undefined
};

export default withRouter(withStyles(styles)(EditProfilePage));
