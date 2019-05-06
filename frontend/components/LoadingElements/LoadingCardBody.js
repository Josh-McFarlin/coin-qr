import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from 'react-jss';
import { CardBody } from 'shards-react';


const styles = () => ({
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 700
    }
});

class LoadingCardBody extends React.PureComponent {
    render() {
        const { classes, className, isLoading, children } = this.props;

        return (
            <CardBody className={classNames(className, classes.card, { [classes.loading]: isLoading })}>
                {isLoading ? (
                    <div className='spinner-border' role='status'>
                        <span className='sr-only'>Loading...</span>
                    </div>
                ) :
                    children
                }
            </CardBody>
        );
    }
}

LoadingCardBody.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    children: PropTypes.node
};

LoadingCardBody.defaultProps = {
    className: null,
    isLoading: false,
    children: null
};

export default withStyles(styles)(LoadingCardBody);
