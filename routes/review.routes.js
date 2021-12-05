//Importar o express
const express = require("express");

//Configurar o roteador
const router = express.Router();

//Importar o modelo da coleção reviews
const ReviewModel = require("../models/Review.model");

//Importar o modelo da coleção de quartos
const RoomModel = require("../models/Room.model");

//Importar o modelo da coleção de usuarios
const UserModel = require("../models/User.model");

//Importar Autenticação JWT
const isAuthenticated = require("../middlewares/isAuthenticated");

//Criar o comentário(Apenas se estiver logado e se o usuario não for o dono do quarto)
router.post("/room/create-review", isAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user._id });
    const { comment, roomId } = req.body;

    //Verifica se o usuario logado é o dono do quarto
    if (user.roomsId.includes(req.body.roomId)) {
      return res.status(403).json({
        message:
          "Acesso negado: você não pode fazer comentário no seu próprio anúncio",
      });
    }

    const reviewCreated = await ReviewModel.create({
      comment: comment,
      roomId: roomId,
      userId: user._id,
    });

    await RoomModel.findOneAndUpdate(
      { _id: reviewCreated.roomId },
      { $push: { reviews: reviewCreated._id } }
    );

    res.status(201).json(reviewCreated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Atualizar comentário(apenas se for o dono do comentário)
router.patch("/room/edit-review/:id", isAuthenticated, async (req, res) => {
  try {
    const review = await ReviewModel.findOne({ _id: req.params.id });

    //Verifica se o usuario logado é o dono do comentário
    if (review.userId.valueOf() !== req.user._id) {
      return res.status(403).json({
        message:
          "Acesso negado: você não tem autorização para atualizar esse comentário",
      });
    }

    const reviewUpdated = await ReviewModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { comment: req.body.comment } },
      { new: true, runValidators: true }
    );

    res.status(200).json(reviewUpdated);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Comentário não encontrado" });
  }
});

//Excluir comentário(Apenas se for o dono do comentário ou o dono do quarto)

router.delete("/room/delete-review/:id", isAuthenticated, async (req, res) => {
  try {

    //Salva o comentário e usuario em uma variavel
    const review = await ReviewModel.findOne({ _id: req.params.id });
    const user = await UserModel.findOne({ _id: req.user._id });

    //Verifica se o usuario logado é o dono do comentário
    if (review.userId.valueOf() === user._id.valueOf()) {
      //Utiliza o comentário salvo pra excluir o ID no quarto
      await RoomModel.findOneAndUpdate(
        { _id: review.roomId },
        { $pull: { reviews: req.params.id } }
      );

      //Deleta o comentário
      const deletedReview = await ReviewModel.deleteOne({ _id: req.params.id });

      if (deletedReview.deletedCount < 1) {
        return res.status(404).json({ message: "Comentário não encontrado" });
      }

      return res.status(200).json({});
    }

    res.status(403).json({
      message:
        "Acesso negado: você não tem autorização para excluir esse comentário",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Comentário não encontrado" });
  }
});

module.exports = router;
