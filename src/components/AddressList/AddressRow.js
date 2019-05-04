/* eslint-disable import/no-dynamic-require */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { ListGroupItem } from 'shards-react';

import RemoveButton from './RemoveButton';


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
        color: '#ffffff',
        backgroundColor: '#3e3e3e',
        borderRadius: '100%',
        fontWeight: 'bolder',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    qrHolder: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    qrAddress: {
        marginTop: theme.spacing.unit,
        marginBottom: 0,
        textOverflow: 'ellipsis'
    }
});

class CoinList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            fadeRemove: false
        };
    }

    fadeIn = () => {
        this.setState({
            fadeRemove: true
        });
    };

    fadeOut = () => {
        this.setState({
            fadeRemove: false
        });
    };

    handleAddressClick = () => {
        const { onAddressClick, address, coinType } = this.props;

        onAddressClick({
            address,
            coinType
        });
    };

    render() {
        const { classes, coinType, address, removeRow, editing } = this.props;
        const { fadeRemove } = this.state;

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
                    onMouseEnter={this.fadeIn}
                    onMouseLeave={this.fadeOut}
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
                        <RemoveButton
                            classes={classes}
                            fadeRemove={fadeRemove}
                            removeRow={removeRow}
                        />
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
