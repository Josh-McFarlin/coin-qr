/* eslint-disable import/no-dynamic-require */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'shards-react';
import QRImg from 'qrcode.react';
import _ from 'lodash';


const styles = (theme) => ({
    header: {
        display: 'flex',
        justifyContent: 'center'
    },
    title: {
        display: 'flex',
        alignItems: 'center'
    },
    titleIcon: {
        marginRight: theme.spacing.unit
    },
    qrHolder: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    qrAddress: {
        margin: `${2 * theme.spacing.unit}px 0`,
        width: '100%',
        wordBreak: 'break-all',
        textAlign: 'center',
        fontSize: 20
    }
});

const QRCode = ({ classes, modalOpen, modalInfo, closeModal }) => {
    if (_.isNil(modalInfo)) return null;

    const { coinType, address } = modalInfo;

    let imagePath;
    try {
        imagePath = require(`cryptocurrency-icons/svg/color/${coinType.toLowerCase()}.svg`);
    } catch (error) {
        imagePath = require('cryptocurrency-icons/svg/color/generic.svg');
    }

    return (
        <Modal
            open={modalOpen}
            size='lg'
            toggle={closeModal}
        >
            <ModalHeader
                className={classes.header}
                titleClass={classes.title}
            >
                {imagePath && (
                    <img
                        src={imagePath}
                        alt={coinType}
                        className={classes.titleIcon}
                    />
                )}
                {coinType} QR Code
            </ModalHeader>
            <ModalBody>
                <div className={classes.qrHolder}>
                    <QRImg
                        size={256}
                        value={address}
                    />
                    <p className={classes.qrAddress}>{address}</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    theme='primary'
                    onClick={closeModal}
                >
                    Ok
                </Button>
            </ModalFooter>
        </Modal>
    );
};

QRCode.propTypes = {
    classes: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    modalInfo: PropTypes.shape({
        coin: PropTypes.string,
        address: PropTypes.string
    }),
    closeModal: PropTypes.func.isRequired
};

QRCode.defaultProps = {
    modalInfo: null
};

export default withStyles(styles)(QRCode);
