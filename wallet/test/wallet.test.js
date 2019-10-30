const Crab = artifacts.require('../contracts/Wallet');
const Assert = require('truffle-assertions');

contract('Crab contract - append function', (accounts) => {
    let contractInstance;
    const ownerAddress = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];

    before(() => {
        web3.eth.defaultAccount = ownerAddress;
    });

    beforeEach(async() => {
        contractInstance = await Crab.new(ownerAddress);
    });

    it('should ownerAddress as contract owner', async() => {
        const owner = await contractInstance.owner();
        assert.equal(ownerAddress, owner, 'owner is wrong');
    });
});