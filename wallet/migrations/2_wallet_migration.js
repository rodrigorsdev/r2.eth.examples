const Migrations = artifacts.require("Wallet");

module.exports = function(deployer, _network, accounts) {
  deployer.deploy(Migrations, accounts[0]);
};
