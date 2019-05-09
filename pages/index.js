import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Row, Col, Card, CardBody, CardHeader } from 'shards-react';

import urls from '../utils/urls';


const styles = () => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 700
    }
});

class IndexPage extends React.PureComponent {
    render() {
        const { classes } = this.props;

        return (
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className={classes.header}>
                                    What
                                </CardHeader>
                                <CardBody>
                                    Using QR Codes for cryptocurrency is not always an easy process.
                                    <ul>
                                        <li>
                                            Because wallet addresses are long, generated QR codes are overly complex and sometimes hard to scan.
                                        </li>
                                        <li>
                                            Additionally, wallet owners may want to provide several different addresses on a medium, but the
                                            large size of QR codes makes this difficult.
                                        </li>
                                        <li>
                                            Furthermore, a wallet owner may want to change a wallet address after distributing a QR Code.
                                        </li>
                                    </ul>

                                    <br />

                                    CryptoQR solves these problems and more
                                    <ul>
                                        <li>
                                            Wallet owners can create a single page to host a collection of
                                            addresses for any number of different cryptocurrencies
                                        </li>
                                        <li>
                                            After creating a QR Page, wallet owners can distribute the QR Code
                                            or url for this page, and edit and add wallet addresses at any time
                                        </li>
                                        <li>
                                            QR Page urls are relatively short, which means they can use simple and
                                            easily readable QR Codes
                                        </li>
                                    </ul>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className={classes.header}>
                                    Why
                                </CardHeader>
                                <CardBody>
                                    <p>
                                        This tool was created after seeing a growing number of artists including
                                        cryptocurrency donation QR codes on their artwork.
                                    </p>
                                    <p>
                                        In order to keep their artwork as clean as possible, most artists limit
                                        their artwork to include only a single donation QR code, but this restricts
                                        donations to only those who own the single cryptocurrency.
                                    </p>
                                    <p>
                                        One of the many use cases this tool enables is allowing artists to provide
                                        a single QR code on their artwork, but accept donations in any number of cryptocurrencies.
                                        And if they later decide to change the receiving address of a wallet, they can easily change
                                        the address online instead of having to paint over the old QR Code.
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card
                                tag='a'
                                href={urls.qr.view('yP4m9')}
                            >
                                <CardHeader className={classes.header}>
                                    Support This Project
                                </CardHeader>
                                <CardBody>
                                    <p>
                                        You can find the QR Page for this tool here.
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

IndexPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(IndexPage);
