require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Produto = require('./produto');
const Cliente = require('./cliente');

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


// ROTA PUT: Atualiza o produto INTEIRO buscando pelo ID na URL
app.put('/produtos/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        // Bloqueia operadores do MongoDB no payload (ex.: $unset, $inc) e paths com '.'
        const invalidKey = Object.keys(req.body || {}).find((k) => k.startsWith('$') || k.includes('.'));
        if (invalidKey) {
            return res.status(400).json({ erro: 'Payload inválido para atualização' });
        }
        const produtoAtualizado = await Produto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!produtoAtualizado) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json(produtoAtualizado);
    } catch (error) {
        const status = (error?.name === 'ValidationError' || error?.name === 'CastError') ? 400 : 500;
        res.status(status).json({ erro: error.message });
    }
});

// ROTA PATCH: Atualiza apenas os campos enviados no Body buscando pelo ID
app.patch('/produtos/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        const invalidKey = Object.keys(req.body || {}).find((k) => k.startsWith('$') || k.includes('.'));
        if (invalidKey) {
            return res.status(400).json({ erro: 'Payload inválido para atualização' });
        }

        // O funcionamento no Mongoose é parecido com o PUT, mas passamos apenas o que veio no body
        const produtoModificado = await Produto.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // O operador $set garante que apenas os campos enviados sejam tocados
            { new: true, runValidators: true }
        );

        if (!produtoModificado) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json(produtoModificado);
    } catch (error) {
        const status = (error?.name === 'ValidationError' || error?.name === 'CastError') ? 400 : 500;
        res.status(status).json({ erro: error.message });
    }
});

// ROTA DELETE: Remove um produto do banco buscando pelo ID
app.delete('/produtos/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        const produtoDeletado = await Produto.findByIdAndDelete(req.params.id);

        if (!produtoDeletado) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json({ mensagem: 'Produto removido com sucesso!', produto: produtoDeletado });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ROTA POST: Cria um novo cliente
app.post('/clientes', async (req, res) => {
    try {
        const novoCliente = new Cliente(req.body);
        await novoCliente.save();
        res.status(201).json(novoCliente);
    } catch (error) {
        const status =
            (error?.name === 'ValidationError' || error?.name === 'CastError') ? 400 :
            (error?.code === 11000) ? 409 :
            500;
        res.status(status).json({ erro: status === 409 ? 'Email já cadastrado' : error.message });
    }
});

// ROTA GET: Lista todos os clientes
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ROTA PUT: Atualiza o cliente INTEIRO buscando pelo ID
app.put('/clientes/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        const invalidKey = Object.keys(req.body || {}).find((k) => k.startsWith('$') || k.includes('.'));
        if (invalidKey) {
            return res.status(400).json({ erro: 'Payload inválido para atualização' });
        }

        const missing = ['nome', 'email', 'dataNascimento'].filter((f) => req.body?.[f] == null);
        if (missing.length) {
            return res.status(400).json({ erro: `Campos obrigatórios ausentes: ${missing.join(', ')}` });
        }
        const clienteAtualizado = await Cliente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!clienteAtualizado) {
            return res.status(404).json({ erro: 'Cliente não encontrado' });
        }

        res.json(clienteAtualizado);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ erro: 'E-mail já cadastrado' });
        }
        const status = (error?.name === 'ValidationError' || error?.name === 'CastError') ? 400 : 500;
        res.status(status).json({ erro: error.message });
    }
});

// ROTA PATCH: Atualiza apenas os campos enviados buscando pelo ID
app.patch('/clientes/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        const invalidKey = Object.keys(req.body || {}).find((k) => k.startsWith('$') || k.includes('.'));
        if (invalidKey) {
            return res.status(400).json({ erro: 'Payload inválido para atualização' });
        }

        const clienteModificado = await Cliente.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!clienteModificado) {
            return res.status(404).json({ erro: 'Cliente não encontrado' });
        }

        res.json(clienteModificado);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ erro: 'E-mail já cadastrado' });
        }
        const status = (error?.name === 'ValidationError' || error?.name === 'CastError') ? 400 : 500;
        res.status(status).json({ erro: error.message });
    }
});

// ROTA DELETE: Remove um cliente buscando pelo ID
app.delete('/clientes/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        const clienteDeletado = await Cliente.findByIdAndDelete(req.params.id);

        if (!clienteDeletado) {
            return res.status(404).json({ erro: 'Cliente não encontrado' });
        }

        res.json({ mensagem: 'Cliente removido com sucesso!', cliente: clienteDeletado });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${process.env.PORT}`);
});