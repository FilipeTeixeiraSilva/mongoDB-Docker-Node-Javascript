const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dataNascimento: { type: Date, required: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
