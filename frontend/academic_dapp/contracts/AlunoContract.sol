// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
import "./Academic.sol";
import "./IAlunoContract.sol";
import "./AcademicToken.sol";

contract AlunoContract is IAlunoContract{

    mapping(uint => Aluno) alunoById;

    address owner;

    address private _academicContractAddr; 
    address private _academicTokenAddr;

    modifier onlyOwner(){
        require(msg.sender == owner, "Nao autorizado");
        _;
    }

    constructor(address academicContractAddr, address academicTokenAddr){
        _academicContractAddr = academicContractAddr;
        _academicTokenAddr = academicTokenAddr;
        owner = msg.sender;
    }

    function getAlunoById(uint id) public view override returns (Aluno memory){
        return alunoById[id];
    }

    function inserirAluno(uint id, string memory nome, address wallet) onlyOwner public override {
        require(Academic(_academicContractAddr).etapa() == Periodo.INSCRICAO_ALUNOS, "Fora do periodo de inscricao de aluno");
        require(bytes(getAlunoById(id).nome).length == 0, "Aluno ja existe");
        require(bytes(nome).length != 0, "Nome nao pode estar vazio");
        require(wallet != address(0), "Endereco da carteira nao pode ser vazio");

        alunoById[id] = Aluno(id, nome, wallet);
        AcademicToken(_academicTokenAddr).transferFrom(owner, wallet, 1 * 10 ** 18);
    }
}