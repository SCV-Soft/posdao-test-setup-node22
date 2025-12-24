const Web3 = require('web3');
const web3 = new Web3();

const account = web3.eth.accounts.privateKeyToAccount('0x3bdd2176' + '1a483f71' + '054e14f5' + 'b8272135' + '67971c67' + '6928d9a1' + '808cbfa4' + 'b7501204');
const account2 = web3.eth.accounts.privateKeyToAccount('0x4bdd2176' + '1a483f71' + '054e14f5' + 'b8272135' + '67971c67' + '6928d9a1' + '808cbfa4' + 'b7501205');

console.log('Account 1:', account.address);
console.log('Account 2:', account2.address);