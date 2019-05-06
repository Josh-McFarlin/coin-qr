const routes = require('next-routes');


module.exports = routes()
    .add('index', '/')
    .add('recent', '/recent')
    .add('auth', '/login')
    .add('create', '/create', 'editQR')
    .add('viewQR', '/qr/:id')
    .add('editQR', '/qr/:id/edit')
    .add('viewProfile', '/profile/:id?')
    .add('editProfile', '/profile/:id/edit');
