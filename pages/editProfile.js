import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import _ from 'lodash';
import { Card, CardHeader, Row, Col, ListGroup } from 'shards-react';
import { isMobile } from 'react-device-detect';
import shortHash from 'short-hash';

import Error from './_error';
import firebase from '../frontend/firebase';
import { fetchProfile, fetchRecent, fetchPage } from '../frontend/firebase/actions';
import AddressListEditor from '../frontend/components/AddressList/AddressListEditor';
import PageSection from '../frontend/components/PageSection/PageSection';
import LoadingCardBody from '../frontend/components/LoadingElements/LoadingCardBody';
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
        textAlign: 'center'
    },
    profilePicture: {
        width: '100%',
        maxWidth: 150,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '50%'
    },
    scrollBody: {
        overflowX: 'hidden',
        overflowY: 'auto'
    },
    rowNoPadding: {
        paddingBottom: '0 !important'
    }
});

class EditProfilePage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            error: null
        };
    }

    componentDidMount() {
        const { dispatch, router } = this.props;

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let profileId = _.get(router, 'query.id');
                const userId = _.get(user, 'uid');

                if (_.isNil(profileId) && _.isString(userId)) {
                    profileId = shortHash(userId);
                }

                if (_.isString(userId)) {
                    dispatch(fetchRecent(userId));
                }

                if (_.isString(profileId)) {
                    dispatch(fetchProfile(profileId))
                        .then(({ type, payload }) => {
                            if (type === FETCH_PROFILE_FAILURE) {
                                this.setState({
                                    error: {
                                        message: 'Profile Page Not Found',
                                        statusCode: 404
                                    }
                                });
                            }

                            return payload;
                        })
                        .then(({ profile }) => {
                            const featured = _.get(profile, 'data.featuredPage.featuredPage');

                            if (_.isString(featured) && _.get(profile, 'data.featuredPage.public', false)) {
                                dispatch(fetchPage(featured));
                            }
                        })
                        .catch(() => {
                            this.setState({
                                error: {
                                    message: 'Profile Page Not Found',
                                    statusCode: 404
                                }
                            });
                        });
                } else {
                    this.setState({
                        error: {
                            message: 'Profile Page Not Found',
                            statusCode: 404
                        }
                    });
                }
            } else {
                this.setState({
                    error: {
                        message: 'You must be signed in before viewing your profile page!',
                        statusCode: 400
                    }
                });
            }
        });
    }

    render() {
        const { classes, profile, featuredPage, recentPages } = this.props;
        const { error } = this.state;

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
                <LoadingCardBody isLoading={_.isNil(profile)}>
                    <Row className={classes.rowNoPadding}>
                        <Col sm={2}>
                            {_.get(profile, 'data.name.public', false) && (
                                <Row>
                                    <Col className={classes.profileName}>
                                        <b>
                                            {_.get(profile, 'data.name.name')}
                                        </b>
                                    </Col>
                                </Row>
                            )}
                            {_.get(profile, 'data.picture.public', false) && (
                                <Row className={classes.rowNoPadding}>
                                    <Col>
                                        <img
                                            className={classes.profilePicture}
                                            src={_.get(profile, 'data.picture.picture', noProfilePic)}
                                            alt='Profile'
                                        />
                                    </Col>
                                </Row>
                            )}
                        </Col>
                        {_.get(profile, 'data.bio.public', false) && (
                            <Col sm={10}>
                                {_.get(profile, 'data.bio.bio')}
                            </Col>
                        )}
                    </Row>
                </LoadingCardBody>
            </Card>
        );

        const addressSection = (
            <AddressListEditor
                className={classes.fullHeight}
                addresses={_.get(profile, 'data.addresses.addresses')}
            />
        );

        const featuredSection = (
            <Card className={classes.fullHeight}>
                <CardHeader className={classes.header}>
                    Featured Page
                </CardHeader>
                <LoadingCardBody isLoading={_.isNil(featuredPage)}>
                    <ListGroup>
                        <PageSection page={featuredPage} />
                    </ListGroup>
                </LoadingCardBody>
            </Card>
        );

        const otherSection = (
            <Card className={classes.fullHeight}>
                <CardHeader className={classes.header}>
                    Recent Pages
                </CardHeader>
                <LoadingCardBody
                    className={classes.scrollBody}
                    isLoading={_.isNil(recentPages)}
                >
                    <ListGroup>
                        {_.map(recentPages, (page, index) => (
                            <PageSection
                                key={_.get(page, 'data.title', index)}
                                page={page}
                            />
                        ))}
                    </ListGroup>
                </LoadingCardBody>
            </Card>
        );

        if (isMobile) {
            return (
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                {profileSection}
                            </Col>
                        </Row>
                        {_.get(profile, 'data.featuredPage.public', false) && (
                            <Row>
                                <Col>
                                    {featuredSection}
                                </Col>
                            </Row>
                        )}
                        {_.get(profile, 'data.addresses.public', false) && (
                            <Row>
                                <Col>
                                    {addressSection}
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col>
                                {otherSection}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
        }

        return (
            <React.Fragment>
                <Row className={classes.fullHeight}>
                    <Col sm={8} className={`${classes.fullHeight} ${classes.flexColumn}`}>
                        <Row>
                            <Col>
                                {profileSection}
                            </Col>
                        </Row>
                        {_.get(profile, 'data.addresses.public', false) && (
                            <Row className={classes.flexFill}>
                                <Col>
                                    {addressSection}
                                </Col>
                            </Row>
                        )}
                    </Col>
                    <Col sm={4} className={`${classes.fullHeight} ${classes.flexColumn}`}>
                        {_.get(profile, 'data.featuredPage.public', false) && (
                            <Row>
                                <Col>
                                    {featuredSection}
                                </Col>
                            </Row>
                        )}
                        <Row className={classes.flexFill}>
                            <Col className={classes.fullHeight}>
                                {otherSection}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

EditProfilePage.propTypes = {
    classes: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.object,
    featuredPage: PropTypes.object,
    recentPages: PropTypes.array
};

EditProfilePage.defaultProps = {
    profile: null,
    featuredPage: null,
    recentPages: null
};

export default withRouter(withStyles(styles)(EditProfilePage));
