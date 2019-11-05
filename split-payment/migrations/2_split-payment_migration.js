const Migrations = artifacts.require("SplitPayment");

module.exports = function(deployer, _network, accounts) {
  deployer.deploy(Migrations, accounts[0]);
};
