var database = require("../database/config");

function cadastrar(pergunta, resposta, idFazendeiro) {

    var instrucaoSql = `
    INSERT INTO ia (pergunta, resposta, fkFazendeiro) VALUES ('${pergunta}', '${resposta}', '${idFazendeiro}');`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
};