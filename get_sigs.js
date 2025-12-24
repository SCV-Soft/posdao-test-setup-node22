const Web3 = require('web3');
const web3 = new Web3();

const sig1 = web3.eth.abi.encodeFunctionSignature('emitInitiateChange()');
const sig2 = web3.eth.abi.encodeFunctionSignature('setCandidateMinStake(uint256)');
const sig3 = web3.eth.abi.encodeFunctionSignature('setErcToNativeBridgesAllowed(address[])');

console.log('emitInitiateChange:', sig1);
console.log('setCandidateMinStake:', sig2);
console.log('setErcToNativeBridgesAllowed:', sig3);
