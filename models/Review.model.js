//Importar o mongoose
const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  comment: { type: String, maxLength: 200, trim: true },
  roomId: {type: mongoose.Types.ObjectId, ref:"Room"},
  userId: {type: mongoose.Types.ObjectId, ref:"User"},
});

module.exports = mongoose.model("Review", ReviewSchema)