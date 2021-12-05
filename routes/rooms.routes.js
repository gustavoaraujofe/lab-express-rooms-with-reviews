//Importar o express
const express = require("express");

//Configurar um roteador
const router = express.Router();

//Importar o modelo da coleção
const RoomsModel = require("../models/Room.model");

//Importar o modelo de usuários
const UserModel = require("../models/User.model");

//Importar Autenticação JWT
const isAuthenticated = require("../middlewares/isAuthenticated");

//Cadastro quarto

//Só gera cadastro se estiver logado
router.post("/create-rooms", isAuthenticated, async (req, res) => {
  try {
    //Extrair os dados do corpo da requisição

    const { name, description, imageUrl } = req.body;

    //Inserir no banco de dados
    const roomCreated = await RoomsModel.create({
      name,
      description,
      imageUrl,
      userId: req.user._id,
    });

    //Inserir o ID do quarto no cadastro do usuário
    await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { roomsId: roomCreated._id } }
    );

    res.status(201).json(roomCreated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Busca lista completa dos quartos (exibe apenas se estiver logado)
router.get("/rooms", isAuthenticated, async (req, res) => {
  try {
    const rooms = await RoomsModel.find();

    res.status(200).json(rooms);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Busca apenas um quarto(exibe apenas se o estiver logado)
router.get("/rooms/:id", isAuthenticated, async (req, res) => {
  try {
    const room = await RoomsModel.findOne({
      _id: req.params.id,
    }).populate("reviews");

    if (!room) {
      return res
        .status(404)
        .json({ message: "Acesso negado: operação não permitida" });
    }

    res.status(200).json(room);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Quarto não encontrado" });
  }
});

//Atualiza dados do quarto(Apenas permite atualização se o quarto foi cadastrado pelo usuario logado)

router.patch("/edit-rooms/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedRoom = await RoomsModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return res
        .status(403)
        .json({ message: "Acesso negado: operação não permitida" });
    }

    res.status(200).json(updatedRoom);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Quarto não encontrado" });
  }
});

//Deleta quarto(Deleta apenas se o quarto foi cadastrado pelo usuário logado)

router.delete("/room/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const dataRoom = await RoomsModel.findOne({ _id: req.params.id });

    if (req.user._id !== dataRoom.userId) {
      return res.status(403).json({
        message:
          "Acesso negado: você não tem permissão para deletar esse quarto.",
      });
    }

    //Deleta ID do cadastro do usuario
    await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { roomsId: req.params.id } }
    );

    const deleteRoom = await RoomsModel.deleteOne({ _id: req.params.id });

    if (deleteRoom.deletedCount < 1) {
      return res.status(404).json({ message: "Quarto não encontrado" });
    }

    res.status(200).json({ message: "Quarto deletado." });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Quarto não encontrado" });
  }
});

module.exports = router;
