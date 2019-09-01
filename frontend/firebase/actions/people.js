import fetch from 'isomorphic-unfetch';

import urls from '../../../utils/urls';


export const createPerson = (user) =>
    fetch(urls.base + urls.api.createPerson, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user
        })
    });

export const fetchPeople = () =>
    fetch(urls.base + urls.api.fetchPeople, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((json) => json.people);


export const fetchEmails = () =>
    fetch(urls.base + urls.api.fetchEmails, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((json) => json.emails);

export const fetchPerson = (email) =>
    fetch(urls.base + urls.api.fetchPerson, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email
        })
    })
        .then((response) => response.json())
        .then((json) => json.person);
