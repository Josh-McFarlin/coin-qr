import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import {
    Alert, Collapse, Card, CardHeader, CardBody, ListGroup, Button, FormFeedback,
    Modal, ModalBody, ModalHeader, ModalFooter, Form, FormInput, FormGroup
} from 'shards-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';
import _ from 'lodash';

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

    handleChange = (e, meta) => {
        const name = e.target ? e.target.name : meta.name;
        const value = e.target ? e.target.value : e;

        this.setState({
            [name]: value
        }, () => {
            this.setState((prevState) => ({
                newValid: _.isObject(prevState.newCoinType)
                && _.isString(prevState.newAddress)
                && prevState.newAddress.length !== 0
            }));
        });
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
        const { modalOpen, newAddress, newCoinType } = this.state;

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
                                <Select
                                    name='newCoinType'
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
                                    invalid={newAddress.length === 0}
                                    placeholder='Address'
                                    className='mb-2'
                                    onChange={this.handleChange}
                                    value={newAddress}
                                />
                                <FormFeedback>
                                    Please provide an address!
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
