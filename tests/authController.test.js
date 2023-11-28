const authController = require("../src/controllers/authController");

test("getUser retorna Usuário não encontrado", () => {
  const req = {
    headers: {
      authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMDdjOTY2My05MTM4LTRmODQtODA5NS03MjE5YzJmMTBkNmIiLCJpYXQiOjE3MDExMzIxOTMsImV4cCI6MTcwMTEzNTc5M30.ZobXgqWHubuE35kJMd3m9eKA-HmM8LCLvwEEh85J3eA",
    },
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  authController.getUser(req, res);

  expect(res.json).toHaveBeenCalledWith({ mensagem: "Sessão inválida" });
});

test("getUser retorna usuário corretamente", () => {
  const req = {
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMDdjOTY2My05MTM4LTRmODQtODA5NS03MjE9YzJmMTBkNmIiLCJpYXQiOjE3MDExMzIxOTMsImV4cCI6MTcwMTEzNTc5M30.sGn_KX3h5D7sh2oBxMwF4OHoI6D2Houy7q8v7At4Jys",
    },
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  const usuarioEncontrado = {
    id: "c07c9663-9138-4f84-8095-7219c2f10d6b",
    nome: "Anderson",
    email: "andersonfae@hotmail.com",
    senha: "123123",
    telefones: [{ numero: "971309732", ddd: "21" }],
  };

  authController.users = authController.users || {};

  const mockUsersFind = jest.fn();
  authController.users.find = mockUsersFind;

  mockUsersFind.mockReturnValue(usuarioEncontrado);

  authController.getUser(req, res);

  expect(res.json).toHaveBeenCalledWith({
    mensagem: "Não autorizado",
  });
});

test("signUp voltando dados", () => {
  const req = {
    body: {
      nome: "Anderson",
      email: "andersonfae@hotmail.com",
      senha: "123123",
      telefones: [{ numero: "971309732", ddd: "21" }],
    },
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  authController.signUp(req, res);

  expect(res.json).toHaveBeenCalledWith({
    id: expect.any(String),
    data_criacao: expect.any(Date),
    data_atualizacao: expect.any(Date),
    ultimo_login: null,
    token: expect.any(String),
  });
});

test("signIn", () => {
  const users = [
    {
      id: "c07c9663-9138-4f84-8095-7219c2f10d6b",
      nome: "Anderson",
      email: "andersonfae@hotmail.com",
      senha: "$2b$10$Q2b9rKj7gycKhSR6HwTLZ.K5pPf5G8Rd2W5bqfyvfcYDmVb5HQKGm",
    },
  ];

  const req = {
    body: {
      email: "andersonfae@hotmail.com",
      senha: "123123",
    },
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  authController.users = users;

  authController.signIn(req, res);

  expect(res.json).toHaveBeenCalledWith({
    mensagem: "Usuário e/ou senha inválidos",
  });
});
