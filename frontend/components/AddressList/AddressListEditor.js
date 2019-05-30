import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import {
    Alert, Collapse, Card, CardHeader, CardBody, ListGroup, Button, FormFeedback,
    Modal, ModalBody, ModalHeader, ModalFooter, Form, FormInput, FormGroup
} from 'shards-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';
import VirtualizedSelect from 'react-virtualized-select';
import WAValidator from 'multicoin-address-validator';

import AddressRow from './AddressRow';
import AvailableCoins from '../../utils/availableCoins';


const styles = (theme) => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 700
    },
    rowContainer: {
        margin: `${theme.spacing.unit}px 0`
    },
    body: {
        overflowX: 'hidden',
        overflowY: 'auto'
    }
});

const reorder = (list, startIndex, endIndex) => {
    const result = _.cloneDeep(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const urlRegex = /https?:\/\//;

const validURL = (str) => str.match(urlRegex);

const validateAddress = (address, coinType) => {
    if (_.isNil(coinType)) {
        return {
            newValid: false,
            validMessage: 'Please select a coin type!'
        };
    }

    if (_.isEmpty(address)) {
        return {
            newValid: false,
            validMessage: 'Please provide an address!'
        };
    }

    if (address.length >= 60) {
        return {
            newValid: false,
            validMessage: 'Please provide an address!'
        };
    }

    if (address.includes(' ')) {
        return {
            newValid: false,
            validMessage: 'An address cannot contain a space!'
        };
    }

    if (validURL(address)) {
        return {
            newValid: false,
            validMessage: 'Provide an address, not a URL!'
        };
    }

    try {
        const valid = WAValidator.validate(address, coinType);

        return {
            newValid: valid,
            validMessage: valid ? null : `Not a valid ${coinType} address!`
        };
    } catch (e) {
        return {
            newValid: true,
            validMessage: 'Coin address validation not supported, but the address might be valid.'
        };
    }
};

class AddressListEditor extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            newCoinType: null,
            newAddress: '',
            newValid: false
        };
    }

    onDragEnd = (result) => {
        const { addresses, updateAddresses } = this.props;

        if (!result.destination) {
            return;
        }

        const newAddresses = reorder(
            addresses,
            result.source.index,
            result.destination.index
        );

        updateAddresses(newAddresses);
    };

    toggleModal = () => {
        this.setState((prevState) => ({
            modalOpen: !prevState.modalOpen
        }));
    };

    handleChange = (props) => {
        const name = _.get(props, 'target.name', 'newCoinType');
        const value = _.get(props, 'target.value', props);

        if (name === 'newAddress') {
            this.setState((prevState) => ({
                newAddress: value,
                ...validateAddress(value, prevState.newCoinType.value)
            }));
        } else {
            this.setState({
                [name]: value
            });
        }
    };

    addAddress = () => {
        const { addresses, updateAddresses } = this.props;
        const { newCoinType, newAddress, newValid } = this.state;

        if (newValid) {
            const newItem = {
                coin: newCoinType.value,
                address: newAddress
            };

            updateAddresses([
                newItem,
                ...addresses
            ]);

            this.setState({
                newCoinType: null,
                newAddress: ''
            });

            this.toggleModal();
        } else {
            this.setState((prevState) => ({
                newAddress: prevState.newAddress != null ? prevState.newAddress : ''
            }));
        }
    };

    removeAddress = (index) => {
        const { addresses, updateAddresses } = this.props;

        const newAddresses = [...addresses];

        newAddresses.splice(index, 1);

        updateAddresses(newAddresses);
    };

    render() {
        const { classes, className, addresses, error } = this.props;
        const { modalOpen, newAddress, newCoinType, newValid, validMessage } = this.state;

        return (
            <React.Fragment>
                <Card className={className}>
                    <CardHeader className={classes.header}>
                        Address List
                        <Button
                            theme='info'
                            onClick={this.toggleModal}
                        >
                            Add New Address
                        </Button>
                    </CardHeader>
                    <Collapse open={_.get(error, 'type') === 'addresses'}>
                        <Alert theme='danger'>
                            {_.get(error, 'message')}
                        </Alert>
                    </Collapse>
                    <CardBody className={classes.body}>
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId='droppable'>
                                {(providedDrop) => (
                                    <div
                                        {...providedDrop.droppableProps}
                                        ref={providedDrop.innerRef}
                                    >
                                        <ListGroup>
                                            {addresses.map((item, index) => (
                                                <Draggable
                                                    key={item.address}
                                                    draggableId={item.address}
                                                    index={index}
                                                >
                                                    {(providedDrag) => (
                                                        <div
                                                            className={classes.rowContainer}
                                                            ref={providedDrag.innerRef}
                                                            {...providedDrag.draggableProps}
                                                            {...providedDrag.dragHandleProps}
                                                        >
                                                            <AddressRow
                                                                address={item.address}
                                                                coinType={item.coin}
                                                                editing
                                                                removeRow={() => this.removeAddress(index)}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {providedDrop.placeholder}
                                        </ListGroup>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </CardBody>
                </Card>

                <Modal
                    open={modalOpen}
                    size='lg'
                    toggle={this.toggleModal}
                >
                    <ModalHeader>New Address</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <label>Coin Type</label>
                                <VirtualizedSelect
                                    options={AvailableCoins}
                                    onChange={this.handleChange}
                                    value={newCoinType}
                                />
                                <FormFeedback
                                    valid={false}
                                    style={{
                                        display: _.isObject(newCoinType) ? 'none' : 'block'
                                    }}
                                >
                                    Please provide a coin type!
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <label>Coin Address</label>
                                <FormInput
                                    name='newAddress'
                                    invalid={!newValid}
                                    placeholder='Address'
                                    className='mb-2'
                                    onChange={this.handleChange}
                                    value={newAddress}
                                />
                                <FormFeedback>
                                    {_.defaultTo(validMessage, 'Not a valid address!')}
                                </FormFeedback>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            theme='secondary'
                            onClick={this.toggleModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            theme='success'
                            onClick={this.addAddress}
                        >
                            Add
                        </Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

AddressListEditor.propTypes = {
    classes: PropTypes.object.isRequired,
    addresses: PropTypes.arrayOf(
        PropTypes.shape({
            coin: PropTypes.string.isRequired,
            address: PropTypes.string.isRequired
        })
    ).isRequired,
    updateAddresses: PropTypes.func.isRequired,
    error: PropTypes.object,
    className: PropTypes.string
};

AddressListEditor.defaultProps = {
    error: null,
    className: null
};

export default withStyles(styles)(AddressListEditor);
