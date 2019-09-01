import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { ListGroup, ListGroupItem, FormCheckbox } from 'shards-react';
import _ from 'lodash';

import theme from '../../utils/theme';


const styles = () => ({
    group: {
        '&:not(:last-of-type)': {
            marginBottom: theme.spacing.unit * 2
        }
    },
    ownJob: {
        textDecoration: 'underline',
        cursor: 'pointer',
        backgroundColor: '#ffcbb1'
    },
    checkbox: {
        float: 'right',
        margin: 0
    }
});

class KitchenJob extends React.PureComponent {
    render() {
        const { classes, job, userEmail, emailsToNames, toggleSwitcher } = this.props;

        return (
            <ListGroup className={classes.group}>
                <ListGroupItem theme='secondary'>
                    <b>{job.title}</b>
                    <FormCheckbox
                        className={classes.checkbox}
                        checked={job.completed}
                    />
                </ListGroupItem>
                {job.people.map((email) => (
                    <ListGroupItem
                        key={email}
                        className={email === userEmail ? classes.ownJob : ''}
                        onClick={toggleSwitcher}
                    >
                        {_.get(emailsToNames, email, email)}
                    </ListGroupItem>
                ))}
            </ListGroup>
        );
    }
}

KitchenJob.propTypes = {
    classes: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired,
    userEmail: PropTypes.string,
    emailsToNames: PropTypes.object.isRequired,
    toggleSwitcher: PropTypes.func.isRequired
};

KitchenJob.defaultProps = {
    userEmail: null
};

export default withStyles(styles)(KitchenJob);
