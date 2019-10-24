const Crab = artifacts.require('../contracts/Crab');
const Assert = require('truffle-assertions');

contract('Crab contract - create function', (accounts) => {
    let contractInstance;
    const ownerAddress = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];

    before(() => {
        web3.eth.defaultAccount = ownerAddress;
    });

    beforeEach(async () => {
        contractInstance = await Crab.new();
    });

    it('create should throw if name length is less than USER_NAME_MIN_LENGTH', async () => {
        const name = "u";
        const email = "user@domain.com";
        await Assert.reverts(
            contractInstance.create(name, email, { from: user1 }),
            'user name min length invalid');
    });

    it('create should throw if user already exist', async () => {
        const name = "user";
        const email = "user@domain.com";

        const resultAdd = await contractInstance.create(name, email, { from: user1 });

        Assert.eventEmitted(resultAdd, 'createdUser', (ev) => {
            return ev._index == 1 && ev._name == name && ev._email == email
        });
        await Assert.reverts(
            contractInstance.create(name, email, { from: user1 }),
            'user exists');
    });

    it('add should throw if user email already exist', async () => {
        const name = "user";
        const email = "user@domain.com";
        const changedName = "user changed";

        const resultAdd = await contractInstance.create(name, email, { from: user1 });

        Assert.eventEmitted(resultAdd, 'createdUser', (ev) => {
            return ev._index == 1 && ev._name == name && ev._email == email
        });
        await Assert.reverts(
            contractInstance.create(changedName, email, { from: user2 }),
            'email exists');
    });

    it('create success', async () => {
        const name = "user";
        const email = "user@domain.com";

        const resultAdd = await contractInstance.create(name, email, { from: user1 });

        Assert.eventEmitted(resultAdd, 'createdUser', (ev) => {
            return ev._index == 1 && ev._name == name && ev._email == email
        });
    });
});