import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'shards-react';
import _ from 'lodash';
import VirtualizedSelect from 'react-virtualized-select';


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

class JobSwitcher extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    confirmSwitch = () => {
        const { closeModal } = this.props;

        closeModal();
    };

    render() {
        const { classes, modalOpen, closeModal } = this.props;

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
                    Job Switcher
                </ModalHeader>
                <ModalBody>
                    <div className={classes.qrHolder}>
                        <p className={classes.qrAddress}>yeeet</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        theme='warning'
                        onClick={closeModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        theme='primary'
                        onClick={this.confirmSwitch}
                    >
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

JobSwitcher.propTypes = {
    classes: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
};

export default withStyles(styles)(JobSwitcher);
