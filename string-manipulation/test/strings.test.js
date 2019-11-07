const Strings = artifacts.require('../contracts/Strings');

contract('Strings contract', (accounts) => {
    let contractInstance;
    const owner = accounts[0];


    before(() => {
        web3.eth.defaultAccount = owner;
    });

    beforeEach(async () => {
        contractInstance = await Strings.new(owner);
    });

    it('length success', async () => {
        const stringValue = "test";
        const expected = stringValue.length;
        const result = await contractInstance.length(stringValue);
        assert.equal(expected, result, 'length is wrong')
    });

    it('concatenate success', async () => {
        const stringValue1 = "test";
        const stringValue2 = "success";
        const expected = stringValue1 + stringValue2;
        const result = await contractInstance.concatenate(stringValue1, stringValue2);
        assert.equal(expected, result, 'concatenate is wrong')
    });

    it('concatenate success', async () => {
        const stringValue1 = "test";
        const stringValue2 = "success";
        const expected = stringValue1 + stringValue2;
        const result = await contractInstance.concatenate([stringValue1, stringValue2]);
        assert.equal(expected, result, 'concatenate is wrong')
    });
});