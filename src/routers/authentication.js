import express from 'express';

import { login, register } from '../controllers/authentication.js';

export const authentication = (router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
};
