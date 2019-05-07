import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import _ from 'lodash';
import {
    Card, CardHeader, CardBody, Row, Col, ListGroup,
    Form, FormGroup, FormInput, FormTextarea, FormFeedback
} from 'shards-react';

import Error from './_error';
import AddressListEditor from '../frontend/components/AddressList/AddressListEditor';
import PageSection from '../frontend/components/PageSection/PageSection';
import noProfilePic from '../static/images/noProfilePic.png';


const styles = () => ({
    actionButtons: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 700
    },
    fullWidth: {
        width: '100%'
    },
    fullHeight: {
        height: '100%'
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    flexFill: {
        flex: 1
    },
    profileName: {
        padding: 0
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
    scrollBody: {
        overflowX: 'hidden',
        overflowY: 'auto'
    },
    rowNoPadding: {
        paddingBottom: '0 !important'
    },
    noMarginBottom: {
        marginBottom: 0
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

    render() {
        const { classes, error, profile, isMobile } = this.props;

        if (_.isObject(error)) {
            return (
                <Error
                    statusCode={error.statusCode}
                    statusMessage={error.message}
                />
            );
        }

        const profileSection = (
            <Card>
                <CardHeader className={classes.header}>
                    Profile
                </CardHeader>
                <CardBody>
                    <Row className={classes.rowNoPadding}>
                        <Col sm={2}>
                            <Row>
                                <Col className={classes.profileName}>
                                    <FormGroup className={classes.noMarginBottom}>
                                        <label htmlFor='title'>Name</label>
                                        <FormInput
                                            id='name'
                                            // onChange={this.handleChange}
                                            value={_.get(profile, 'data.name')}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className={classes.rowNoPadding}>
                                <Col className={classes.profileCol}>
                                    <img
                                        className={classes.profilePicture}
                                        src={_.get(profile, 'data.picture', noProfilePic)}
                                        alt='Profile'
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={10}>
                            <FormGroup>
                                <label htmlFor='caption'>Bio</label>
                                <FormTextarea
                                    id='bio'
                                    // onChange={this.handleChange}
                                    value={_.get(profile, 'data.bio', '')}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        );

        const addressSection = (
            <AddressListEditor
                className={classes.fullHeight}
                addresses={_.get(profile, 'data.addresses', [])}
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
    isMobile: PropTypes.bool.isRequired,
    error: PropTypes.object
};

EditProfilePage.defaultProps = {
    error: undefined
};

export default withStyles(styles)(EditProfilePage);
