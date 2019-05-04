const routes = require('next-routes');


module.exports = routes()
    .add('index', '/')
    .add('recent', '/recent')
    .add('auth', '/auth')
    .add('create', '/qr', 'edit')
    .add('viewQR', '/qr/:id')
    .add('editQR', '/qr/:id/edit')
    .add('viewProfile', '/profile/:id?');
