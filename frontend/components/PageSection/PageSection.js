import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import _ from 'lodash';
import { ListGroupItem } from 'shards-react';

import urls from '../../../utils/urls';


const styles = () => ({
    section: {
        cursor: 'pointer'
    }
});

const PageSection = ({ classes, page }) => {
    if (_.isNil(page)) return null;

    return (
        <ListGroupItem
            className={classes.section}
            href={urls.qr.view(_.get(page, 'id'))}
            tag='a'
        >
            {_.get(page, 'data.title')}
        </ListGroupItem>
    );
};

PageSection.propTypes = {
    classes: PropTypes.object.isRequired,
    page: PropTypes.object
};

PageSection.defaultProps = {
    page: null
};

export default withStyles(styles)(PageSection);
