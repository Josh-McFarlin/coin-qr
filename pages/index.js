import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { ListGroup, ListGroupItem } from 'shards-react';
import moment from 'moment';
import _ from 'lodash';

import KitchenJob from '../frontend/components/KitchenJob';
import JobSwitcher from '../frontend/components/JobSwitcher';
import theme from '../frontend/utils/theme';
import { fetchJobs, fetchEmails } from '../frontend/firebase/actions';


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

class IndexPage extends React.PureComponent {
    static async getInitialProps() {
        const jobs = await fetchJobs();
        const emailsToNames = await fetchEmails();

        return {
            jobs,
            emailsToNames
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            showSwitcher: false
        };
    }

    toggleSwitcher = () => {
        this.setState((prevState) => ({
            showSwitcher: !prevState.showSwitcher
        }));
    };

    render() {
        const { classes, currentUser, jobs, emailsToNames } = this.props;
        const { showSwitcher } = this.state;

        return (
            <React.Fragment>
                <JobSwitcher
                    modalOpen={showSwitcher}
                    closeModal={this.toggleSwitcher}
                />
                {jobs.map((item) => (
                    <ListGroup
                        key={item.date._seconds}
                        className={classes.group}
                    >
                        <ListGroupItem theme='primary'>
                            <b>
                                {moment.unix(item.date._seconds).format('dddd MMM Do')}
                            </b>
                        </ListGroupItem>
                        <ListGroupItem>
                            {item.jobs.map((job) => (
                                <KitchenJob
                                    key={job.title}
                                    job={job}
                                    userEmail={_.get(currentUser, 'email')}
                                    emailsToNames={emailsToNames}
                                    toggleSwitcher={this.toggleSwitcher}
                                />
                            ))}
                        </ListGroupItem>
                    </ListGroup>
                ))}
            </React.Fragment>
        );
    }
}

IndexPage.propTypes = {
    classes: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
    emailsToNames: PropTypes.object.isRequired
};

export default withStyles(styles)(IndexPage);
