const Deed = artifacts.require('../contracts/Deed');
const Assert = require('truffle-assertions');
const DifferenceInCalendarDays = require('date-fns/differenceInCalendarDays');

contract('Deed contract', (accounts) => {
    let contractInstance;
    const donator = accounts[0];
    const lawyer = accounts[1];
    const beneficiary = accounts[2];
    const earliest = 86400; //seconds
    const value = 500000000; //wei

    before(() => {
        web3.eth.defaultAccount = donator;
    });

    it('should throw if value is less or equal to 0', async () => {
        await Assert.reverts(
            Deed.new(lawyer, beneficiary, earliest, { value: 0 }),
            'amount is invalid'
        );
    });

    it('should laywer address is correct', async () => {
        contractInstance = await Deed.new(lawyer, beneficiary, earliest, { value: value });
        const contractLawyer = await contractInstance.lawyer();
        assert.equal(lawyer, contractLawyer, 'laywer is wrong');
    });

    it('should beneficiary address is correct', async () => {
        contractInstance = await Deed.new(lawyer, beneficiary, earliest, { value: value });
        const contractBeneficiary = await contractInstance.beneficiary();
        assert.equal(beneficiary, contractBeneficiary, 'beneficiary is wrong');
    });

    it('should earliest is correct', async () => {
        const atualDate = new Date();
        contractInstance = await Deed.new(lawyer, beneficiary, earliest, { value: value });
        const contractEarliest = await contractInstance.earliest();
        const ealistDate = new Date(contractEarliest * 1000);
        const daysDiferrence = DifferenceInCalendarDays(ealistDate, atualDate);
        assert.equal(1, daysDiferrence, 'earliest is wrong');
    });

    it('withdrawal should throw if is not the lawyer', async () => {
        contractInstance = await Deed.new(lawyer, beneficiary, earliest, { value: value });
        await Assert.reverts(
            contractInstance.withdrawal({ from: beneficiary }),
            'lawyer only'
        );
    });

    it('withdrawal should throw if is too early', async () => {
        contractInstance = await Deed.new(lawyer, beneficiary, earliest, { value: value });
        await Assert.reverts(
            contractInstance.withdrawal({ from: lawyer }),
            'too early'
        );
    });

    it('withdrawal success', async () => {
        contractInstance = await Deed.new(lawyer, beneficiary, 0, { value: value });
        const initialBalance = await web3.eth.getBalance(beneficiary);
        await contractInstance.withdrawal({ from: lawyer });
        const finalBalance = await web3.eth.getBalance(beneficiary);
        const differenceBalance = web3.utils.toBN(finalBalance).sub(web3.utils.toBN(initialBalance)).toNumber();
        assert.equal(value, differenceBalance, 'wrong balance');
    });
});