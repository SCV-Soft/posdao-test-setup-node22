const Web3 = require('web3');
const web3 = new Web3('http://localhost:8541');

async function run() {
  try {
    const nodeInfo = await web3.eth.getNodeInfo();
    console.log('Node Info:', nodeInfo);
    
    // Try admin_nodeInfo
    web3.extend({
      property: 'admin',
      methods: [{
        name: 'nodeInfo',
        call: 'admin_nodeInfo'
      }, {
        name: 'addPeer',
        call: 'admin_addPeer',
        params: 1
      }]
    });

    const adminInfo = await web3.admin.nodeInfo();
    console.log('Enode:', adminInfo.enode);
  } catch (e) {
    console.error(e);
  }
}

run();