import express from 'express';
import lodash from 'lodash';
import { getUserBySessionToken } from '../db/users.js';
import { verifyJwtToken } from '../helpers/index.js';

const { merge } = lodash;

export const isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.identity._id;

    if (!currentUserId) {
      return res.sendStatus(400);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.sendStatus(403);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJwtToken(token);

    if (!decoded) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(token);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    req.identity = existingUser; // Atualiza o objeto de identidade

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
