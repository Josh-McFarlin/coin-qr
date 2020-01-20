import React from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import {
    Card, CardHeader, CardBody, CardFooter, Row, Col,
    Form, FormGroup, FormInput, FormTextarea, Button
} from 'shards-react';
import Error from './_error';
import AddressListEditor from '../src/components/AddressList/AddressListEditor';
import noProfilePic from '../public/static/images/noProfilePic.png';
import { getProfile, updateProfile } from '../src/firebase/actions';
import urls from '../utils/urls';
import firebase from '../src/firebase';


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

const classes = {};

const EditProfilePage = () => {
    const router = useRouter();
    const [userId, setUserId] = React.useState(null);
    const [profile, setProfile] = React.useState(null);
    const [data, setData] = React.useState({
        title: '',
        caption: '',
        addresses: []
    });
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        firebase.auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    setUserId(user.uid);

                    getProfile(user.uid)
                        .then((prof) => setProfile(prof))
                        .catch(() => setError({
                            statusCode: 404,
                            message: 'Unable to get profile!'
                        }));
                } else {
                    setUserId(null);
                }
            }, () => {
                setUserId(null);
            });
    }, []);

    const handleChange = ({ target: { id, value } }) => {
        const dataCopy = _.cloneDeep(data);

        setData(_.set(dataCopy, id, value));
    };

    const updateAddresses = (addresses) => {
        if (_.get(error, 'type') === 'addresses' && addresses.length > 0) {
            setError(null);
        }

        setData((prevData) => {
            const dataCopy = { ...prevData };

            return _.set(dataCopy, 'addresses', addresses);
        });
    };

    const submitJson = async () => {
        if (data.addresses.length > 10) {
            setError({
                type: 'addresses',
                message: `Error: A profile can contain a maximum of 10 addresses, please remove at least ${data.addresses.length - 10} addresses!`
            });
        } else if (!_.isEqual(data, profile.data)) {
            await updateProfile(userId, data)
                .then(() => router.push(urls.profile.view(userId)));
        } else {
            await router.push(urls.profile.view(userId));
        }
    };

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
                                    onChange={handleChange}
                                    value={_.get(data, 'name', '')}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor='picture'>Profile Picture URL</label>
                                <FormInput
                                    id='picture'
                                    onChange={handleChange}
                                    value={_.get(data, 'picture', '')}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor='bio'>Bio</label>
                                <FormTextarea
                                    id='bio'
                                    onChange={handleChange}
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
                    onClick={submitJson}
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
            error={error}
            updateAddresses={updateAddresses}
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
};

export default EditProfilePage;
