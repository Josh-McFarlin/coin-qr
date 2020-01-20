import React from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import {
    Card,
    CardHeader,
    CardBody,
    Col,
    ListGroup,
    Row,
    Button
} from 'shards-react';
import classNames from 'classnames';
import Error from '../_error';
import AddressListViewer from '../../src/components/AddressList/AddressListViewer';
import PageSection from '../../src/components/PageSection/PageSection';
import noProfilePic from '../../public/static/images/noProfilePic.png';
import PageQRCode from '../../src/components/AddressList/QRCode';
import urls from '../../utils/urls';
import { getProfile } from '../../src/firebase/actions/profiles';
import { getRecent } from '../../src/firebase/actions/pages';
import firebase from '../../src/firebase';


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
    },
    qrButton: {
        float: 'right'
    },
    buttonHolder: {
        marginLeft: 'auto'
    },
    noLeftPadding: {
        paddingLeft: 0
    }
});

const classes = {};

const ViewProfilePage = () => {
    const { query } = useRouter();
    const [modalOpen, setModalOpen] = React.useState(false);
    const [userId, setUserId] = React.useState(null);
    const [profile, setProfile] = React.useState(null);
    const [recentPages, setRecentPages] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        firebase.auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    setUserId(null);
                }
            }, () => {
                setUserId(null);
            });
    }, []);

    React.useEffect(() => {
        const { uid } = query;

        if (uid != null) {
            getProfile(uid)
                .then((prof) => setProfile(prof))
                .catch(() => setError({
                    statusCode: 404,
                    message: 'Unable to get profile!'
                }));

            getRecent(uid)
                .then((recent) => setRecentPages(recent))
                .catch(() => setError({
                    statusCode: 404,
                    message: 'Unable to get recent!'
                }));
        }
    }, [query]);

    const toggleModal = () => setModalOpen((prevState) => !prevState);

    if (_.isObject(error)) {
        return (
            <Error
                statusCode={error.statusCode}
                statusMessage={error.message}
            />
        );
    }

    const thisUrl = `${urls.base}${urls.profile.view(userId)}`;

    const isOwner =
        _.has(profile, 'userId')
        && _.isString(userId)
        && profile.userId === userId;

    const pictureSrc =
        _.has(profile, 'data.picture') && !_.isEmpty(profile.data.picture) ?
            profile.data.picture : noProfilePic;

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
                                    src={pictureSrc}
                                    alt='Profile'
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={10} className={classes.flexColumn}>
                        <Row className={classes.flexFill}>
                            {_.get(profile, 'data.bio')}
                        </Row>
                        <Row className={classes.rowNoPadding}>
                            <div className={classes.buttonHolder}>
                                {isOwner && (
                                    <Button
                                        className='mr-3'
                                        theme='primary'
                                        href={urls.myProfile.edit()}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                                <Button
                                    theme='primary'
                                    onClick={toggleModal}
                                    className={classes.qrButton}
                                >
                                    View QR
                                </Button>
                                <PageQRCode
                                    modalOpen={modalOpen}
                                    modalInfo={{
                                        address: thisUrl,
                                        coinType: 'Page'
                                    }}
                                    closeModal={toggleModal}
                                />
                            </div>
                        </Row>
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

    if ('mob' === 0) {
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
                <Col sm={8} className={classNames(classes.fullHeight, classes.flexColumn)}>
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
                <Col sm={4} className={classNames(classes.fullHeight, classes.flexColumn, classes.noLeftPadding)}>
                    <Row className={classes.flexFill}>
                        <Col className={classes.fullHeight}>
                            {recentSection}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ViewProfilePage;
