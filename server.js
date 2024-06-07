const express = require('express');
const cors = require('cors');
const serveStatic = require('serve-static');
var path = require("path");
const fs = require('fs');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

var caminho_env = '.env.dev';

require("dotenv").config({ path: caminho_env });

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");

const app = express();
const port = 3000;

const API_KEY = "AIzaSyDK-JGs7x-LesCNeFRixixZuDIqCQH41s8";

const MODEL_NAME = "gemini-1.0-pro";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

system_instruction = "Você é um jogador profissional de Stardew Valley";

generationConfig = {
  temperature: 0,
  topK: 0,
  topP: 0.9,
  maxOutputTokens: 20000
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

function escreverArquivoJSON(novoPrompt, novaResposta) {

  // Leitura do arquivo JSON existente
  fs.readFile('historico.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo JSON:', err);
      return;
    }

    try {
      const historico = JSON.parse(data);

      historico.push(novoPrompt);
      historico.push(novaResposta);
      const jsonDados = JSON.stringify(historico, null, 2);

      // Escreve os dados atualizados no arquivo JSON
      fs.writeFile('historico.json', jsonDados, 'utf8', err => {
        if (err) {
          console.error('Erro ao escrever no arquivo JSON:', err);
          return;
        }
        console.log('Novas informações adicionadas com sucesso ao arquivo JSON.');

      });
    } catch (parseError) {
      console.error('Erro ao analisar o arquivo JSON:', parseError);
    }
  });
}

global.historicoData = null;

const caminhoArquivo = 'historico.json';

function lerArquivoJSON(caminho) {
  return new Promise((resolve, reject) => {
    fs.readFile(caminho, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

// Uso da função para ler o arquivo JSON
lerArquivoJSON(caminhoArquivo)
  .then(data => {
    global.historicoData = data;
    // Você pode manipular os dados aqui
  })
  .catch(error => {
    console.error('Erro ao ler o arquivo JSON:', error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);

app.use(serveStatic(__dirname));

app.get('/generate-text', async (req, res) => {

  const text = req.query.text;
  const tamanho = req.query.tamanho;
  var grandeza = '';

  if (tamanho == '#') {
    grandeza = 'comum';
    console.log('comum');
  }
  else if (tamanho == 'grande') {
    grandeza = 'grande';
    console.log('grande');
  }
  else if (tamanho == 'medio') {
    grandeza = 'mediano';
    console.log('medio');
  }
  else if (tamanho == 'peq') {
    grandeza = 'pequeno';
    console.log('pequeno');
  }

  const prompt = `Vou te fazer uma pergunta sobre Stardew Valley, a sua função é responder apenas se a pergunta estiver relacionado ao jogo. Mas, caso a pergunta seja exatamente: 'Oque achamos da Caramico e da Raissa' a sua resposta deverá ser: 'Elas são ótimas professoras e gostamos muito delas! \n Depois dessa acho que merecemos um pontinho extra! :)', lembrando que essa á unica pergunta que você devera responder fora do escopo de Stardew Valley.\n
  ------------------ \n
  Por favor, forneça uma resposta de tamanho ${grandeza} para a seguinte pergunta sobre o jogo 'Stardew Valley': ${text}.`;

  const chat = model.startChat({
    generationConfig, safetySettings, history: global.historicoData
  });
  const result = await chat.sendMessage(prompt);
  const response = result.response;

  fetch("http://10.18.33.58:3000/usuarios/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({

      perguntaServer: text,
      respostaServer: response.text(),
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {

      } else {
        throw "Houve um erro ao tentar realizar o cadastro!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);

    });
  const novoPrompt =
  {
    "role": "user",
    "parts": [
      { "text": text }
    ]
  };

  const novaResposta =
  {
    "role": "model",
    "parts": [
      { "text": response.text() }
    ]
  };

  escreverArquivoJSON(novoPrompt, novaResposta);

  res.send(response.text());
});
app.listen(port, () => {
  console.log(`Acesse o caminho a seguir para visualizar .: http://10.18.33.58:${port}/ia.html :.`);
});
