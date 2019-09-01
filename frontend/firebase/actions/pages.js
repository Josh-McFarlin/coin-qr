export const addPage = (data) =>
    fetch('/firebase/addPage', {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data
        })
    })
        .then((response) => response.json());

export const updatePage = (data, id) =>
    fetch('/firebase/updatePage', {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data,
            id
        })
    });

export const deletePage = (id) =>
    fetch('/firebase/deletePage', {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id
        })
    });
