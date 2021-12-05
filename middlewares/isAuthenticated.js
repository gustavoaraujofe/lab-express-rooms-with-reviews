//Importar o jwt
const jwt = require("jsonwebtoken");

//Extrair o token do cabeçalho
function extractTokenFromHeaders(req) {
  //Verifica se existe a autorização no cabeçalho
  if (!req.headers.authorization) {
    throw new Error("Requisição inválida: não contém cabeçalho Autorization");
  }

  //Retorna apenas o token
  return req.headers.authorization.split(" ")[1];
}

//Verificar se o token é válido
function isAuthenticated(req, res, next) {
  const token = extractTokenFromHeaders(req);

  jwt.verify(token, process.env.TOKEN_SIGN_SECRET, (err, decoded) => {
    //Caso o processo de verificação falhe, encerre a função prematuramente
    if (err) {
      console.log(err);
      return res
        .status(401)
        .json({ message: "Acesso negado", reason: err.message });
    }

    req.user = decoded;

    return next()
  });
}

module.exports = isAuthenticated