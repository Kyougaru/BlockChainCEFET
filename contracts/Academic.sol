// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
import "./IAlunoContract.sol";
import "./IDisciplinaContract.sol";
import "./AcademicToken.sol";

/**
 * @title Academic
 * @dev Academic system contract
 */
contract Academic {

    Periodo public etapa;

    mapping(uint => mapping(uint => uint8)) alunoIdToDisciplinaIdToNota;
    mapping(uint => uint[]) alunosByDisciplina;

    mapping(uint => mapping(uint => bool)) alunoExistsInDisciplina;

    address owner;
    address _alunoContractAddr;
    address _disciplinaContractAddr;

    address _academicTokenAddr;

    constructor(){
        etapa = Periodo.INSCRICAO_ALUNOS;
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Nao autorizado");
        _;
    }

    modifier onlyProfessor(uint disciplinaId){
        Disciplina memory d = IDisciplinaContract(_disciplinaContractAddr).getDisciplinaById(disciplinaId);
        require(d.professor != address(0), "Disciplina sem professor");
        require(msg.sender == d.professor, "Nao autorizado");
        _;
    }

    modifier onlyAluno(uint alunoId) {
        Aluno memory a = IAlunoContract(_alunoContractAddr).getAlunoById(alunoId);
        require(a.wallet != address(0), "Aluno nao existente");
        require(msg.sender == a.wallet, "Nao autorizado");
        _;
    }

    function setAlunoContractAddress(address alunoContractAddr) public onlyOwner {
        _alunoContractAddr = alunoContractAddr;
    }

    function setDisciplinaContractAddress(address disciplinaContractAddr) public onlyOwner {
        _disciplinaContractAddr = disciplinaContractAddr;
    }

    function setAcademicTokenAddress(address academicTokenAddr) public onlyOwner {
        _academicTokenAddr = academicTokenAddr;
    }

    function abrirLancamentoNota() onlyOwner public {
        etapa = Periodo.LANCAMENTO_NOTAS;
    }

    function inserirAlunoInDisciplina(uint alunoId, uint disciplinaId) onlyAluno(alunoId) public {
        require(etapa == Periodo.INSCRICAO_ALUNOS, "Fora do periodo de inscricao de aluno");
        require(bytes(IAlunoContract(_alunoContractAddr).getAlunoById(alunoId).nome).length != 0, "Aluno nao existente");
        require(bytes(IDisciplinaContract(_disciplinaContractAddr).getDisciplinaById(disciplinaId).nome).length != 0, "Disciplina nao existe");
        require(!alunoExistsInDisciplina[alunoId][disciplinaId], "Aluno ja esta inscrito na disciplina");

        AcademicToken(_academicTokenAddr).transferFrom(IAlunoContract(_alunoContractAddr).getAlunoById(alunoId).wallet, owner, 1 * 10 ** 18);

        alunosByDisciplina[disciplinaId].push(alunoId);
        alunoExistsInDisciplina[alunoId][disciplinaId] = true;
    }

    function inserirNota(uint alunoId, uint disciplinaId, uint8 nota) onlyProfessor(disciplinaId) public {
        require(etapa == Periodo.LANCAMENTO_NOTAS, "Fora do periodo de lancamento de notas");
        require(bytes(IAlunoContract(_alunoContractAddr).getAlunoById(alunoId).nome).length != 0, "Aluno nao existente");
        require(bytes(IDisciplinaContract(_disciplinaContractAddr).getDisciplinaById(disciplinaId).nome).length != 0, "Disciplina nao existe");
        require(alunoExistsInDisciplina[alunoId][disciplinaId], "Aluno nao esta inscrito na disciplina");

        alunoIdToDisciplinaIdToNota[alunoId][disciplinaId] = nota;
    }

    function listarNotasDisciplina(uint disciplinaId) view public returns(Aluno[] memory, uint8[] memory){
        require(bytes(IDisciplinaContract(_disciplinaContractAddr).getDisciplinaById(disciplinaId).nome).length != 0, "Disciplina nao existe");

        uint numAlunos = alunosByDisciplina[disciplinaId].length;

        Aluno[] memory alunos = new Aluno[](numAlunos);
        uint8[] memory notas = new uint8[](numAlunos);

        for(uint i = 0; i < numAlunos; i++){
            uint alunoId = alunosByDisciplina[disciplinaId][i];
            
            alunos[i] = IAlunoContract(_alunoContractAddr).getAlunoById(alunoId);
            notas[i] = alunoIdToDisciplinaIdToNota[alunoId][disciplinaId];
        }
        return (alunos, notas);
    }
}