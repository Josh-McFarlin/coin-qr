export const createProfile = () =>
    fetch('/firebase/createProfile', {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

export const updateProfile = (data) =>
    fetch('/firebase/updateProfile', {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data
        })
    });
