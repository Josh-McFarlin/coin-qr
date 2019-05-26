import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Row, Col, Card, CardBody, CardHeader } from 'shards-react';
import moment from 'moment';
import { withRouter } from 'next/router';
import _ from 'lodash';

import urls from '../utils/urls';


const styles = () => ({
    row: {
        cursor: 'pointer'
    }
});

class RecentPage extends React.PureComponent {
    static async getInitialProps({ query, res }) {
        const locals = _.get(res, 'locals', {});

        return {
            recentPages: locals.recentPages
        };
    }

    render() {
        const { classes, router, recentPages } = this.props;

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
                                                onClick={() => router.push(urls.qr.view(page.postId))}
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
    router: PropTypes.object.isRequired,
    recentPages: PropTypes.array.isRequired
};

export default withRouter(withStyles(styles)(RecentPage));
