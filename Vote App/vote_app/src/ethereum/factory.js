import web3 from "./web3";
import electionFactory from '../ethereum/util/build/ElectionFactory.json';


// Tell web3 that a deployed copy of the 'Campaign factory' exists
//Use factory instance to to retrieve a list of deployed campaign
const instance = new web3.eth.Contract(JSON.parse(electionFactory.interface),'0x39eD9D33E2B752046A4e0aF28bAEf3470F9DeD65');

export default instance;
