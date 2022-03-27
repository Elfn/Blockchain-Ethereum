import web3 from './web3';
import election from '../ethereum/util/build/Election.json';


// export default (address) => {
//   return new web3.eth.Contract(
//     JSON.parse(election.interface),
//     address
//   );
// };

const accounts = web3.eth.getAccounts();

var myContract = new web3.eth.Contract(JSON.parse(election.interface), '0x4D745C15DDb4140d646515eaB1EA8dEc9f4111B8',{
  from: accounts[0] // default from address
  // gas: '1000000' // default gas price in wei, 20 gwei in this case
});

export default myContract;




