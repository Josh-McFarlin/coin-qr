import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Card, CardHeader, ListGroup } from 'shards-react';
import _ from 'lodash';

import AddressRow from './AddressRow';
import AddressQRCode from './QRCode';
import LoadingCardBody from '../LoadingElements/LoadingCardBody';


const styles = (theme) => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 700
    },
    rowContainer: {
        '&:not(:first-of-type)': {
            paddingTop: theme.spacing.unit
        },
        '&:not(:last-of-type)': {
            paddingBottom: theme.spacing.unit
        }
    },
    body: {
        overflowX: 'hidden',
        overflowY: 'auto'
    }
});

class AddressListViewer extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            modalInfo: null
        };
    }

    closeModal = () => {
        this.setState({
            modalOpen: false
        });
    };

    onAddressClick = (modalInfo) => {
        this.setState({
            modalOpen: true,
            modalInfo
        });
    };

    render() {
        const { classes, className, addresses } = this.props;
        const { modalOpen, modalInfo } = this.state;

        return (
            <React.Fragment>
                <Card className={className}>
                    <CardHeader className={classes.header}>
                        Address List
                    </CardHeader>
                    <LoadingCardBody
                        className={classes.body}
                        isLoading={_.isNil(addresses)}
                    >
                        <ListGroup>
                            {_.map(addresses, (item) => (
                                <div
                                    className={classes.rowContainer}
                                    key={`${item.coin}-${item.address}`}
                                >
                                    <AddressRow
                                        address={item.address}
                                        coinType={item.coin}
                                        onAddressClick={this.onAddressClick}
                                    />
                                </div>
                            ))}
                        </ListGroup>
                    </LoadingCardBody>
                </Card>
                <AddressQRCode
                    modalOpen={modalOpen}
                    modalInfo={modalInfo}
                    closeModal={this.closeModal}
                />
            </React.Fragment>
        );
    }
}

AddressListViewer.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    addresses: PropTypes.arrayOf(PropTypes.shape({
        coin: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired
    }))
};

AddressListViewer.defaultProps = {
    className: null,
    addresses: null
};

export default withStyles(styles)(AddressListViewer);
