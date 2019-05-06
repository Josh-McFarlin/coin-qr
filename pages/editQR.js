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

        const postId = _.get(query, 'id');

        return {
            postId,
            newPage: _.isNil(postId) || _.isEmpty(postId),
            userId: locals.userId
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            page: null,
            data: {
                title: '',
                caption: '',
                addresses: []
            },
            showDelete: false
        };
    }

    componentDidMount() {
        const { postId } = this.props;

        if (_.isString(postId) && !_.isEmpty(postId)) {
            fetchPage(postId)
                .then((page) => {
                    this.setState({
                        page,
                        data: page.data
                    });
                })
                .catch(() => {
                    this.setState({
                        goToError: {
                            code: 404,
                            message: 'QR Page Not Found'
                        }
                    });
                });
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
        const { postId, router, userId, newPage } = this.props;
        const { page, data } = this.state;

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
            addPage(data, postId, userId)
                .then(() => router.push(urls.qr.view(postId)));
        } else if (!_.isEqual(data, page.data)) {
            updatePage(data, postId)
                .then(() => router.push(urls.qr.view(postId)));
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
        const { postId, router } = this.props;

        deletePage(postId)
            .then(() => router.push(urls.home()));
    };

    render() {
        const { classes, newPage } = this.props;
        const { data, error, showDelete, goToError } = this.state;

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
    router: PropTypes.object.isRequired,
    userId: PropTypes.string,
    newPage: PropTypes.bool
};

EditPage.defaultProps = {
    userId: null,
    newPage: true
};

export default withRouter(withStyles(styles)(EditPage));
