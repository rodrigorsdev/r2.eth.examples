const Migrations = artifacts.require("Crab");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
