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
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.nome = nome;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedUser = await deleteUserById(id);

//     return res.json(deletedUser);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(400);
//   }
// };

// export const updateUser = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { nome } = req.body;

//     if (!nome) {
//       return res.sendStatus(400);
//     }

//     const user = await getUserById(id);

//     user.nome = nome;
//     await user.save();

//     return res.status(200).json(user).end();
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(400);
//   }
// };
