//importar o Express
const express = require("express");

//Importar o Bcrypt
const bcrypt = require("bcryptjs");

//Declarar SALT para o Bcrypt
const SALT_ROUNDS = 10;

//Configura o roteador
const router = express.Router();

//Importa o modelo da coleção
const UserModel = require("../models/User.model");

//Importar função que gera o Token jwtid
const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");

//Cadastro

router.post("/signup", async (req, res) => {
  try {
    //Extrair os dados do corpo da requisição
    const { name, email, password } = req.body;

    //Verificar se a senha é forte
    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      )
    ) {
      return res.status(400).json({
        msg: "A senha deve conter pelo menos 8 caracteres, letras maiúscula e minúsculas, números e caracteres especiais",
      });
    }

    //Criptografar a senha

    //Gerar o salt (string aleatória) com custo 10
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);

    //Criptografando a senha do usúario
    const passwordHash = bcrypt.hashSync(password, salt);

    //Inserir no banco de dados
    const userCreated = await UserModel.create({ name, email, passwordHash });

    //Responder requisição
    res.status(201).json(userCreated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Login

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    //Extrair os dados do corpo da requisição
    const { email, password } = req.body;

    //Procurar o usuário no banco de dados através do email
    const foundUser = await UserModel.findOne({ email });

    //Verifica se o usuário existe no banco de dados
    if (!foundUser) {
      return res.status(400).json({ msg: "E-mail ou senha incorretos." });
    }

    //Caso encontrado, verifica se a senha está correta
    if (!bcrypt.compareSync(password, foundUser.passwordHash)) {
      return res.status(400).json({ msg: "E-mail ou senha incorretos2." });
    }

    //Caso correta, cria uma sessão para esse usuário
    const token = generateToken(foundUser);

    res.status(200).json({token: token, user: {name: foundUser.name, email: foundUser.email}});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Buscar apenas 1 usuario
router.get("/found-user", isAuthenticated, async (req, res) => {
  try {
    console.log(req.user._id);
    const { name, email } = await UserModel.findOne({ email: req.user.email });

    if (!name) {
      return res
        .status(404)
        .json({ message: "Acesso negado: operação não permitida" });
    }

    res.status(200).json({name: name, email: email});
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Usuário não encontrado" });
  }
});

//Atualizar cadastro

router.patch("/edit-user", isAuthenticated, async (req, res) => {
  try {
    //Encontra e atualiza o documento do usuário
    const updateUser = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json(updateUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Excluir cadastro

router.delete("/user/delete", isAuthenticated, async (req, res) => {
  try {
    const deleteUser = await UserModel.deleteOne({ _id: req.user._id });

    if (deleteUser.deletedCount < 1) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json(deleteUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
