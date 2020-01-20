import React from 'react';
import { Row, Col, Card, CardBody, CardHeader } from 'shards-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { getRecent } from '../src/firebase/actions';
import urls from '../utils/urls';


const RecentPage = () => {
    const router = useRouter();
    const [recentPages, setRecentPages] = React.useState([]);

    React.useEffect(() => {
        getRecent().then((recent) => setRecentPages(recent));
    }, []);

    return (
        <Row>
            <Col>
                <Card>
                    <CardHeader>
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
                                            key={page.id}
                                            onClick={() => router.push(urls.qr.view(page.id))}
                                            style={{
                                                cursor: 'pointer'
                                            }}
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
};

export default RecentPage;
