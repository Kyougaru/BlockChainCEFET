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

    constructor(){
        _academicContractAddr = address(bytes20(sha256(abi.encodePacked(msg.sender,block.timestamp))));
        _academicTokenAddr = address(bytes20(sha256(abi.encodePacked(msg.sender,block.timestamp))));
        owner = msg.sender;
    }

    function getAlunoById(uint id) public view override returns (Aluno memory){
        return alunoById[id];
    }

    function inserirAluno(uint id, string memory nome) onlyOwner public override {
        require(Academic(_academicContractAddr).etapa() == Periodo.INSCRICAO_ALUNOS, "Fora do periodo de inscricao de aluno");
        require(bytes(getAlunoById(id).nome).length == 0, "Aluno ja existe");
        require(bytes(nome).length != 0, "Nome nao pode estar vazio");
        
        alunoById[id] = Aluno(id, nome);
        //AcademicToken(_academicTokenAddr).transfer(wallet, 1);
    }
}