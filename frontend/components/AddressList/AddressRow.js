/* eslint-disable import/no-dynamic-require */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { ListGroupItem, Button } from 'shards-react';


const styles = (theme) => ({
    listItem: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
    },
    listItemAddress: {
        flex: 1,
        marginLeft: 2 * theme.spacing.unit,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    removeButton: {
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

class CoinList extends React.PureComponent {
    handleAddressClick = () => {
        const { onAddressClick, address, coinType } = this.props;

        onAddressClick({
            address,
            coinType
        });
    };

    render() {
        const { classes, coinType, address, removeRow, editing } = this.props;

        let imagePath;
        try {
            imagePath = require(`cryptocurrency-icons/svg/color/${coinType.toLowerCase()}.svg`);
        } catch (error) {
            imagePath = require('cryptocurrency-icons/svg/color/generic.svg');
        }

        return (
            <React.Fragment>
                <ListGroupItem
                    className={classes.listItem}
                    onClick={this.handleAddressClick}
                >
                    {imagePath && (
                        <img
                            src={imagePath}
                            alt={coinType}
                        />
                    )}
                    <div
                        className={classes.listItemAddress}
                        role='listitem'
                    >
                        {address}
                    </div>
                    {(removeRow && editing) && (
                        <Button
                            className={classes.removeButton}
                            outline
                            pill
                            theme='secondary'
                            onClick={removeRow}
                        >
                            X
                        </Button>
                    )}
                </ListGroupItem>
            </React.Fragment>
        );
    }
}

CoinList.propTypes = {
    classes: PropTypes.object.isRequired,
    coinType: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    removeRow: PropTypes.func,
    onAddressClick: PropTypes.func,
    editing: PropTypes.bool
};

CoinList.defaultProps = {
    removeRow: () => {},
    onAddressClick: () => {},
    editing: false
};

export default withStyles(styles)(CoinList);
