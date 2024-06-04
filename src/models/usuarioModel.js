var database = require("../database/config");

function cadastrar(pergunta, resposta) {

    var instrucaoSql = `
    INSERT INTO ia (pergunta, resposta) VALUES ('${pergunta}', '${resposta}');`;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
};