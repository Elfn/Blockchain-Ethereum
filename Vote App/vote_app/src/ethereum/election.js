import web3 from './web3';
import election from '../ethereum/util/build/Election.json';


// export default (address) => {
//   return new web3.eth.Contract(
//     JSON.parse(election.interface),
//     address
//   );
// };

//const accounts = web3.eth.getAccounts();

var myContract = new web3.eth.Contract(JSON.parse(election.interface), '0xE8Fe6ED01d6cCA129FE4b1a30aB27bF9634087A4');

export default myContract;




