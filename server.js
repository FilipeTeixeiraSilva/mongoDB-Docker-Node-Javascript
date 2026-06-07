require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Produto = require('./produto');

const app = express();
app.use(express.json());

// Conectando no MongoDB que está rodando no seu Docker
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🚀 Conectado ao MongoDB via Docker com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao banco:', err));

// ROTA POST (Criar)
app.post('/produtos', async (req, res) => {
    try {
        const novoProduto = new Produto(req.body);
        await novoProduto.save();
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// ROTA GET (Listar)
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${process.env.PORT}`);
});