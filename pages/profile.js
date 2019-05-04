import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import _ from 'lodash';
import { Card, CardHeader, Row, Col, ListGroup } from 'shards-react';
import { connect } from 'react-redux';
import Hashids from 'hashids';
import { isMobile } from 'react-device-detect';
import shortHash from 'short-hash';

import Error from './_error';
import { fetchProfile, fetchRecent, fetchPage } from '../src/redux/actions';
import { FETCH_PROFILE_FAILURE } from '../src/redux/actions/profiles/types';
import AddressListViewer from '../src/components/AddressList/AddressListViewer';
import PageSection from '../src/components/PageSection/PageSection';
import LoadingCardBody from '../src/components/LoadingElements/LoadingCardBody';


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

class ProfilePage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            goToError: false
        };
    }

    componentDidMount() {
        const { dispatch, user, router } = this.props;

        let profileId = _.get(router, 'query.id');
        const userId = _.get(user, 'uid');

        console.log('userId', userId)

        if (_.isNil(profileId) && _.isString(userId)) {
            profileId = shortHash(userId);

            console.log(shortHash(userId));
        }

        if (_.isString(userId)) {
            dispatch(fetchRecent(userId));
        }

        if (_.isString(profileId)) {
            dispatch(fetchProfile(profileId))
                .then(({ type, payload }) => {
                    if (type === FETCH_PROFILE_FAILURE) {
                        this.setState({
                            goToError: true
                        });
                    }

                    return payload;
                })
                .then(({ profile }) => {
                    const featured = _.get(profile, 'data.featuredPage.featuredPage');

                    if (_.isString(featured)) {
                        dispatch(fetchPage(featured));
                    }
                });
        } else {
            this.setState({
                goToError: true
            });
        }
    }

    render() {
        const { classes, profile, featuredPage, recentPages } = this.props;
        const { goToError } = this.state;

        if (goToError) {
            return (
                <Error
                    statusCode={404}
                    statusMessage='Profile Page Not Found'
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
                            <Row>
                                <Col className={classes.profileName}>
                                    <b>
                                        {_.get(profile, 'data.name.name')}
                                    </b>
                                </Col>
                            </Row>
                            <Row className={classes.rowNoPadding}>
                                <Col>
                                    <img
                                        className={classes.profilePicture}
                                        src={_.get(profile, 'data.picture.picture')}
                                        alt='Profile'
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={10}>
                            {_.get(profile, 'data.bio')}
                        </Col>
                    </Row>
                </LoadingCardBody>
            </Card>
        );

        const addressSection = (
            <AddressListViewer
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
                        <Row>
                            <Col>
                                {featuredSection}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {addressSection}
                            </Col>
                        </Row>
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
                        <Row className={classes.flexFill}>
                            <Col>
                                {addressSection}
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={4} className={`${classes.fullHeight} ${classes.flexColumn}`}>
                        <Row>
                            <Col>
                                {featuredSection}
                            </Col>
                        </Row>
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

ProfilePage.propTypes = {
    classes: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.object,
    featuredPage: PropTypes.object,
    recentPages: PropTypes.array
};

ProfilePage.defaultProps = {
    user: null,
    profile: null,
    featuredPage: null,
    recentPages: null
};

const styledPage = withRouter(withStyles(styles)(ProfilePage));

export default connect((state) => {
    const { auth, profiles, pages } = state;

    return {
        user: _.get(auth, 'user'),
        profile: _.get(profiles, 'profile'),
        featuredPage: _.get(pages, 'page'),
        recentPages: _.get(pages, 'recentPages')
    };
})(styledPage);
