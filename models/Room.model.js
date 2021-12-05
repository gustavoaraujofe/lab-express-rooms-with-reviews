//Importar o mongoose
const mongoose = require('mongoose')

//Definir quais campos e quais regras desses campos os documentos do MongoDB terão (Schema)
const RoomSchema = new mongoose.Schema({
    name: {type: String, trim: true},
    description: {type: String, trim: true},
    imageUrl: {type: String, trim: true},
    reviews: [{type: mongoose.Types.ObjectId, ref: "Review"}], 
    userId: String
})

module.exports = mongoose.model("Room", RoomSchema)
