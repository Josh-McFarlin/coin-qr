module.exports = {
    base: 'https://coinqr.io',
    home: () => '/',
    auth: () => '/login',
    recent: () => '/recent',
    donate: () => '/qr/VlWXqvylnduFa8DvltdP',
    qr: {
        create: () => '/create',
        view: (id) => `/qr/${id}`,
        edit: (id) => `/qr/${id}/edit`
    },
    myProfile: {
        edit: () => '/editProfile'
    },
    profile: {
        view: (id) => `/profile/${id}`
    }
};
