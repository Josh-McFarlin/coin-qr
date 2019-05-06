import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Row, Col, Card, CardBody, CardHeader } from 'shards-react';
import moment from 'moment';
import { withRouter } from 'next/router';

import urls from '../utils/urls';
import { fetchRecent } from '../frontend/firebase/actions';


const styles = () => ({
    row: {
        cursor: 'pointer'
    }
});

class RecentPage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            recentPages: []
        };
    }

    componentDidMount() {
        fetchRecent()
            .then((recentPages) => {
                this.setState({
                    recentPages
                });
            });
    }

    render() {
        const { classes, router } = this.props;
        const { recentPages } = this.state;

        return (
            <Row>
                <Col>
                    <Card>
                        <CardHeader className={classes.header}>
                            Recent Pages
                        </CardHeader>
                        <CardBody>
                            <div className='table-responsive'>
                                <table className='table table-striped table-hover'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>
                                                Name
                                            </th>
                                            <th scope='col'>
                                                Last Updated
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentPages.map((page) => (
                                            <tr
                                                className={classes.row}
                                                key={page.id}
                                                onClick={() => router.push(urls.qr.view(page.id))}
                                            >
                                                <td>
                                                    {page.data.title}
                                                </td>
                                                <td>
                                                    {moment(page.modified).fromNow()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

RecentPage.propTypes = {
    classes: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(RecentPage));
