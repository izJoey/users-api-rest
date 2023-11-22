import express from 'express';
import jwt from 'jsonwebtoken';

import { createUser, getUserByEmail } from '../db/users.js';
import { random, authentication, generateSessionToken } from '../helpers/index.js';

let globalJwtToken = null;

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

    // const salt = random();

    // user.authentication.sessionToken = authentication(salt, user._id.toString());

    //const sessionToken = generateSessionToken(user._id.toString());
    //user.authentication.sessionToken = sessionToken;

    const jwtToken = generateSessionToken(user._id);
    user.authentication.jwtToken = jwtToken;
    globalJwtToken = jwtToken;

    user.ultimo_login = new Date();

    await user.save();

    //res.cookie('JOEY-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
    //res.setHeader('Authorization', `Bearer ${user.authentication.sessionToken}`);
    //const jwtToken = jwt.sign({ _id: user._id }, 'your-secret-key', { expiresIn: '1h' });
    //const jwtToken = generateSessionToken(user._id);
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
    return res.status(400).json();
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
        //sessionToken,
      },
    });

    //const sessionToken = generateSessionToken(user._id.toString());

    const jwtToken = generateSessionToken(user._id);
    user.authentication.jwtToken = jwtToken;
    globalJwtToken = jwtToken;

    await user.save();

    //user.authentication.sessionToken = sessionToken; /// maybe not be necessary

    const userResponse = {
      id: user._id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
      token: jwtToken,
    };

    return res.status(201).json(userResponse).end(); //.json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.info(error);
    return res.status(500).json({ message: 'Erro do Servidor Interno' });
  }
};

const validateTelefones = (telefones) => {
  const regexNumero = /^\d{9}$/; // Número de telefone deve ter 9 dígitos
  const regexDDD = /^\d{2}$/; // DDD deve ter 2 dígitos
  for (const telefone of telefones) {
    if (!regexNumero.test(telefone.numero)) {
      return false;
    }
    if (!regexDDD.test(telefone.ddd)) {
      return false;
    }
  }
  return true;
};
