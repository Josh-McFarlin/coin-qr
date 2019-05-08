import _ from 'lodash';


export const addPage = (data, owner) => {
    const page = {
        data
    };

    if (_.isString(owner)) {
        page.owner = owner;
    }

    return fetch('/firebase/addPage', {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            page
        })
    })
        .then((response) => response.json());
};

export const updatePage = (data, id) => {
    // TODO: POST page
};

export const deletePage = (id) => {
    // TODO: POST page id
};
