var PersonBox = artifacts.require("./PersonBox.sol");

module.exports = function(deployer) {
  deployer.deploy(PersonBox);
};
