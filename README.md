# **Projeto: APIRest/Express.js/Node.js**

**Descrição:**
====

Projeto feito em Node.js, Express e MongoDB:

Deployment foi feito no Render:

[https://joey-restapi.onrender.com](https://joey-restapi.onrender.com).

**Instruções de uso:**
====

## /auth/register

**Método:** POST

**Descrição:** Registra um novo usuário.

**Requisição:**

```json
{
  "email": "e-mail",
  "password": "senha",
  "nome": "nome de usuário",
  "telefones": [
  {
   "numero": "numero",
   "ddd": "ddd"
  }
 ]
}
```

---

## /auth/login

**Método:** POST

**Descrição:** Faz login em um usuário existente.

**Requisição:**

```json
{
  "email": "e-mail",
  "password": "senha"
}
```

---

## /users

**Método:** GET

**Descrição:** Lista todos os usuários.

**Cabeçalho da requisição:**

- Authorization: Barear {token}

**Resposta:**

- users: array de usuários

```json
[
  "..."
]
```

---

## /users/:id

**Método:** DELETE

**Descrição:** Deleta um usuário.

**Cabeçalho da requisição:**

- Authorization: Barear {token}

**Parâmetro:**

- id: ID do usuário a ser deletado

---

## /users/:id

**Método:** PATCH

**Descrição:** Atualiza um usuário.

**Cabeçalho da requisição:**

- Authorization: Barear {token}

**Requisição:**

```json
{
  "nome": "nome de usuário",
}
```

---

- Em resumo, as rotas /auth/register e /auth/login são usadas para autenticar usuários. A rota /users é usada para listar todos os usuários. As rotas /users/:id são usadas para deletar ou atualizar um usuário.

- Para listar os usuários após o login, você deve usar a rota /users.
