import express from 'express';

import lodash from 'lodash';

import { getUserBySessionToken } from '../db/users.js';
import { verifyJwtToken } from '../helpers/index.js';

const { get, merge } = lodash;

export const isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id');

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
    //const sessionToken = req.cookies['JOEY-AUTH'];
    //const sessionToken = req.headers.authorization;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.sendStatus(403);
    }
    // if (!sessionToken) {
    //   return res.sendStatus(403);
    // }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJwtToken(token);
    //const user = await getUserBySessionToken(token);

    if (!decoded) {
      return res.sendStatus(403);
    }

    //const existingUser = await getUserBySessionToken(sessionToken)
    const existingUser = await getUserBySessionToken(decoded._id);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
