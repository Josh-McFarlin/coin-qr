import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import _ from 'lodash';
import {
    Button, Card, CardBody, CardHeader, CardFooter, Row, Col, Collapse,
    Form, FormGroup, FormInput, FormTextarea, FormFeedback, Alert
} from 'shards-react';

import Error from './_error';
import AddressListEditor from '../frontend/components/AddressList/AddressListEditor';
import DeleteDialog from '../frontend/components/AddressList/DeleteDialog';
import { addPage, updatePage, deletePage } from '../frontend/firebase/actions';
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
    floatRight: {
        float: 'right'
    },
    editor: {
        minHeight: 300
    }
});

class EditPage extends React.PureComponent {
    static async getInitialProps({ query, res }) {
        const locals = _.get(res, 'locals', {});

        return {
            page: locals.page,
            isNewPage: locals.page == null,
            userId: locals.userId,
            error: locals.error
        };
    }

    constructor(props) {
        super(props);

        const page = _.get(props, 'page', null);
        const data = _.get(page, 'data', {
            title: '',
            caption: '',
            addresses: []
        });

        this.state = {
            data,
            showDelete: false,
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
        const { router, userId, isNewPage, page } = this.props;
        const { data } = this.state;

        if (_.isNil(data.title) || data.title.length === 0) {
            this.setState({
                editError: {
                    type: 'title',
                    message: 'Please provide a title!'
                }
            });
        } else if (data.addresses.length === 0) {
            this.setState({
                editError: {
                    type: 'addresses',
                    message: 'Error: Please add at least one address!'
                }
            });
        } else if (data.addresses.length > 15) {
            this.setState({
                editError: {
                    type: 'addresses',
                    message: `Error: A page can contain a maximum of 15 addresses, please remove at least ${data.addresses.length - 15} addresses!`
                }
            });
        } else if (isNewPage) {
            addPage(data, userId)
                .then((createdPage) => {
                    router.push(urls.qr.view(createdPage.postId));
                })
                .catch(() => {
                    this.setState({
                        editError: 'An error occurred while creating the page. Please try again later.'
                    });
                });
        } else if (!_.isEqual(data, page.data)) {
            updatePage(data, page.id)
                .then(() => {
                    router.push(urls.qr.view(page.postId));
                })
                .catch(() => {
                    this.setState({
                        editError: 'An error occurred while editing the page. Please try again later.'
                    });
                });
        } else {
            router.push(urls.qr.view(page.postId));
        }
    };

    toggleDelete = () => {
        this.setState((prevState) => ({
            showDelete: !prevState.showDelete
        }));
    };

    handleDelete = () => {
        const { page, router } = this.props;

        deletePage(page.id)
            .then(() => router.push(urls.home()));
    };

    render() {
        const { classes, isNewPage, error, userId } = this.props;
        const { data, editError, showDelete } = this.state;

        if (_.isObject(error)) {
            return (
                <Error
                    statusCode={error.code}
                    statusMessage={error.message}
                />
            );
        }

        return (
            <React.Fragment>
                {_.isNil(userId) && (
                    <Alert theme='info' fade={false}>
                        You are attempting to create a page while not logged-in.
                        This is fine, but you will not be able to edit or delete the page in the future.
                    </Alert>
                )}
                <Collapse open={_.isString(editError)}>
                    <Alert theme='danger' fade={false}>
                        {_.isString(editError) && (
                            editError
                        )}
                    </Alert>
                </Collapse>
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <Card>
                                    <CardHeader className={classes.header}>
                                        {isNewPage ? 'New QR Page' : 'Editing QR Page'}
                                    </CardHeader>
                                    <CardBody>
                                        <Form>
                                            <FormGroup>
                                                <label htmlFor='title'>Title</label>
                                                <FormInput
                                                    id='title'
                                                    onChange={this.handleChange}
                                                    value={data.title}
                                                    invalid={_.get(editError, 'type') === 'title' || data.title.length > 50}
                                                />
                                                <FormFeedback>
                                                    Please provide a title no longer than 50 characters in length.
                                                </FormFeedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <label htmlFor='caption'>Caption</label>
                                                <FormTextarea
                                                    id='caption'
                                                    onChange={this.handleChange}
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
                                        {!isNewPage && (
                                            <Button
                                                theme='danger'
                                                onClick={this.toggleDelete}
                                            >
                                                Delete Page
                                            </Button>
                                        )}
                                        <Button
                                            className={classes.floatRight}
                                            theme='success'
                                            onClick={this.submitJson}
                                        >
                                            {isNewPage ? 'Create Page' : 'Save Page'}
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
                                    error={editError}
                                    updateAddresses={this.updateAddresses}
                                />

                                <DeleteDialog
                                    modalOpen={showDelete}
                                    toggleModal={this.toggleDelete}
                                    deletePage={this.handleDelete}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

EditPage.propTypes = {
    classes: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    userId: PropTypes.string,
    isNewPage: PropTypes.bool,
    error: PropTypes.object,
    page: PropTypes.object
};

EditPage.defaultProps = {
    userId: null,
    isNewPage: true,
    error: null,
    page: null
};

export default withStyles(styles)(EditPage);
