import web3 from './web3';
import election from '../ethereum/util/build/Election.json';


// export default (address) => {
//   return new web3.eth.Contract(
//     JSON.parse(election.interface),
//     address
//   );
// };

//const accounts = web3.eth.getAccounts();

var myContract = new web3.eth.Contract(JSON.parse(election.interface), '0xDADb4b0673183d270b0C7DA8Ab3F3063B1496aD5');

export default myContract;




