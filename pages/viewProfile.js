import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import _ from 'lodash';
import { Card, CardHeader, Row, Col, ListGroup } from 'shards-react';
import { isMobile } from 'react-device-detect';

import Error from './_error';
import { fetchProfile, fetchRecent, fetchPage } from '../frontend/firebase/actions';
import AddressListViewer from '../frontend/components/AddressList/AddressListViewer';
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

class ViewProfilePage extends React.PureComponent {
    static async getInitialProps({ query, res }) {
        const locals = _.get(res, 'locals', {});

        console.log('locals2', locals);

        return {
            myUserId: locals.userId
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            error: null,
            profile: null,
            featuredPage: null,
            recentPages: []
        };
    }

    componentDidMount() {
        const { router } = this.props;
        const profileId = _.get(router, 'query.id');

        fetchProfile(profileId)
            .then((profile) => {
                this.setState({
                    profile
                });

                const featured = _.get(profile, 'data.featuredPage.featuredPage');

                if (_.isString(featured) && _.get(profile, 'data.featuredPage.public', false)) {
                    fetchPage(featured)
                        .then((featuredPage) => {
                            this.setState({
                                featuredPage
                            });
                        });
                }

                fetchRecent(profile.userId)
                    .then((recentPages) => {
                        this.setState({
                            recentPages
                        });
                    });
            })
            .catch(() => {
                this.setState({
                    error: {
                        message: 'Profile Page Not Found',
                        statusCode: 404
                    }
                });
            });
    }


    render() {
        const { classes } = this.props;
        const { error, profile, featuredPage, recentPages } = this.state;

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

ViewProfilePage.propTypes = {
    classes: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(ViewProfilePage));
