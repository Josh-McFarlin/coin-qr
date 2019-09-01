import fetch from 'isomorphic-unfetch';

import urls from '../../../utils/urls';


export const fetchJobs = () =>
    fetch(urls.base + urls.api.fetchJobs, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((json) => json.jobs);
