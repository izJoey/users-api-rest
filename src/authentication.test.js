import { authentication } from '../src/helpers/index.js';

test('A função de autenticação funciona corretamente', () => {
  const salt = 'randomSalt';
  const password = 'userPassword';
  const hashedPassword = authentication(salt, password);

  expect(hashedPassword).toEqual(/* o valor esperado */);
});
