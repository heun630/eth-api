'use strict';

const nconf = require('nconf');
const models_maria = require(nconf.get('models_maria'));

module.exports = async function(outCallback) {
    try {
        await models_maria.db.sync();
        outCallback(null, '==> MariaDb Connect Complete!!!\n');
    } catch (err) {
        outCallback(err);
    }
};