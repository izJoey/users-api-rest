import { login, register, isAuthenticated } from '../controllers/authentication.js';

export const authentication = (router) => {
  router.post('/auth/register', register);
  router.post('/auth/login', login);
  router.get('/auth/users', isAuthenticated, (req, res) => {
    res.json({ mensagem: 'Lista de usuários acessada com sucesso!' });
  });
};
