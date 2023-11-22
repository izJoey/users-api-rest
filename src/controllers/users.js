import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../db/users.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    return res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ mensagem: 'Nome de usuário é obrigatório' });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    user.nome = nome;
    user.data_atualizacao = new Date();
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};
