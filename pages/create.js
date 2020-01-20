import React from 'react';
import Router from 'next/router';
import set from 'lodash/set';
import isObject from 'lodash/isObject';
import isNil from 'lodash/isNil';
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Button,
    Collapse,
    Alert,
    Form,
    FormGroup, FormInput, FormFeedback, FormTextarea, CardFooter
} from 'shards-react';
import { addPage, getPage } from '../frontend/firebase/actions/pages';
import AddressListEditor from '../frontend/components/AddressList/AddressListEditor';
import urls from '../utils/urls';
import firebase from '../frontend/firebase';


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

const CreatePage = () => {
    const [data, setData] = React.useState({
        title: '',
        caption: '',
        addresses: []
    });
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        firebase.auth()
            .onAuthStateChanged(async (user) => {
                if (!user) {
                    await Router.push(urls.auth());
                }
            }, async () => {
                await Router.push(urls.auth());
            });
    }, []);

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
        if (isNil(data.title) || data.title.length === 0) {
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
            await addPage(data)
                .then((newPage) => {
                    Router.push(urls.qr.view(newPage.id));
                })
                .catch(() => {
                    setError({
                        type: 'general',
                        message: 'An error occurred while creating the page. Please try again later.'
                    });
                });
        }
    };

    return (
        <React.Fragment>
            <Collapse open={isObject(error)}>
                <Alert theme='danger' fade={false}>
                    {error.type === 'general' && (
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
                                    Create QR Page
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <FormGroup>
                                            <label htmlFor='title'>Title</label>
                                            <FormInput
                                                id='title'
                                                onChange={handleChange}
                                                value={data.title}
                                                invalid={error.type === 'title' || data.title.length > 50}
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
                                                Please provide a title no longer than 200 characters in length.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                                <CardFooter>
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

export default CreatePage;
