import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import _ from 'lodash';
import {
    Button, Card, CardBody, CardHeader, CardFooter, Row, Col,
    Form, FormGroup, FormInput, FormTextarea, FormFeedback, ListGroup, ListGroupItem
} from 'shards-react';

import urls from '../../../utils/urls';


const styles = () => ({
    section: {
        cursor: 'pointer'
    }
});

const PageSection = ({ classes, page, router }) => (
    <ListGroupItem
        className={classes.section}
        onClick={() => router.push(urls.qr.view(_.get(page, 'id')))}
    >
        {_.get(page, 'data.title')}
    </ListGroupItem>
);

PageSection.propTypes = {
    classes: PropTypes.object.isRequired,
    page: PropTypes.object,
    router: PropTypes.object.isRequired
};

PageSection.defaultProps = {
    page: null
};

export default withStyles(styles)(
    withRouter(PageSection)
);
