'use strict';

const nconf = require('nconf');
const Web3 = require('web3');

const { host, port } = nconf.get('ethRpc').info;
const provider = new Web3.providers.HttpProvider(`http://${host}:${port}`);

const chain = new Web3(provider);

module.exports = chain;
