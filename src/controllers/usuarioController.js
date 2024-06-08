var usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var pergunta = req.body.perguntaServer;
    var resposta = req.body.respostaServer;
    var idFazendeiro = req.body.idFazendeiroServer;

    // Faça as validações dos valores
    if (pergunta == undefined) {
        res.status(400).send("Seu pergunta está undefined!");
    } 
    else if (resposta == undefined) {
        res.status(400).send("Seu resposta está undefined!");
    }
    else if (idFazendeiro == undefined) {
        res.status(400).send("Seu resposta está undefined!");
    }
     else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        
        usuarioModel.cadastrar(pergunta, resposta, idFazendeiro)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    cadastrar
};