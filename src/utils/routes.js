const routes = require('next-routes');


module.exports = routes()
    .add('index', '/')
    .add('recent', '/recent')
    .add('auth', '/auth')
    .add('create', '/qr', 'edit')
    .add('view', '/qr/:id')
    .add('edit', '/qr/:id/edit')
    .add('profile', '/profile/:id?');
