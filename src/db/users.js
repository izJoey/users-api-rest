import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    jwtToken: { type: String, select: false },
  },
  telefones: [
    {
      numero: { type: Number, required: true },
      ddd: { type: Number, required: true },
    },
  ],
  data_criacao: {
    type: Date,
    default: Date.now(),
  },
  data_atualizacao: {
    type: Date,
    default: Date.now(),
  },
  ultimo_login: {
    type: Date,
    default: null,
  },
});

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email) => UserModel.findOne({ email });
export const getUserBySessionToken = (jwtToken) =>
  UserModel.findOne({
    'authentication.jwtToken': jwtToken,
  });
export const getUserById = (id) => UserModel.findById(id);
export const createUser = async (values) => {
  const user = new UserModel(values);
  return user.save();
};
export const deleteUserById = (id) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id, values) => UserModel.findByIdAndUpdate(id, values);
