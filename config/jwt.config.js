//Importar o jsonwebtoken
const jwt = require("jsonwebtoken");

//Função para gerar o token
function generateToken(userObj) {
  //Extrair dados do usuário
  const { _id, name, email } = userObj;

  //Puxar assinatura
  const signature = process.env.TOKEN_SIGN_SECRET;

  //Definir expiração
  const expiration = "4h";

  //Retornar a função
  return jwt.sign({ _id, name, email }, signature, { expiresIn: expiration });
}

module.exports = generateToken