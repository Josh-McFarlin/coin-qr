import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import _ from 'lodash';
import { Card, CardHeader, CardBody, Col, ListGroup, Row } from 'shards-react';

import Error from './_error';
import AddressListViewer
    from '../frontend/components/AddressList/AddressListViewer';
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
        textAlign: 'center'
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
    }
});

class ViewProfilePage extends React.PureComponent {
    static async getInitialProps({ query, res }) {
        const { error, profile, featuredPage, recentPages } = _.get(res, 'locals', {});

        return {
            error,
            profile,
            featuredPage,
            recentPages
        };
    }

    render() {
        const { classes, error, profile, featuredPage, recentPages, isMobile } = this.props;

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
                                    <b>
                                        {_.get(profile, 'data.name')}
                                    </b>
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
                            {_.get(profile, 'data.bio')}
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        );

        const addressSection = (
            <AddressListViewer
                className={classes.fullHeight}
                addresses={_.get(profile, 'data.addresses', [])}
            />
        );

        const featuredSection = (
            <Card>
                <CardHeader className={classes.header}>
                    Featured Page
                </CardHeader>
                <CardBody>
                    <ListGroup>
                        <PageSection page={featuredPage} />
                    </ListGroup>
                </CardBody>
            </Card>
        );

        const recentSection = (
            <Card className={classes.fullHeight}>
                <CardHeader className={classes.header}>
                    Recent Pages
                </CardHeader>
                <CardBody className={classes.scrollBody}>
                    <ListGroup>
                        {_.map(recentPages, (page, index) => (
                            <PageSection
                                key={_.get(page, 'data.title', index)}
                                page={page}
                            />
                        ))}
                    </ListGroup>
                </CardBody>
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
                                {recentSection}
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
                                {recentSection}
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
    profile: PropTypes.object.isRequired,
    featuredPage: PropTypes.object.isRequired,
    recentPages: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    error: PropTypes.object
};

ViewProfilePage.defaultProps = {
    error: undefined
};

export default withStyles(styles)(ViewProfilePage);
