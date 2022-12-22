App= {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    // $.getJSON("../pets.json", function (data) {
    //   var petsRow = $("#petsRow");
    //   var petTemplate = $("#petTemplate");

    //   for (i = 0; i < data.length; i++) {
    //     petTemplate.find(".panel-title").text(data[i].name);
    //     petTemplate.find("img").attr("src", data[i].picture);
    //     petTemplate.find(".pet-breed").text(data[i].breed);
    //     petTemplate.find(".pet-age").text(data[i].age);
    //     petTemplate.find(".pet-location").text(data[i].location);
    //     petTemplate.find(".btn-adopt").attr("data-id", data[i].id);

    //     petsRow.append(petTemplate.html());
    //   }
    // });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    var Web3 = require('web3');
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }
    web3 = new Web3(App.web3Provider);
	  web3.eth.defaultAccount = web3.eth.accounts[0];
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("../AcademicToken.json", function (AcademicTokenArtifact) {
      App.contracts.AcademicToken = TruffleContract(AcademicTokenArtifact);
      App.contracts.AcademicToken.setProvider(App.web3Provider);
      return;
    });

    $.getJSON("../AlunoContract.json", function (AlunoContractArtifact) {
      App.contracts.AlunoContract = TruffleContract(AlunoContractArtifact);
      App.contracts.AlunoContract.setProvider(App.web3Provider);
      return;
    });

    $.getJSON("../DisciplinaContract.json", function (DisciplinaContractArtifact) {
      App.contracts.DisciplinaContract = TruffleContract(DisciplinaContractArtifact);
      App.contracts.DisciplinaContract.setProvider(App.web3Provider);
      return;
    });

    $.getJSON("../Academic.json", function (AcademicArtifact) {
      App.contracts.Academic = TruffleContract(AcademicArtifact);
      App.contracts.Academic.setProvider(App.web3Provider);
      return;
    });

    $.getJSON("../AcademicCertificate.json", function (AcademicCertificateArtifact) {
      App.contracts.AcademicCertificate = TruffleContract(AcademicCertificateArtifact);
      App.contracts.AcademicCertificate.setProvider(App.web3Provider);
      return;
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", ".btn-insert-student", App.handleInsertStudent);
    $(document).on("click", ".btn-insert-course", App.handleInsertCourse);
    $(document).on("click", ".btn-link-contracts", App.handleLinkContracts);
    $(document).on("click", ".btn-insert-student-in-course", App.handleInsertStudentInCourse);
    $(document).on("click", ".btn-set-lancamento-notas", App.handleSetLancamentoNotas);
    $(document).on("click", ".btn-insert-grade", App.handleInsertGrade);
    $(document).on("click", ".btn-list-course", App.handleListCourse);
    $(document).on("click", ".btn-claim-certificate", App.handleClaimCertificate);
    
  },

  handleInsertStudent: function (event) {
    event.preventDefault();

    var studentId = parseInt($('#studentId').val());
    var studentName = $('#studentName').val();
	  var studentWallet = $('#studentWallet').val();
    var academicTokenInstance;
    var studentInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      
      App.contracts.AcademicToken.deployed()
        .then(function (instance) {
          academicTokenInstance = instance;
        })
        .catch(function (err) {
          console.log(err.message);
        });
      
      App.contracts.AlunoContract.deployed()
        .then(function (instance) {
          studentInstance = instance;
          console.log("entrou no bloco do contrato")
          //aprova transferencia de token
          academicTokenInstance.approve(studentInstance.address, 1 * 10 ** 18, {from: web3.eth.accounts[0], gas:3000000});
          //insere aluno
          return studentInstance.inserirAluno(studentId, studentName, studentWallet, {from: web3.eth.accounts[0], gas:3000000});
        })
        .then(function (result) {
          console.log("já rodou o contrato")
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },

  handleInsertCourse: function (event) {
    event.preventDefault();

    var courseId = parseInt($('#courseId').val());
    var courseName = $('#courseName').val();
	  var professorAddress = $('#professorAddress').val();
    var courseInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      
      App.contracts.DisciplinaContract.deployed()
        .then(function (instance) {
          courseInstance = instance;
          console.log("entrou no bloco do contrato")
          return courseInstance.inserirDisciplina(courseId, courseName, professorAddress, {from: web3.eth.accounts[0], gas:3000000});
        })
        .then(function (result) {
          console.log("já rodou o contrato")
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },

  handleLinkContracts: function (event) {
    event.preventDefault();

    var academicInstance;
    var alunoInstance;
    var disciplinaInstance;
    var academicTokenInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      
      App.contracts.AlunoContract.deployed()
        .then(function (instance) {
          alunoInstance = instance;
        })
        .catch(function (err) {
          console.log(err.message);
        });

      App.contracts.DisciplinaContract.deployed()
        .then(function (instance) {
          disciplinaInstance = instance;
        })
        .catch(function (err) {
          console.log(err.message);
        });
      
      App.contracts.AcademicToken.deployed()
        .then(function (instance) {
          academicTokenInstance = instance;
        })
        .catch(function (err) {
          console.log(err.message);
        });

      App.contracts.Academic.deployed()
        .then(function (instance) {
          academicInstance = instance;
          console.log("entrou no bloco do contrato")
          academicInstance.setAlunoContractAddress(alunoInstance.address, {from: web3.eth.accounts[0], gas:3000000});
          academicInstance.setDisciplinaContractAddress(disciplinaInstance.address, {from: web3.eth.accounts[0], gas:3000000});
          academicInstance.setAcademicTokenAddress(academicTokenInstance.address, {from: web3.eth.accounts[0], gas:3000000});
          return;
        })
        .then(function (result) {
          console.log("já rodou o contrato")
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },
  
  handleInsertStudentInCourse: function (event) {
    event.preventDefault();

    var studentId = parseInt($('#studentId').val());
    var courseId = parseInt($('#courseId').val());
    var academicInstance;
    var academicTokenInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      
      App.contracts.AcademicToken.deployed()
        .then(function (instance) {
          academicTokenInstance = instance;
        })
        .catch(function (err) {
          console.log(err.message);
        });

      App.contracts.Academic.deployed()
        .then(function (instance) {
          academicInstance = instance;
          console.log("entrou no bloco do contrato")
          //aprova transferencia de token
          academicTokenInstance.approve(academicInstance.address, 1 * 10 ** 18, {from: web3.eth.accounts[1], gas:3000000});
          //insere aluno na disciplina
          return academicInstance.inserirAlunoInDisciplina(studentId, courseId, {from: web3.eth.accounts[1], gas:3000000});
        })
        .then(function (result) {
          console.log("já rodou o contrato")
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },

  handleSetLancamentoNotas: function (event) {
    event.preventDefault();

    var academicInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      
      App.contracts.Academic.deployed()
        .then(function (instance) {
          academicInstance = instance;
          console.log("entrou no bloco do contrato")
          return academicInstance.abrirLancamentoNota({from: web3.eth.accounts[0], gas:3000000});
        })
        .then(function (result) {
          console.log("já rodou o contrato")
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },

  handleInsertGrade: function (event) {
    event.preventDefault();

    var studentId = parseInt($('#studentId').val());
    var courseId = parseInt($('#courseId').val());
	  var grade = parseInt($('#grade').val());
    var academicInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      
      App.contracts.Academic.deployed()
        .then(function (instance) {
          academicInstance = instance;
          console.log("entrou no bloco do contrato")
          return academicInstance.inserirNota(studentId, courseId, grade, {from: web3.eth.accounts[2], gas:3000000});
        })
        .then(function (result) {
          console.log("já rodou o contrato")
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },

  handleListCourse: function (event) {
    event.preventDefault();

    var courseId = parseInt($('#courseId').val());
    var academicInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      
      App.contracts.Academic.deployed()
        .then(async function (instance) {
          academicInstance = instance;
          console.log("entrou no bloco do contrato")
          var retorno = []
          retorno = await academicInstance.listarNotasDisciplina.call(courseId, {from: web3.eth.accounts[0], gas:3000000});
          return retorno;
        })
        .then(function (result) {
          console.log(result)
          console.log("já rodou o contrato")
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },

  handleClaimCertificate: function (event) {
    event.preventDefault();

    var studentAddress = $('#studentAddress').val();
    var certificateUrl = $('#certificateUrl').val();
    var academicCertificateInstance;


    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      
      App.contracts.AcademicCertificate.deployed()
        .then(async function (instance) {
          academicCertificateInstance = instance;
          console.log("entrou no bloco do contrato")
          //insere aluno na disciplina
          return await academicCertificateInstance.awardCertificate(studentAddress, certificateUrl, {from: web3.eth.accounts[1], gas:3000000});
        })
        .then(function (result) {
          console.log("já rodou o contrato")
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});