import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'shards-react';


const styles = (theme) => ({
    header: {
        display: 'flex',
        justifyContent: 'center'
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

class DeleteDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            sure: false
        };
    }

    componentDidUpdate(prevProps) {
        const { modalOpen } = this.props;

        if (prevProps.modalOpen !== modalOpen) {
            this.setState({
                sure: false
            });
        }
    }

    tryDelete = () => {
        const { deletePage } = this.props;
        const { sure } = this.state;

        if (sure) {
            deletePage();
        } else {
            this.setState({
                sure: true
            });
        }
    };

    render() {
        const { classes, modalOpen, toggleModal } = this.props;
        const { sure } = this.state;

        return (
            <Modal
                open={modalOpen}
                size='md'
                toggle={toggleModal}
            >
                <ModalHeader className={classes.header}>
                    Delete Page?
                </ModalHeader>
                <ModalBody>
                    Warning, you are about to permanently delete this page. It cannot be recovered under any circumstances!
                </ModalBody>
                <ModalFooter>
                    <Button
                        theme='primary'
                        onClick={toggleModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        theme='danger'
                        onClick={this.tryDelete}
                    >
                        {sure ? 'Delete Page' : 'Are You Sure?'}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

DeleteDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    deletePage: PropTypes.func.isRequired
};

export default withStyles(styles)(DeleteDialog);
