const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    estoque: { type: Number, default: 0 }
});

module.exports = mongoose.model('Produto', ProdutoSchema);