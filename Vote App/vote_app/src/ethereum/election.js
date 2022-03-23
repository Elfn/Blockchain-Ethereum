import web3 from './web3';
import election from '../ethereum/util/build/Election.json';


// export default (address) => {
//   return new web3.eth.Contract(
//     JSON.parse(election.interface),
//     address
//   );
// };

//const accounts = web3.eth.getAccounts();

var myContract = new web3.eth.Contract(JSON.parse(election.interface), '0xDcB8C283c6d12714CB69B647029bCe9054504FDa');

export default myContract;




