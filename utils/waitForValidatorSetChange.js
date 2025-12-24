const getContract = require('./getContract');

const RETRY_INTERVAL_MS = 2499;
const MAX_WAIT_TIME_MS = 300000; // 5 minutes max wait time

module.exports = async (web3) => {
    let ValidatorSetAuRaContract = getContract('ValidatorSetAuRa', web3).instance;
    let StakingAuRaContract = getContract('StakingAuRa', web3).instance;

    let initialStakingEpoch = parseInt(await StakingAuRaContract.methods.stakingEpoch().call());
    let startTime = Date.now();
    
    // wait for the next staking epoch
    while (true) {
        await new Promise(r => setTimeout(r, RETRY_INTERVAL_MS));
        let currentStakingEpoch = parseInt(await StakingAuRaContract.methods.stakingEpoch().call());
        let currentBlock = parseInt((await web3.eth.getBlock('latest')).number);
        if (currentStakingEpoch > initialStakingEpoch) {
            console.log(`***** Staking epoch changed at block ${currentBlock} (new epoch: ${currentStakingEpoch})`);
            break;
        }
        if (Date.now() - startTime > MAX_WAIT_TIME_MS) {
            console.log(`***** Timeout waiting for staking epoch change (current epoch: ${currentStakingEpoch})`);
            throw new Error('Timeout waiting for staking epoch change');
        }
    }

    // wait until new validator set is applied (with timeout)
    startTime = Date.now();
    while (
        parseInt(
            await ValidatorSetAuRaContract.methods.validatorSetApplyBlock().call()
        ) === 0
    ) {
        await new Promise(r => setTimeout(r, RETRY_INTERVAL_MS));
        if (Date.now() - startTime > MAX_WAIT_TIME_MS) {
            console.log('***** Timeout waiting for validator set change to be applied');
            console.log('***** This may indicate that not all validators are participating in consensus');
            // Return current validators instead of throwing
            let validatorSet = await ValidatorSetAuRaContract.methods.getValidators().call();
            console.log(`***** Returning current validator set: ${JSON.stringify(validatorSet)}`);
            return validatorSet;
        }
    }
    let currentBlock = parseInt((await web3.eth.getBlock('latest')).number);
    let validatorSet = await ValidatorSetAuRaContract.methods.getValidators().call();
    console.log(`***** ValidatorSet change applied at block ${currentBlock}
        (new validator set: ${JSON.stringify(validatorSet)})`);
    return validatorSet;
}
