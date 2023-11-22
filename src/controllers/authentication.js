import express from 'express';
import { createUser, getUserByEmail } from '../db/users.js';
import { random, authentication, generateSessionToken } from '../helpers/index.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    const user = await getUserByEmail(email).select(
      '+authentication.salt +authentication.password'
    );

    if (!user) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    const jwtToken = generateSessionToken(user._id);
    user.authentication.jwtToken = jwtToken;

    user.ultimo_login = new Date();

    await user.save();

    res.setHeader('Authorization', `Bearer ${jwtToken}`);

    const userLoginResponse = {
      id: user._id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
      token: jwtToken,
    };

    return res.status(200).json(userLoginResponse).end();
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ mensagem: 'Erro de Solicitação: os dados fornecidos são inválidos ou ausentes' });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, nome, telefones } = req.body;

    if (!email || !password || !nome || !telefones) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios ausentes' });
    }

    if (!validateTelefones(telefones)) {
      return res.status(400).json({ mensagem: 'Formato de números de telefone inválido' });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ mensagem: 'E-mail já existente' });
    }

    const salt = random();

    const user = await createUser({
      email,
      nome,
      telefones,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    const jwtToken = generateSessionToken(user._id);
    user.authentication.jwtToken = jwtToken;

    await user.save();

    const userResponse = {
      id: user._id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
      token: jwtToken,
    };

    return res.status(201).json(userResponse).end();
  } catch (error) {
    console.info(error);
    return res.status(500).json({ mensagem: 'Erro do Servidor Interno' });
  }
};

export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ mensagem: 'Proibido: Cabeçalho de autorização ausente' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyJwtToken(token);

  if (!decoded) {
    return res.status(403).json({ mensagem: 'Proibido: Token inválido' });
  }

  req.user = decoded;

  return next();
};

const validateTelefones = (telefones) => {
  const regexNumero = /^\d{9}$/;
  const regexDDD = /^\d{2}$/;

  for (const telefone of telefones) {
    if (!regexNumero.test(telefone.numero) || !regexDDD.test(telefone.ddd)) {
      return false;
    }
  }

  return true;
};
