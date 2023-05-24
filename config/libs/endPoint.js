'use strict'

const nconf = require('nconf');
const Web3 = require('web3');
const config = nconf.get('ethRpc');

const provider = new Web3.providers.HttpProvider("http://" + config.info.host + ':' + config.info.port);

const endPoint = new Web3(provider);

module.exports = endPoint;