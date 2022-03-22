// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const Web3 = require('web3');
// const net = require('net');
// //const { abi, evm } = require('./compile');
//
// //Need IPC provider for local network connection
// // const url = '/Users/Elimane/SUPINFO2022/Blockchain/Practice/My Projects/5BLOC/network/mychaindata/node1/geth.ipc';
// // const web3 = new Web3(new Web3.providers.IpcProvider(url, net));
// //
//  //Get compiled version of  contracts
//  const compiledElectionFactory = require('../ethereum/build/ElectionFactory.json');
//
// var provider = 'http://localhost:8546';
// var web3Provider = new Web3.providers.HttpProvider(provider);
// var web3 = new Web3(web3Provider);
//
//
//
// const deploy = async () => {
//   const accounts = await web3.eth.getAccounts();
//   console.log('Available accounts ',accounts)
//   console.log('Attempting to deploy from account ',accounts[0])
//
//   const result =  await new web3.eth.Contract(JSON.parse(compiledElectionFactory.interface))
//     .deploy({ data: compiledElectionFactory.bytecode, autoMine: true})
//     .send({from: accounts[0], gas: '8000000'});
//
//   console.log('Contract deployed to', result.options.address)
//
//   console.log('ABI => ',compiledElectionFactory.interface);
//
//   //to prevent deployment from hanging in the terminal
//   provider.engine.stop();
// };
//
// deploy();

const Web3 = require('web3');
const compiledElectionFactory = require('../ethereum/util/build/ElectionFactory.json');
const compiledElection = require('../ethereum/build/Election.json');

const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"))

const deployFactory = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const resultFactory = await new web3.eth.Contract(JSON.parse(compiledElectionFactory.interface))
    .deploy( { data:compiledElectionFactory.bytecode })
    .send( { gas: '5000000', from:accounts[0] });

  // const resultElection = await new web3.eth.Contract(JSON.parse(compiledElection.interface))
  //   .deploy( { data:compiledElection.bytecode })
  //   .send( { gas: '5000000', from:accounts[0] });

  // console.log('Contract deployed to', resultElection.options.address);
  console.log('Contract deployed to', resultFactory.options.address);
  //console.log('ABI => ',compiledElectionFactory.interface);

  //to prevent deployment from hanging in the terminal
 // provider.engine.stop();
};
deployFactory();
