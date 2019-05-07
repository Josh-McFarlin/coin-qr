import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import _ from 'lodash';
import {
    Card, CardHeader, Row, Col, Button, ButtonGroup
} from 'shards-react';

import AddressQRCode from '../frontend/components/AddressList/QRCode';
import AddressListViewer from '../frontend/components/AddressList/AddressListViewer';
import Error from './_error';
import urls from '../utils/urls';
import LoadingCardBody from '../frontend/components/LoadingElements/LoadingCardBody';


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

class ViewPage extends React.PureComponent {
    static async getInitialProps({ query, res }) {
        const locals = _.get(res, 'locals', {});

        return {
            page: locals.page,
            userId: locals.userId,
            error: locals.error
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false
        };
    }

    toggleModal = () => {
        this.setState((prevState) => ({
            modalOpen: !prevState.modalOpen
        }));
    };

    render() {
        const { classes, userId, isMobile, page, error } = this.props;
        const { modalOpen } = this.state;

        if (_.has(error, 'statusCode')) {
            return (
                <Error
                    statusCode={error.statusCode}
                    statusMessage={error.statusMessage}
                />
            );
        }

        const thisUrl = `https://coinqr.io${urls.qr.view(page.postId)}`;

        const isOwner =
            _.has(page, 'owner')
            && _.has(page, 'owner')
            && _.isString(userId)
            && page.owner === userId;

        return (
            <Row className={classes.fullHeight}>
                <Col className={`${classes.fullHeight} ${classes.flexColumn}`}>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className={classes.header}>
                                    {_.get(page, 'data.title')}
                                </CardHeader>
                                <LoadingCardBody isLoading={_.isNil(page) || _.isNil(userId)}>
                                    {(_.has(page, 'data.caption') && page.data.caption.length > 0) && (
                                        <p>
                                            {_.get(page, 'data.caption')}
                                        </p>
                                    )}
                                    <ButtonGroup className={classes.buttonGroup}>
                                        {isOwner && (
                                            <Button
                                                theme='primary'
                                                href={urls.qr.edit(page.postId)}
                                            >
                                                Edit Page
                                            </Button>
                                        )}

                                        <Button
                                            theme='primary'
                                            onClick={this.toggleModal}
                                        >
                                            View QR
                                        </Button>
                                    </ButtonGroup>
                                </LoadingCardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row className={classes.flexFill}>
                        <Col className={isMobile ? null : classes.fullHeight}>
                            <AddressListViewer
                                className={classes.fullHeight}
                                addresses={_.get(page, 'data.addresses', [])}
                            />

                            <AddressQRCode
                                modalOpen={modalOpen}
                                modalInfo={{
                                    address: thisUrl,
                                    coinType: 'Page'
                                }}
                                closeModal={this.toggleModal}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

ViewPage.propTypes = {
    classes: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    error: PropTypes.object
};

ViewPage.defaultProps = {
    userId: null,
    error: null
};

export default withStyles(styles)(ViewPage);
