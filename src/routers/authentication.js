// Importe a função isAuthenticated
import { login, register, isAuthenticated } from '../controllers/authentication.js';

export const authentication = (router) => {
  router.post('/auth/register', register);
  router.post('/auth/login', login);
  router.get('/auth/users', isAuthenticated, (req, res) => {
    // A lógica para obter todos os usuários deve ser adicionada aqui
    // Aqui está um exemplo simples para fins de demonstração
    res.json({ message: 'User list accessed successfully!' });
  });
};
