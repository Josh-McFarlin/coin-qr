import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Row, Col, Card, CardBody, CardHeader } from 'shards-react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'next/router';

import urls from '../src/utils/urls';
import { fetchRecent, listenRecent } from '../src/redux/actions/pages';


const styles = () => ({
    row: {
        cursor: 'pointer'
    }
});

class RecentPage extends React.PureComponent {
    static async getInitialProps({ store }) {
        await store.dispatch(fetchRecent());

        return {};
    }

    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(listenRecent());
    }

    render() {
        const { classes, pages, router } = this.props;

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
                                        {pages.recentPages.map((page) => (
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
    pages: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

const styledPage = withRouter(withStyles(styles)(RecentPage));

export default connect(
    (state) => {
        const { pages } = state;

        return {
            pages
        };
    }
)(styledPage);
