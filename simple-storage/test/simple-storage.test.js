const SimpleStorage = artifacts.require('../contracts/SimpleStorage');

contract('SimpleStorage contract', (accounts) => {
    let contractInstance;
    const ownerAddress = accounts[0];

    before(() => {
        web3.eth.defaultAccount = ownerAddress;
    });

    beforeEach(async () => {
        contractInstance = await SimpleStorage.new();
    });

    it('simple storage success', async () => {
        const expected = "test value";
        await contractInstance.set(expected, { from: ownerAddress });
        const result = await contractInstance.get();
        assert.equal(expected, result, 'result is wrong')
    });
});