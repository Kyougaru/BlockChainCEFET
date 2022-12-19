// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
import "./Academic.sol";
import "./IAlunoContract.sol";
import "./AcademicToken.sol";

contract DisciplinaContract is IDisciplinaContract {

    mapping(uint => Disciplina) disciplinaById;

    address owner;

    address private _academicContractAddr; 

    modifier onlyOwner(){
        require(msg.sender == owner, "Nao autorizado");
        _;
    }

    constructor(address academicContractAddr){
        _academicContractAddr = academicContractAddr;
        owner = msg.sender;
    }

    function getDisciplinaById(uint id) public view override returns (Disciplina memory){
        return disciplinaById[id];
    }

    function inserirDisciplina(uint id, string memory nome, address professor) onlyOwner public override {
        require(professor != address(0), "Endereco do professor nao pode ser vazio");
        require(bytes(nome).length != 0, "Nome nao pode estar vazio");
        require(bytes(disciplinaById[id].nome).length == 0, "Disciplina ja existe");

        disciplinaById[id] = Disciplina(id, nome, professor);
    }
}