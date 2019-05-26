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
    <Modal open={isOpen} size='lg' toggle={() => {}}>
        <ModalHeader>Security and Terms of Use</ModalHeader>
        <ModalBody className={classes.modalBody}>
            <h5>Security</h5>
            <ul>
                <li>
                    Authentication and data-storage are provided by Google Firebase.
                    Login information is completely handled by Google and stored on their servers,
                    this tool never stores any login information (or any data period) on a separate server.
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
            </ul>
            <h5>Terms of Use</h5>
            <ul>
                <li>
                    This tool and its creator is not responsible for lost or incorrectly sent funds.
                    There is zero guarantee the QR Code points to the correct address, so always verify the address
                    before sending a transaction!
                </li>
                <li>
                    Furthermore, his tool and all information, software, photos, text, and other materials found on this website,
                    is intended for lawful use by members of the general public who are over the age of 13 and citizens of the United States or Canada.
                    Those who choose to access this tool from other locations do so on their own initiative and are responsible for compliance with applicable local laws.
                </li>
                <li>
                    Your continued use of this tool shows you voluntarily agree with all terms, and acknowledge
                    this tool and its owner is not, and cannot, be held liable for any issues that may arise while
                    using the tool.
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
