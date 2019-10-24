const Crab = artifacts.require('../contracts/Crab');
const Assert = require('truffle-assertions');

contract('Crab contract - append function', (accounts) => {
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

    it('append should throw if user not exist', async () => {
        const name = "user";
        const email = "user@domain.com";

        await Assert.reverts(
            contractInstance.append(name, email, { from: user1 }),
            'user not exists');
    });

    it('append should throw if is not owner', async () => {
        const name = "user";
        const email = "user@domain.com";

        const resultCreate = await contractInstance.create(name, email, { from: user1 });

        Assert.eventEmitted(resultCreate, 'createdUser', (ev) => {
            return ev._index == 1 && ev._name == name && ev._email == email
        });
        await Assert.reverts(
            contractInstance.append(name, email, { from: user2 }),
            'is not the owner');
    });

    it('append should throw if name length is less than USER_NAME_MIN_LENGTH', async () => {
        const name = "u";
        const email = "user@domain.com";

        await Assert.reverts(
            contractInstance.append(name, email, { from: user1 }),
            'user name min length invalid');
    });

    it('append success', async () => {
        const name = "user";
        const email = "user@domain.com";
        const changedName = "user2";

        const resultCreate = await contractInstance.create(name, email, { from: user1 });
        const resultReadUserAdded = await contractInstance.readByEmail(email);

        const resultAppend= await contractInstance.append(changedName, email, { from: user1 });
        const resultReadUserUpdated = await contractInstance.readByEmail(email);

        Assert.eventEmitted(resultCreate, 'createdUser', (ev) => {
            return ev._index == 1 && ev._name == name && ev._email == email
        });
        Assert.eventEmitted(resultAppend, 'appendedUser', (ev) => {
            return ev._name == changedName && ev._email == email
        });
        assert.equal(resultReadUserAdded, name, 'user name is wrong');
        assert.equal(resultReadUserUpdated, changedName, 'users changed name is wrong');
    });
});