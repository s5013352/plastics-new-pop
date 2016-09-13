//Node-Postgress setup

var pg = require('pg');

pg.defaults.ssl = true;
pg.defaults.poolSize = 10;

module.exports = pg;