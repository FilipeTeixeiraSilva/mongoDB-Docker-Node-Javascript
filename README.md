# MongoDB + Docker + Node.js

API REST para gerenciamento de produtos utilizando **Node.js**, **Express**, **Mongoose** e **MongoDB rodando via Docker**.

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
├── server.js        # Servidor Express + conexão com MongoDB + rotas
├── produto.js       # Model Mongoose (schema do Produto)
├── .env             # Variáveis de ambiente (não sobe para o Git)
├── .env.example     # Modelo do .env para novos desenvolvedores
├── .gitignore       # Arquivos ignorados pelo Git
├── package.json     # Dependências e scripts do projeto
└── node_modules/    # Dependências instaladas
```

---

## Variáveis de Ambiente

O projeto usa **dotenv** para proteger dados sensíveis (como a URL do banco) fora do código.

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

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

Copie o arquivo de exemplo e preencha com seus valores:

```bash
cp .env.example .env
```

O `.env` já vem configurado para o Docker local:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/meu_primeiro_nosql
```

### 4. Suba o MongoDB no Docker

```bash
docker run -d --name meu-mongo -p 27017:27017 mongo:latest
```

> Isso cria um container chamado `meu-mongo` expondo o MongoDB na porta `27017`.

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

> A porta exibida é lida do `.env`. Para mudar, basta alterar o valor de `PORT` no seu arquivo `.env`.

---

## Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| `npm start` | `node server.js` | Inicia o servidor em modo produção |
| `npm run dev` | `node --watch server.js` | Inicia com hot-reload nativo do Node.js |

> O `node --watch` é o hot-reload nativo do Node.js (v18+), sem precisar de dependências extras como o nodemon.

---

## Modelo de Dados — Produto

```json
{
  "nome": "Tênis Nike",
  "preco": 299.90,
  "estoque": 15
}
```

| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| `nome` | String | Sim | — |
| `preco` | Number | Sim | — |
| `estoque` | Number | Não | `0` |

---

## Endpoints da API

Base URL: `http://localhost:3000`

### Criar Produto

```http
POST /produtos
Content-Type: application/json
```

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

### Listar Produtos

```http
GET /produtos
```

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
3. No campo de URL, digite: `http://localhost:3000/produtos`
4. Vá na aba **Body**
5. Selecione **raw** e depois **JSON** no dropdown ao lado
6. Cole o seguinte JSON no campo:

```json
{
  "nome": "Tênis Nike Air Max",
  "preco": 499.90,
  "estoque": 10
}
```

7. Clique em **Send**

**Resultado esperado — Status `201 Created`:**
```json
{
  "_id": "6660f1a2b3c4d5e6f7890123",
  "nome": "Tênis Nike Air Max",
  "preco": 499.90,
  "estoque": 10,
  "__v": 0
}
```

> O campo `_id` é gerado automaticamente pelo MongoDB. O `__v` é o campo de versão do Mongoose.

---

### Teste 2 — Listar Produtos (GET)

1. Crie uma nova request
2. Selecione o método **GET**
3. No campo de URL, digite: `http://localhost:3000/produtos`
4. Clique em **Send** *(sem body desta vez)*

**Resultado esperado — Status `200 OK`:**
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

> A resposta é sempre um array, mesmo que tenha só um produto.

---

### Dica — Testando Erros

Tente enviar um POST sem o campo `nome` (que é obrigatório):

```json
{
  "preco": 199.90
}
```

**Resultado esperado — Status `400 Bad Request`:**
```json
{
  "erro": "produtos validation failed: nome: Path `nome` is required."
}
```

Isso confirma que a validação do Mongoose está funcionando corretamente.

---

## Testando com o Compass

1. Abra o **MongoDB Compass**
2. Na tela inicial, conecte usando: `mongodb://localhost:27017`
3. Navegue até o banco `meu_primeiro_nosql` > coleção `produtos`
4. Você verá todos os documentos criados pela API em tempo real

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
Cliente (Postman / Insomnia / cURL)
        │
        ▼
   Express (porta 3000)
        │
        ▼
   Mongoose (ODM)
        │
        ▼
   MongoDB (Docker, porta 27017)
```

1. O **dotenv** carrega as variáveis do `.env` antes de qualquer coisa (porta e URL do banco)
2. O **Express** recebe as requisições HTTP
3. O **Mongoose** valida os dados com o Schema e os transforma em documentos
4. O **MongoDB** armazena os documentos na collection `produtos`

---

## Próximos Passos Sugeridos

- [ ] Adicionar rota `GET /produtos/:id` para buscar por ID
- [ ] Adicionar rota `PUT /produtos/:id` para atualizar
- [ ] Adicionar rota `DELETE /produtos/:id` para deletar
- [ ] Adicionar validações extras no Schema
- [ ] Criar um `docker-compose.yml` para subir tudo junto

---

## Autor

Feito com dedicação para aprender **MongoDB + Docker + Node.js** na prática.
