import React from 'react';
import { useRouter } from 'next/router';
import set from 'lodash/set';
import isNil from 'lodash/isNil';
import {
    Button, Card, CardBody, CardHeader, CardFooter, Row, Col, Collapse,
    Form, FormGroup, FormInput, FormTextarea, FormFeedback, Alert
} from 'shards-react';
import ErrorPage from '../../_error';
import firebase from '../../../src/firebase';
import { getPage, updatePage, deletePage } from '../../../src/firebase/actions/pages';
import AddressListEditor from '../../../src/components/AddressList/AddressListEditor';
import urls from '../../../utils/urls';
import _ from 'lodash';


const styles = (theme) => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 700
    },
    buttonGroup: {
        float: 'right'
    },
    qrHolder: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    holderUrl: {
        margin: `${2 * theme.spacing.unit}px 0`,
        width: '100%',
        wordBreak: 'break-all',
        textAlign: 'center'
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
    }
});

const classes = {};

const EditPage = () => {
    const router = useRouter();
    const [page, setPage] = React.useState(null);
    const [data, setData] = React.useState({
        title: '',
        caption: '',
        addresses: []
    });
    const [userId, setUserId] = React.useState(null);
    const [infoLoading, setInfoLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const { pageId } = router.query;

    React.useEffect(() => {
        firebase.auth()
            .onAuthStateChanged((user) => {
                setUserId(user.uid);
                setInfoLoading(false);
            }, () => {
                setInfoLoading(false);
            });
    }, []);

    React.useEffect(() => {
        if (pageId != null) {
            getPage(pageId)
                .then((newPage) => setPage(newPage))
                .catch(() => setInfoLoading(false));
        }
    }, [pageId]);

    if (!infoLoading && (userId == null || page == null)) {
        return (
            <ErrorPage />
        );
    }

    const handleChange = ({ target: { id, value } }) => {
        setData((prevData) => {
            const dataCopy = { ...prevData };

            return set(dataCopy, id, value);
        });
    };

    const updateAddresses = (addresses) => {
        if (error.type === 'addresses' && addresses.length > 0) {
            setError(null);
        }

        setData((prevData) => {
            const dataCopy = { ...prevData };

            return set(dataCopy, 'addresses', addresses);
        });
    };

    const submitJson = async () => {
        const title = _.get(data, 'title');

        if (isNil(title) || title.length === 0) {
            setError({
                type: 'title',
                message: 'Please provide a title!'
            });
        } else if (data.addresses.length === 0) {
            setError({
                type: 'addresses',
                message: 'Error: Please add at least one address!'
            });
        } else if (data.addresses.length > 15) {
            setError({
                type: 'addresses',
                message: `Error: A page can contain a maximum of 15 addresses, please remove at least ${data.addresses.length - 15} addresses!`
            });
        } else {
            await updatePage(pageId, data)
                .then(() => {
                    router.push(urls.qr.view(pageId));
                })
                .catch(() => {
                    setError({
                        type: 'general',
                        message: 'An error occurred while editing the page. Please try again later.'
                    });
                });
        }
    };

    const handleDelete = async () => {
        const conf = window.confirm('Are you sure you want to delete this page?');

        if (conf === true) {
            await deletePage(pageId)
                .then(() => router.push(urls.home()));
        }
    };

    return (
        <React.Fragment>
            <Collapse open={_.get(error, 'type') === 'general'}>
                <Alert theme='danger' fade={false}>
                    {_.get(error, 'type') === 'general' && (
                        error.message
                    )}
                </Alert>
            </Collapse>
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className={classes.header}>
                                    Edit QR Page
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <FormGroup>
                                            <label htmlFor='title'>Title</label>
                                            <FormInput
                                                id='title'
                                                onChange={handleChange}
                                                value={data.title}
                                                invalid={_.get(error, 'type') === 'title' || data.title.length > 50}
                                            />
                                            <FormFeedback>
                                                Please provide a title no longer than 50 characters in length.
                                            </FormFeedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <label htmlFor='caption'>Caption</label>
                                            <FormTextarea
                                                id='caption'
                                                onChange={handleChange}
                                                value={data.caption}
                                                invalid={data.caption.length > 200}
                                            />
                                            <FormFeedback>
                                                Please provide a caption no longer than 200 characters in length.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                                <CardFooter>
                                    <Button
                                        theme='danger'
                                        onClick={handleDelete}
                                    >
                                        Delete Page
                                    </Button>
                                    <Button
                                        className={classes.floatRight}
                                        theme='success'
                                        onClick={submitJson}
                                    >
                                        Save Page
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <AddressListEditor
                                className={classes.editor}
                                addresses={data.addresses}
                                error={error}
                                updateAddresses={updateAddresses}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default EditPage;
