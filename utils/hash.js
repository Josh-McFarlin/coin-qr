const shortHash = require('short-hash');


module.exports.hashUID = (uid) => shortHash(uid);
