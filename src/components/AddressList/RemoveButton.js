import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Fade, Button } from 'shards-react';
import { isMobile } from 'react-device-detect';


const styles = () => ({
    button: {
        width: 32,
        height: 32,
        padding: 0,
        margin: 0,
        borderRadius: '100%',
        fontWeight: 'bolder',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const RemoveButton = ({ classes, fadeRemove, removeRow }) => {
    if (isMobile) {
        return (
            <Button
                className={classes.button}
                outline
                pill
                theme='secondary'
                onClick={removeRow}
            >
                X
            </Button>
        );
    }

    return (
        <Fade in={fadeRemove}>
            <Button
                className={classes.button}
                outline
                pill
                theme='secondary'
                onClick={removeRow}
            >
                X
            </Button>
        </Fade>
    );
};

RemoveButton.propTypes = {
    classes: PropTypes.object.isRequired,
    fadeRemove: PropTypes.bool.isRequired,
    removeRow: PropTypes.func.isRequired
};

export default withStyles(styles)(RemoveButton);
