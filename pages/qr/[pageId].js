import React from 'react';
import { useRouter } from 'next/router';
import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import { Card, CardHeader, CardBody, Row, Col, Button, ButtonGroup } from 'shards-react';
import firebase from '../../src/firebase';
import { getPage } from '../../src/firebase/actions/pages';
import AddressQRCode from '../../src/components/AddressList/QRCode';
import AddressListViewer from '../../src/components/AddressList/AddressListViewer';
import urls from '../../utils/urls';


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

const ViewPage = () => {
    const { query } = useRouter();
    const [page, setPage] = React.useState(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [userId, setUserId] = React.useState(null);

    const isMobile = false;

    const { pageId } = query;

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
        if (pageId != null) {
            getPage(pageId)
                .then((newPage) => setPage(newPage));
        }
    }, [pageId]);

    const toggleModal = () => {
        setModalOpen((prevState) => !prevState);
    };

    const thisUrl = `${urls.base}${urls.qr.view(pageId)}`;

    const isOwner =
        has(page, 'owner')
        && isString(userId)
        && page.owner === userId;

    return (
        <Row className={classes.fullHeight}>
            <Col className={`${classes.fullHeight} ${classes.flexColumn}`}>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader className={classes.header}>
                                {get(page, 'data.title')}
                            </CardHeader>
                            <CardBody>
                                {(has(page, 'data.caption') && page.data.caption.length > 0) && (
                                    <p>
                                        {get(page, 'data.caption')}
                                    </p>
                                )}
                                <ButtonGroup className={classes.buttonGroup}>
                                    {isOwner && (
                                        <Button
                                            theme='primary'
                                            href={urls.qr.edit(pageId)}
                                        >
                                            Edit Page
                                        </Button>
                                    )}

                                    <Button
                                        theme='primary'
                                        onClick={toggleModal}
                                    >
                                        View QR
                                    </Button>
                                </ButtonGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className={classes.flexFill}>
                    <Col className={isMobile ? null : classes.fullHeight}>
                        <AddressListViewer
                            className={classes.fullHeight}
                            addresses={get(page, 'data.addresses', [])}
                        />

                        <AddressQRCode
                            modalOpen={modalOpen}
                            modalInfo={{
                                address: thisUrl,
                                coinType: 'Page'
                            }}
                            closeModal={toggleModal}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default ViewPage;
