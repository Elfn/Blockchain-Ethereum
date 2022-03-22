const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');//For file system
// const fs = require('fs');//For file system

const buildPath = path.resolve(__dirname,'util','build');

//Delete directory after build
fs.removeSync(buildPath);

//Contract file
const electionPath = path.resolve(__dirname,'contracts','Election.sol');
const  source = fs.readFileSync(electionPath, 'utf8');
//Compile contracts with solc (Solidity compiler)
const output = solc.compile(source, 1).contracts;


//Recreate build folder to write output into
fs.ensureDirSync(buildPath);

console.log(output);
//See into output
for(let contract in output){
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}
