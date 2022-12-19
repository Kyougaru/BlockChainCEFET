const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const AcademicCertificate = artifacts.require("AcademicCertificate");
const AcademicToken = artifacts.require("AcademicToken");
const AlunoContract = artifacts.require("AlunoContract");
const DisciplinaContract = artifacts.require("DisciplinaContract");
const Adoption = artifacts.require("Adoption");


module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(AcademicCertificate);
  //deployer.deploy(AcademicToken);
  //deployer.deploy(AlunoContract);
  //deployer.deploy(DisciplinaContract);  
  deployer.deploy(Adoption);  
};
