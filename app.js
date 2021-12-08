//Configurar dotenv (gerenciador de variaveis de ambiente)
require("dotenv").config();

//Importar o express
const express = require("express");

//Importar a biblioteca de logs
const morgan = require("morgan");

//Importar o CORS (para autorizar requisições de um dominio diferente)
const cors = require("cors");

//Declarar versão da API
const API_VERSION = 1;

//Importar configurações do banco de dados
const connectToDb = require("./config/db.config");

//Instanciar o Express
const app = express();

//Configurar o Express para aceitar corpos de requisição no formato JSON
app.use(express.json());

//Ligando a biblioteca de logs no Express
app.use(morgan("dev"));

//Configurando o servidor para aceitar requisições do nosso servidor front(servidor React)
app.use(
  cors({
    origin: "http://localhost:3001", //Não pode ter barra no final
  })
);

//Ligar os roteadores na instância do ExpressJS
const usersRouter = require("./routes/users.routes");
const roomsRouter = require("./routes/rooms.routes");
const reviewRouter = require("./routes/review.routes");

//Prefixar todos os endpoints da nossa API com a palavra "api" e uma versão. Isso nos ajuda a identificar futuramente quando houverem vários clientes diferentes, qual versão da API cada um deles usa.
app.use(`/api/${API_VERSION}`, usersRouter);
app.use(`/api/${API_VERSION}`, roomsRouter);
app.use(`/api/${API_VERSION}`, reviewRouter);

//Aguardando conexão com o banco antes de subir o servidor Express. Isso impede que tenhamos um servidor quebrado funcionando.
connectToDb
  .then(() => {
    app.listen(4000, () => {
      console.log("Servidor subiu com sucesso!");
    });
  })
  .catch((err) => {
    console.log(err);
    //Esse código mata o processo do Node.js
    process.exit(5); //5 significa Erro Fatal, ou seja, um erro sem solução nessa execução do script
  });
