// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const Academic = await hre.ethers.getContractFactory("Academic");
  const academic = await Academic.deploy();
  await academic.deployed();

  console.log(
    `Academic contract deployed to ${academic.address}`
  );

  const AcademicToken = await hre.ethers.getContractFactory("AcademicToken");
  const academicToken = await AcademicToken.deploy();
  await academicToken.deployed();
  console.log(
    `Academic token deployed to ${academicToken.address}!`
  );

  const AlunoContract = await hre.ethers.getContractFactory("AlunoContract");
  const alunoContract = await AlunoContract.deploy(academic.address, academicToken.address);
  await alunoContract.deployed();
  console.log(
    `AlunoContract contract deployed to ${alunoContract.address}`
  );

  const DisciplinaContract = await hre.ethers.getContractFactory("AlunoContract");
  const disciplinaContract = await DisciplinaContract.deploy(academic.address);
  await disciplinaContract.deployed();
  console.log(
    `DisciplinaContract contract deployed to ${disciplinaContract.address}`
  );

  const result = await academic.setAlunoContractAddress(alunoContract.address);
  await result.wait(1);

  const result = await academic.setDisciplinaContractAddress(disciplinaContract.address);
  await result.wait(1);

  const result = await academic.setAcademicTokenAddress(academicToken.address);
  await result.wait(1);

  const AcademicCertificate = await hre.ethers.getContractFactory("AcademicCertificate");
  const academicCertificate = await AcademicCertificate.deploy();
  await academicCertificate.deployed();
  console.log(
    `Academic certificate contract deployed to ${academicCertificate.address}!`
  );

  console.log(
    `Deploy finished with success!`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});