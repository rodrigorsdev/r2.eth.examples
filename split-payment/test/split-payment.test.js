const SplitPayment = artifacts.require('../contracts/SplitPayment');
const Assert = require('truffle-assertions');

contract('Split payment contract', (accounts) => {
    let contractInstance;
    const owner = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2];

    before(() => {
        web3.eth.defaultAccount = owner;
    });

    beforeEach(async () => {
        contractInstance = await SplitPayment.new(owner);
    });

    it('should owner as contract owner', async () => {
        const contractOwner = await contractInstance.owner();
        assert.equal(owner, contractOwner, 'owner is wrong');
    });

    it('should throw if sender is not contract owner', async () => {
        const value = 50;
        const to = [account1, account2];
        const amount = [10, 20];
        await Assert.reverts(
            contractInstance.send(to, amount, { from: account1, value: value }),
            'is not the owner'
        );
    });

    it('should throw if amont length is different of to length', async () => {
        const value = 50;
        const to = [account1];
        const amount = [10, 20];
        await Assert.reverts(
            contractInstance.send(to, amount, { from: owner, value: value }),
            'number of receivers must be equal number of amounts'
        );
    });

    it('should throw if contract value is not enough', async () => {
        const value = 20;
        const to = [account1, account2];
        const amount = [10, 20];
        await Assert.reverts(
            contractInstance.send(to, amount, { from: owner, value: value }),
            'contract value is not enough'
        );
    });

    it('send success', async () => {
        const value = 500000000;
        const to = [account1, account2];
        const amount = [100000000, 400000000];

        const initialBalances = await Promise.all(to.map(recipient => {
            return web3.eth.getBalance(recipient);
        }));

        await contractInstance.send(to, amount, { from: owner, value: value });

        const finalBalances = await Promise.all(to.map(recipient => {
            return web3.eth.getBalance(recipient);
        }));

        const differenceAccount1 = web3.utils.toBN(finalBalances[0]).sub(web3.utils.toBN(initialBalances[0])).toNumber();
        const differenceAccount2 = web3.utils.toBN(finalBalances[1]).sub(web3.utils.toBN(initialBalances[1])).toNumber();

        assert.equal(differenceAccount1, amount[0], 'wrong difference account1');
        assert.equal(differenceAccount2, amount[1], 'wrong difference account2');
    });
});