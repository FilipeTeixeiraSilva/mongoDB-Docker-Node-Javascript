# MongoDB + Docker + Node.js

API REST para gerenciamento de produtos e clientes utilizando **Node.js**, **Express**, **Mongoose** e **MongoDB rodando via Docker**.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Função |
|---|---|---|
| Node.js | 18+ | Runtime JavaScript |
| Express | 5.x | Framework HTTP |
| Mongoose | 9.x | ODM para MongoDB |
| dotenv | 17.x | Gerenciamento de variáveis de ambiente |
| MongoDB | 8.x | Banco de dados NoSQL |
| Docker | latest | Container do MongoDB |
| MongoDB Compass | 1.x | Interface visual do banco |

---

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) *(opcional, mas recomendado)*

---

## Estrutura do Projeto

```
mongoDB-Docker-Node-Javascript/
├── server.js        # Servidor Express + conexão com MongoDB + todas as rotas
├── produto.js       # Model Mongoose (schema do Produto)
├── cliente.js       # Model Mongoose (schema do Cliente)
├── .env             # Variáveis de ambiente (não sobe para o Git)
├── .env.example     # Modelo do .env para novos desenvolvedores
├── .gitignore       # Arquivos ignorados pelo Git
├── package.json     # Dependências e scripts do projeto
└── node_modules/    # Dependências instaladas
```

---

## Variáveis de Ambiente

O projeto usa **dotenv** para proteger dados sensíveis fora do código.

Crie um arquivo `.env` na raiz com base no `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/meu_primeiro_nosql
```

> O `.env` está no `.gitignore` e **nunca deve ser commitado**. O `.env.example` serve como guia para quem clonar o repositório.

---

## Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd mongoDB-Docker-Node-Javascript
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

### 4. Suba o MongoDB no Docker

```bash
docker run -d --name meu-mongo -p 27017:27017 mongo:latest
```

Verifique se o container está rodando:

```bash
docker ps
```

### 5. Inicie o servidor

**Modo desenvolvimento** (reinicia automaticamente ao salvar):
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

Se tudo estiver correto, você verá:

```
🔥 Servidor rodando na porta 3000
🚀 Conectado ao MongoDB via Docker com sucesso!
```

> A porta exibida é lida do `.env`. Para mudar, basta alterar o valor de `PORT`.

---

## Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| `npm start` | `node server.js` | Inicia em modo produção |
| `npm run dev` | `node --watch server.js` | Inicia com hot-reload nativo do Node.js |

---

## Modelos de Dados

### Produto

| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| `nome` | String | Sim | — |
| `preco` | Number | Sim | — |
| `estoque` | Number | Não | `0` |

### Cliente

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `nome` | String | Sim | — |
| `email` | String | Sim | Único no banco |
| `dataNascimento` | Date | Sim | Formato `YYYY-MM-DD` |

---

## Endpoints da API

Base URL: `http://localhost:3000`

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/produtos` | Cria um novo produto |
| `GET` | `/produtos` | Lista todos os produtos |
| `PUT` | `/produtos/:id` | Atualiza o produto inteiro |
| `PATCH` | `/produtos/:id` | Atualiza campos específicos |
| `DELETE` | `/produtos/:id` | Remove um produto |

### Clientes

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/clientes` | Cria um novo cliente |
| `GET` | `/clientes` | Lista todos os clientes |
| `PUT` | `/clientes/:id` | Atualiza o cliente inteiro |
| `PATCH` | `/clientes/:id` | Atualiza campos específicos |
| `DELETE` | `/clientes/:id` | Remove um cliente |

---

## Detalhes dos Endpoints

### POST /produtos — Criar produto

**Body:**
```json
{
  "nome": "Tênis Nike Air Max",
  "preco": 499.90,
  "estoque": 10
}
```

**Resposta (201 Created):**
```json
{
  "_id": "6660f1a2b3c4d5e6f7890123",
  "nome": "Tênis Nike Air Max",
  "preco": 499.90,
  "estoque": 10,
  "__v": 0
}
```

---

### GET /produtos — Listar produtos

**Resposta (200 OK):**
```json
[
  {
    "_id": "6660f1a2b3c4d5e6f7890123",
    "nome": "Tênis Nike Air Max",
    "preco": 499.90,
    "estoque": 10,
    "__v": 0
  }
]
```

---

### PUT /produtos/:id — Atualizar produto inteiro

Substitui **todos** os campos do produto. Campos não enviados voltam ao valor padrão.

**Body:**
```json
{
  "nome": "Tênis Nike Air Max 2",
  "preco": 599.90,
  "estoque": 5
}
```

**Resposta (200 OK):**
```json
{
  "_id": "6660f1a2b3c4d5e6f7890123",
  "nome": "Tênis Nike Air Max 2",
  "preco": 599.90,
  "estoque": 5,
  "__v": 0
}
```

---

### PATCH /produtos/:id — Atualizar campos específicos

Atualiza **apenas os campos enviados**, sem tocar nos demais.

**Body:**
```json
{
  "preco": 449.90
}
```

**Resposta (200 OK):**
```json
{
  "_id": "6660f1a2b3c4d5e6f7890123",
  "nome": "Tênis Nike Air Max 2",
  "preco": 449.90,
  "estoque": 5,
  "__v": 0
}
```

---

### DELETE /produtos/:id — Remover produto

**Resposta (200 OK):**
```json
{
  "mensagem": "Produto removido com sucesso!",
  "produto": {
    "_id": "6660f1a2b3c4d5e6f7890123",
    "nome": "Tênis Nike Air Max 2",
    "preco": 449.90,
    "estoque": 5,
    "__v": 0
  }
}
```

---

### POST /clientes — Criar cliente

**Body:**
```json
{
  "nome": "Filipe Silva",
  "email": "filipe@email.com",
  "dataNascimento": "1998-05-20"
}
```

**Resposta (201 Created):**
```json
{
  "_id": "6660f1a2b3c4d5e6f7890456",
  "nome": "Filipe Silva",
  "email": "filipe@email.com",
  "dataNascimento": "1998-05-20T00:00:00.000Z",
  "__v": 0
}
```

---

### GET /clientes — Listar clientes

**Resposta (200 OK):**
```json
[
  {
    "_id": "6660f1a2b3c4d5e6f7890456",
    "nome": "Filipe Silva",
    "email": "filipe@email.com",
    "dataNascimento": "1998-05-20T00:00:00.000Z",
    "__v": 0
  }
]
```

---

### PUT /clientes/:id — Atualizar cliente inteiro

**Body:**
```json
{
  "nome": "Filipe Teixeira",
  "email": "filipe.novo@email.com",
  "dataNascimento": "1998-05-20"
}
```

---

### PATCH /clientes/:id — Atualizar campos específicos

**Body:**
```json
{
  "email": "filipe.atualizado@email.com"
}
```

---

### DELETE /clientes/:id — Remover cliente

**Resposta (200 OK):**
```json
{
  "mensagem": "Cliente removido com sucesso!",
  "cliente": {
    "_id": "6660f1a2b3c4d5e6f7890456",
    "nome": "Filipe Teixeira",
    "email": "filipe.atualizado@email.com",
    "dataNascimento": "1998-05-20T00:00:00.000Z",
    "__v": 0
  }
}
```

---

## Testando com o Postman

O [Postman](https://www.postman.com/downloads/) é uma ferramenta visual para testar APIs sem precisar escrever código.

### Configuração inicial

1. Abra o Postman
2. Certifique-se de que o servidor está rodando (`npm run dev`)
3. Certifique-se de que o container Docker está ativo (`docker ps`)

---

### Teste 1 — Criar um Produto (POST)

1. Clique em **New Request**
2. Selecione o método **POST**
3. URL: `http://localhost:3000/produtos`
4. Aba **Body** → **raw** → **JSON**
5. Cole o body e clique em **Send**

```json
{
  "nome": "Tênis Nike Air Max",
  "preco": 499.90,
  "estoque": 10
}
```

**Resultado esperado — Status `201 Created`**

---

### Teste 2 — Listar Produtos (GET)

1. Método **GET**
2. URL: `http://localhost:3000/produtos`
3. Clique em **Send** *(sem body)*

**Resultado esperado — Status `200 OK`**

---

### Teste 3 — Criar um Cliente (POST)

1. Método **POST**
2. URL: `http://localhost:3000/clientes`
3. Aba **Body** → **raw** → **JSON**

```json
{
  "nome": "Filipe Silva",
  "email": "filipe@email.com",
  "dataNascimento": "1998-05-20"
}
```

**Resultado esperado — Status `201 Created`**

> A data deve ser enviada no formato `YYYY-MM-DD`.

---

### Dica — PUT vs PATCH

| | PUT | PATCH |
|---|---|---|
| O que faz | Substitui o documento inteiro | Atualiza só os campos enviados |
| Quando usar | Quando quer reescrever tudo | Quando quer mudar um campo só |
| Campos não enviados | Voltam ao padrão | Permanecem inalterados |

---

### Dica — Testando Erros

Tente criar um cliente com email já cadastrado:

**Resultado esperado — Status `400 Bad Request`:**
```json
{
  "erro": "E11000 duplicate key error..."
}
```

Tente enviar um ID inválido no PUT/PATCH/DELETE:

**Resultado esperado — Status `400 Bad Request`:**
```json
{
  "erro": "ID inválido"
}
```

---

## Testando com o Compass

1. Abra o **MongoDB Compass**
2. Conecte usando: `mongodb://localhost:27017`
3. Navegue até o banco `meu_primeiro_nosql`
4. Você verá as coleções `produtos` e `clientes` com os documentos em tempo real

---

## Comandos Docker Úteis

```bash
# Ver containers rodando
docker ps

# Parar o container
docker stop meu-mongo

# Iniciar o container novamente
docker start meu-mongo

# Ver versão do MongoDB no container
docker exec -it meu-mongo mongod --version

# Acessar o shell do MongoDB
docker exec -it meu-mongo mongosh
```

---

## Como Funciona por Baixo

```
Cliente HTTP (Postman / Insomnia / cURL)
        │
        ▼
   Express (porta definida no .env)
        │
        ▼
   Mongoose (valida e converte os dados)
        │
        ▼
   MongoDB (Docker, porta 27017)
```

1. O **dotenv** carrega as variáveis do `.env` (porta e URL do banco)
2. O **Express** recebe as requisições HTTP e direciona para a rota correta
3. O **Mongoose** valida os dados com o Schema e os transforma em documentos
4. O **MongoDB** armazena os documentos nas coleções `produtos` e `clientes`

---

## Próximos Passos Sugeridos

- [ ] Adicionar rota `GET /produtos/:id` para buscar produto por ID
- [ ] Adicionar rota `GET /clientes/:id` para buscar cliente por ID
- [ ] Criar um `docker-compose.yml` para subir tudo junto
- [ ] Adicionar autenticação com JWT

---

## Autor

Feito com dedicação para aprender **MongoDB + Docker + Node.js** na prática.
