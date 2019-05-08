/* eslint-disable import/no-dynamic-require */
const fs = require('fs');


module.exports = (server) => {
    fs.readdirSync(__dirname).forEach((file) => {
        if (file === 'index.js' || file.substr(file.lastIndexOf('.') + 1) !== 'js') return;

        const name = file.substr(0, file.indexOf('.'));
        require(`./${name}`)(server);
    });
};
