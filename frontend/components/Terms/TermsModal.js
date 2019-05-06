import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'shards-react';
import withStyles from 'react-jss';


const styles = () => ({
    modalBody: {
        maxHeight: '60vh',
        overflow: 'auto'
    }
});

const TermsModal = ({ classes, isOpen, toggleModal }) => (
    <Modal open={isOpen} size='lg' toggle={toggleModal}>
        <ModalHeader>Security and Terms of Use</ModalHeader>
        <ModalBody className={classes.modalBody}>
            <h5>Security</h5>
            <ul>
                <li>
                    Authentication and data-storage are provided by Google Firebase.
                    Login information is completely handled by Google and stored on their servers,
                    this tool never stores any login information (on any data period) on its own server.
                </li>
                <li>
                    <a
                        href='https://github.com/josh-mcfarlin/crypto-qr'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        This tool is completely open-source, and can be viewed on GitHub!
                    </a>
                </li>
                <li>
                    The Terms of Use below sound scary, but that is only make sure you know that the owner
                    of this tool is not responsible for any issues with the tool or incorrectly sent funds.
                    I highly encourage you to review the GitHub repository to address any concerns.
                </li>
            </ul>
            <h5>Terms of Use</h5>
            <ul>
                <li>
                    This tool and its creator is not responsible for lost or incorrectly sent funds.
                    There is zero guarantee the QR Code points to the correct address, so always verify the address
                    before sending a transaction!
                </li>
                <li>
                    Your continued use of this tool shows you voluntarily agree with all terms, and acknowledge
                    CryptoQR and its owner is not, and cannot, be held liable for any issues that may arise while
                    using the tool.
                </li>
                <li>
                    This tool and all information, software, photos, text, and other materials found on this website,
                    is intended for lawful use by members of the general public who are over the age of 13 and citizens of the United States or Canada.
                </li>
                <li>
                    CryptoQR and its owner make no guarantee the tool (and mostly cryptocurrency in general) is legal in your jurisdiction.
                    Those who choose to access this tool from other locations do so on their own initiative and are responsible for compliance with applicable local laws.
                </li>
                <li>
                    In summary, by using this tool you acknowledge you are solely responsible for abiding all applicable regulations in your area,
                    and CryptoQR and its owner is not responsible for any funds or problems that arise.
                </li>
            </ul>
        </ModalBody>
        <ModalFooter>
            <Button
                theme='danger'
                href='https://google.com'
            >
                I Do Not Agree
            </Button>
            <Button
                theme='success'
                onClick={toggleModal}
            >
                I Agree
            </Button>
        </ModalFooter>
    </Modal>
);

TermsModal.propTypes = {
    classes: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired
};

export default withStyles(styles)(TermsModal);
