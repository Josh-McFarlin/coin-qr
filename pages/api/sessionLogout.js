const urls = require('../../utils/urls');


export default async function handle(req, res) {
    res.clearCookie('session');
    res.redirect(urls.home);
}
