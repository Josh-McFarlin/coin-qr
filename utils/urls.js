module.exports = {
    base: 'https://coinqr.io',
    home: () => '/',
    auth: () => '/login',
    recent: () => '/recent',
    qr: {
        create: () => '/create',
        view: (id) => `/qr/${id}`,
        edit: (id) => `/qr/${id}/edit`
    },
    myProfile: {
        edit: () => '/myprofile/edit'
    },
    profile: {
        view: (id) => `/profile/${id}`
    }
};
