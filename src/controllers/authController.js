// src/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const users = [];

const generateToken = (userId) => {
  return jwt.sign({ userId }, "seuSegredo", { expiresIn: "1h" });
};

const signUp = (req, res) => {
  const { nome, email, senha, telefones } = req.body;

  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ mensagem: "E-mail já existente" });
  }

  const newUser = new User({
    nome,
    email,
    senha: bcrypt.hashSync(senha, 10),
    telefones,
  });

  users.push(newUser);

  res.json({
    id: newUser.id,
    data_criacao: newUser.data_criacao,
    data_atualizacao: newUser.data_atualizacao,
    ultimo_login: newUser.ultimo_login,
    token: generateToken(newUser.id),
  });
};

const signIn = (req, res) => {
  const { email, senha } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(senha, user.senha)) {
    return res.status(401).json({ mensagem: "Usuário e/ou senha inválidos" });
  }

  user.ultimo_login = new Date();

  res.json({
    id: user.id,
    data_criacao: user.data_criacao,
    data_atualizacao: user.data_atualizacao,
    ultimo_login: user.ultimo_login,
    token: generateToken(user.id),
  });
};

const getUser = (req, res) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");
    console.log("Token recebido:", token);

    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    const decoded = jwt.verify(token, "seuSegredo");
    console.log("Token decodificado:", decoded);

    const user = users.find((u) => u.id === decoded.userId);
    console.log("Usuário encontrado:", user);

    if (!user) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro na verificação do token:", error);

    if (error.name === "TokenExpiredError") {
      res.status(401).json({ mensagem: "Sessão inválida" });
    } else {
      res.status(401).json({ mensagem: "Não autorizado" });
    }
  }
};

module.exports = {
  signUp,
  signIn,
  getUser,
};
