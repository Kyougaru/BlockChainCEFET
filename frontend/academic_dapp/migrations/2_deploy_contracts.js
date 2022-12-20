const AlunoContract = artifacts.require("AlunoContract.sol");

module.exports = function(deployer) {
  deployer.deploy(AlunoContract);
};
