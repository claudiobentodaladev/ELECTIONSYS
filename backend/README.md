# Sistema de Eleições - API

Uma API para gerenciamento de eleições construída com Express.js, Passport.js e MongoDB.

## Funcionalidades

- Autenticação de usuários
- Gerenciamento de perfis
- Temas de eleição
- Eleições
- Participação
- Candidatos
- Votação

## Tecnologias

- Node.js
- Express.js
- Passport.js
- MongoDB com Mongoose
- bcrypt para hash de senhas
- Helmet para segurança
- CORS
- Rate Limiting

## Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Copie `.env.example` para `.env` e configure as variáveis
4. Inicie o MongoDB
5. Execute: `npm run dev`

## Scripts

- `npm start`: Inicia o servidor em produção
- `npm run dev`: Inicia o servidor em modo desenvolvimento com nodemon

## Endpoints da API

### GET /

Verifica se a API está funcionando.

### POST /api/auth/sign

Registra um novo usuário (validação: email, password, role, profile.name).

### POST /api/auth/login

Faz login do usuário (validação: email, password).

### POST /api/auth/logout

Faz logout do usuário (requer autenticação).

### GET /api/profile

Obtém perfil do usuário (requer autenticação).

**Resposta de sucesso:**

```json
{
  "success": true,
  "message": "profile retrieved",
  "data": {
    "user": { "email": "...", "role": "..." },
    "profile": { "name": "...", ... }
  }
}
```

### PATCH /api/profile/edit

Edita perfil do usuário (validação: name, surname, photo_url; requer autenticação).

**Resposta de sucesso:**

```json
{
  "created": true,
  "message": "created the profile",
  "id": "..."
}
```

### POST /api/theme/create

Cria um tema (validação: title, description opcional; requer autenticação e admin).

**Resposta de sucesso:**

```json
{
  "created": true,
  "message": "created the theme",
  "id": "..."
}
```

### GET /api/theme

Obtém temas.

**Resposta de sucesso:**

```json
{
  "found": true,
  "message": "found all theme",
  "result": [...]
}
```

### POST /api/election/create

Cria uma eleição (validação: title, description, start_at, end_at; requer autenticação e admin).

**Resposta de sucesso:**

```json
{
  "created": true,
  "message": "created the election",
  "id": "..."
}
```

### POST /api/participation/create

Cria participação em eleição (validação: election_id; requer autenticação).

**Resposta de sucesso:**

```json
{
  "created": true,
  "message": "created the participation",
  "id": "..."
}
```

### POST /api/candidates/create

Cria candidato (validação: name, description opcional, photo_url opcional, election_id; requer autenticação).

**Resposta de sucesso:**

```json
{
  "created": true,
  "message": "created the candidation",
  "id": "..."
}
```

### POST /api/vote/create

Vota em candidato (validação: candidate_id; requer autenticação e eleitor).

**Resposta de sucesso:**

```json
{
  "created": true,
  "message": "created the vote",
  "id": "..."
}
```

## Segurança

- Senhas hasheadas com bcrypt
- Sessões armazenadas no MongoDB
- Helmet para headers de segurança
- Rate limiting para prevenir ataques
- CORS configurado
- Middleware de autenticação

## Estrutura do Projeto

```
src/
├── config/
├── controllers/
├── database/
├── middleware/
├── routes/
├── utils/
└── index.mjs
```
