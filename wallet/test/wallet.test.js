const Crab = artifacts.require('../contracts/Wallet');
const Assert = require('truffle-assertions');

contract('Wallet contract', (accounts) => {
    let contractInstance;
    const ownerAddress = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];

    before(() => {
        web3.eth.defaultAccount = ownerAddress;
    });

    beforeEach(async () => {
        contractInstance = await Crab.new(ownerAddress);
    });

    it('should ownerAddress as contract owner', async () => {
        const owner = await contractInstance.owner();
        assert.equal(ownerAddress, owner, 'owner is wrong');
    });

    it('should deposit ether to wallet', async () => {
        const expectedBalance = 100;
        await contractInstance.deposit({ from: ownerAddress, value: expectedBalance });
        const result = await web3.eth.getBalance(contractInstance.address);
        assert.equal(expectedBalance, result, 'wrong balance');
    });

    it('should return the balance of the contract', async () => {
        const expectedBalance = 100;
        await contractInstance.deposit({ from: ownerAddress, value: expectedBalance });
        const balanceBigNumber = await contractInstance.balanceOf();
        const balanceInt = parseInt(balanceBigNumber);
        assert.equal(expectedBalance, balanceInt, 'wrong balance');
    });

    it('should throw if sender is not contract owner', async () => {
        const value = 50;
        await Assert.reverts(
            contractInstance.send(user2, value, { from: user1 }),
            'is not the owner'
        );
    });

    it('should transfer ether to another address', async () => {
        const expectedBalance = 100;
        const sendedValue = 50;

        await contractInstance.deposit({ from: ownerAddress, value: expectedBalance });
        const resultContractBalance = await web3.eth.getBalance(contractInstance.address);
        const initialRecipientBalance = parseInt(await web3.eth.getBalance(user1));
        const expectedSendedBalance = parseInt(initialRecipientBalance + sendedValue);
        await contractInstance.send(user1, 50, { from: ownerAddress });
        const atualRecipientBalance = parseInt(await web3.eth.getBalance(user1));

        assert.equal(expectedBalance, resultContractBalance, 'wrong balance');
        assert.equal(expectedSendedBalance, atualRecipientBalance, 'initial balance');
    });
});