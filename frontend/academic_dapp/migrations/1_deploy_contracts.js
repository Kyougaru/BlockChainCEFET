const AcademicContract = artifacts.require("Academic.sol");
const AcademicTokenContract = artifacts.require("AcademicToken.sol");
const AlunoContract = artifacts.require("AlunoContract.sol");
const AcademicCertificate = artifacts.require("AcademicCertificate.sol");
const DisciplinaContract = artifacts.require("DisciplinaContract.sol");

module.exports = function(deployer) {
  deployer.then(async () => {
	await deployer.deploy(AcademicContract);
	await deployer.deploy(AcademicCertificate);
	await deployer.deploy(AcademicTokenContract);
	await deployer.deploy(AlunoContract, AcademicContract.address, AcademicTokenContract.address);
	await deployer.deploy(DisciplinaContract, AcademicContract.address);
  });
};
