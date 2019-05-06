module.exports = {
    home: () => '/',
    auth: () => '/login',
    recent: () => '/recent',
    qr: {
        create: () => '/qr',
        view: (id) => `/qr/${id}`,
        edit: (id) => `/qr/${id}/edit`
    },
    myProfile: {
        view: () => '/myprofile',
        edit: () => '/myprofile/edit'
    },
    profile: {
        view: (id) => `/profile/${id}`
    }
};
