import web3 from './web3';
import election from '../ethereum/util/build/Election.json';


// export default (address) => {
//   return new web3.eth.Contract(
//     JSON.parse(election.interface),
//     address
//   );
// };

//const accounts = web3.eth.getAccounts();

var myContract = new web3.eth.Contract(JSON.parse(election.interface), '0x02B9Da7EC2C597EDC906eb64b53A72cbBc6d22c7');

export default myContract;




