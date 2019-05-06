import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import _ from 'lodash';
import {
    Button, Card, CardBody, CardHeader, CardFooter, Row, Col,
    Form, FormGroup, FormInput, FormTextarea, FormFeedback
} from 'shards-react';

import { isMobile } from 'react-device-detect';
import Error from './_error';
import AddressListEditor from '../frontend/components/AddressList/AddressListEditor';
import DeleteDialog from '../frontend/components/AddressList/DeleteDialog';
import { fetchPage, addPage, updatePage, deletePage } from '../frontend/firebase/actions';
import urls from '../utils/urls';


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

class EditPage extends React.PureComponent {
    static async getInitialProps({ query, res }) {
        const locals = _.get(res, 'locals');

        console.log('locals2', locals);

        let postId = _.get(query, 'id');

        if (_.isNil(postId)) {
            const shortid = require('shortid');
            const Hashids = require('hashids');

            const hashKey = shortid.generate();
            const hashids = new Hashids(hashKey, 5);

            postId = hashids.encode(1);

            return {
                postId,
                newPage: true
            };
        }

        return fetchPage(postId)
            .then((page) => ({
                page,
                postId,
                newPage: false
            }))
            .catch(() => ({
                goToError: {
                    code: 404,
                    message: 'QR Page Not Found'
                }
            }));
    }

    constructor(props) {
        super(props);

        if (!props.newPage && _.isObject(_.get(props, 'page.data'))) {
            if (!_.has(props, 'page.owner') || !_.has(props, 'user.uid') || props.page.owner !== props.user.uid) {
                // props.router.push(urls.qr.view(props.postId));
            }

            this.state = {
                data: props.page.data,
                showDelete: false
            };
        } else {
            this.state = {
                data: {
                    title: '',
                    caption: '',
                    addresses: []
                },
                showDelete: false
            };
        }
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
            error: _.get(prevState, 'error.type') === 'addresses' && addresses.length > 0 ? null : prevState.error
        }));
    };

    submitJson = () => {
        const { dispatch, newPage, page, postId, router, user } = this.props;
        const { data } = this.state;

        if (_.isNil(data.title) || data.title.length === 0) {
            this.setState({
                error: {
                    type: 'title',
                    message: 'Please provide a title!'
                }
            });
        } else if (data.addresses.length === 0) {
            this.setState({
                error: {
                    type: 'addresses',
                    message: 'Error: Please add at least one address!'
                }
            });
        } else if (data.addresses.length > 15) {
            this.setState({
                error: {
                    type: 'addresses',
                    message: `Error: A page can contain a maximum of 15 addresses, please remove at least ${data.addresses.length - 15} addresses!`
                }
            });
        } else if (newPage) {
            const owner = _.get(user, 'uid');

            dispatch(addPage(data, postId, owner)).then(() =>
                router.push(urls.qr.view(postId)));
        } else if (!_.isEqual(data, page.data)) {
            dispatch(updatePage(data, postId)).then(() =>
                router.push(urls.qr.view(postId)));
        } else {
            router.push(urls.qr.view(postId));
        }
    };

    toggleDelete = () => {
        this.setState((prevState) => ({
            showDelete: !prevState.showDelete
        }));
    };

    handleDelete = () => {
        const { dispatch, postId, router } = this.props;

        dispatch(deletePage(postId)).then(() => router.push(urls.home()));
    };

    render() {
        const { classes, newPage, goToError } = this.props;
        const { data, error, showDelete } = this.state;

        if (_.isObject(goToError)) {
            return (
                <Error
                    statusCode={goToError.code}
                    statusMessage={goToError.message}
                />
            );
        }

        return (
            <Row className={classes.fullHeight}>
                <Col className={`${classes.fullHeight} ${classes.flexColumn}`}>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className={classes.header}>
                                    {newPage ? 'New QR Page' : 'Editing QR Page'}
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <FormGroup>
                                            <label htmlFor='title'>Title</label>
                                            <FormInput
                                                id='title'
                                                onChange={this.handleChange}
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
                            </Card>
                        </Col>
                    </Row>

                    <Row className={classes.flexFill}>
                        <Col className={isMobile ? null : classes.fullHeight}>
                            <AddressListEditor
                                className={classes.fullHeight}
                                addresses={data.addresses}
                                error={error}
                                updateAddresses={this.updateAddresses}
                            />

                            <DeleteDialog
                                modalOpen={showDelete}
                                toggleModal={this.toggleDelete}
                                deletePage={this.handleDelete}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card>
                                <CardFooter>
                                    <div className={classes.actionButtons}>
                                        <Button
                                            theme='danger'
                                            onClick={this.toggleDelete}
                                        >
                                        Delete
                                        </Button>
                                        <Button
                                            theme='primary'
                                            onClick={this.submitJson}
                                        >
                                        Save Page
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

EditPage.propTypes = {
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    newPage: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.object,
    router: PropTypes.object.isRequired,
    goToError: PropTypes.object,
    user: PropTypes.object
};

EditPage.defaultProps = {
    page: null,
    goToError: null,
    user: null
};

export default withRouter(withStyles(styles)(EditPage));
