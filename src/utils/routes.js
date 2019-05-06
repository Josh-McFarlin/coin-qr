const routes = require('next-routes');


module.exports = routes()
    .add('index', '/')
    .add('recent', '/recent')
    .add('auth', '/login')
    .add('create', '/qr', 'edit')
    .add('viewQR', '/qr/:id')
    .add('editQR', '/qr/:id/edit')
    .add('myProfile', '/myprofile', 'viewProfile')
    .add('editProfile', '/myprofile/edit')
    .add('viewProfile', '/profile/:id?');
