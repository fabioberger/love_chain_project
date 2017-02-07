var ValentineRegistry = artifacts.require("./ValentineRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(ValentineRegistry);
};
