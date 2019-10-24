const Crab = artifacts.require('../contracts/Crab');
const Assert = require('truffle-assertions');

contract('Crab contract - read function', (accounts) => {
    let contractInstance;
    const ownerAddress = accounts[0];
    const user1 = accounts[1];

    before(() => {
        web3.eth.defaultAccount = ownerAddress;
    });

    beforeEach(async () => {
        contractInstance = await Crab.new();
    });

    it('readByEmail should throw if user not exists', async () => {
        const email = "user@domain.com";
        await Assert.reverts(
            contractInstance.readByEmail(email),
            'user not exists');
    });

    it('readByEmail success if user exists', async () => {
        const name = "user";
        const email = "user@domain.com";

        const resultAdd = await contractInstance.create(name, email, { from: user1 });
        const getResult = await contractInstance.readByEmail(email);

        Assert.eventEmitted(resultAdd, 'createdUser', (ev) => {
            return ev._index == 1 && ev._name == name && ev._email == email
        });
        assert.equal(getResult, name, 'name is wrong');
    });
});