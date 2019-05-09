import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ListGroupItem } from 'shards-react';

import urls from '../../../utils/urls';


const PageSection = ({ page }) => {
    if (_.isNil(page)) return null;

    return (
        <ListGroupItem
            href={urls.qr.view(_.get(page, 'id'))}
            tag='a'
        >
            {_.get(page, 'data.title')}
        </ListGroupItem>
    );
};

PageSection.propTypes = {
    page: PropTypes.object
};

PageSection.defaultProps = {
    page: null
};

export default PageSection;
