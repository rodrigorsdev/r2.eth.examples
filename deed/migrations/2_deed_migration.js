const Migrations = artifacts.require("Deed");
const earliest = 10; //seconds
const value = 500000000;

module.exports = function (deployer, _network, accounts) {
    deployer.deploy(Migrations, accounts[0], accounts[1], earliest, { value: value });
};
