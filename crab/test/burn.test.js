const Crab = artifacts.require('../contracts/Crab');
const Assert = require('truffle-assertions');

contract('Crab contract - burn function', (accounts) => {
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

    it('burn should throw if user not exist', async () => {
        const email = "user@domain.com";

        await Assert.reverts(
            contractInstance.burn(email, { from: user1 }),
            'user not exists');
    });

    it('burn should throw if is not owner', async () => {
        const name = "user";
        const email = "user@domain.com";

        const resultAdd = await contractInstance.create(name, email, { from: user1 });

        Assert.eventEmitted(resultAdd, 'createdUser', (ev) => {
            return ev._index == 1 && ev._name == name && ev._email == email
        });
        await Assert.reverts(
            contractInstance.burn(email, { from: user2 }),
            'is not the owner');
    });

    it('burn success', async () => {
        const name = "user";
        const email = "user@domain.com";

        const resultAdd = await contractInstance.create(name, email, { from: user1 });
        const resultBurn = await contractInstance.burn(email, { from: user1 });

        Assert.eventEmitted(resultAdd, 'createdUser', (ev) => {
            return ev._index == 1 && ev._name == name && ev._email == email
        });

        Assert.eventEmitted(resultBurn, 'burnedUser', (ev) => {
            return ev._email == email
        });

        await Assert.reverts(
            contractInstance.readByEmail(email),
            'user not exists');
    });
});