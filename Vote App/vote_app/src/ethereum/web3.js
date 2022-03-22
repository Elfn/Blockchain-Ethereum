var Web3 = require('web3');

// Using the IPC provider in node.js
// var net = require('net');
// const url = '/Users/Elimane/SUPINFO2022/Blockchain/Practice/My Projects/5BLOC/network/mychaindata/node1/geth.ipc';
//
// var web3 = new Web3(new Web3.providers.IpcProvider(url, net)); // mac os path

const provider = 'ws://127.0.0.1:8546';
const web3Provider = new Web3.providers.WebsocketProvider(provider);

const web3 = new Web3(web3Provider);


export default web3;
