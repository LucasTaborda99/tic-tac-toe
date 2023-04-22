const request = require('supertest');
const app = require('../routes/players'); // Importando o arquivo do aplicativo que contém as rotas
const { Player } = require('../models/player'); // Importando a model Player
const bcrypt = require('bcrypt'); // Importando o bcrypt para comparar senhas

jest.mock('../models/player'); // Mockando a importação do módulo Player

jest.mock('../controllers/playersController', () => {
    return {
      createPlayer: jest.fn(),
    };
  });
  

// Teste para criar um novo jogador
describe('POST /api/players', () => {
  beforeAll(async () => {
    // Configuração inicial do teste, como criar conexão com banco de dados de teste, inserir dados de teste, etc.
    // Por exemplo, posso criar um banco de dados de teste usando um pacote como o sequelize-test-helpers
  });

  afterAll(async () => {
    // Limpeza após os testes, como fechar conexão com banco de dados de teste, apagar dados de teste, etc.
  });

  test('Deve criar um novo jogador com sucesso', async () => {
    // Arrange
    const player = {
      name: 'John Doe',
      nickname: 'johndoe',
      email: 'johndoe@example.com',
      password: 'mypassword'
    };

    // Mockando o comportamento da função estática create do modelo Player
    Player.create.mockResolvedValue(player);

    // Mockando o comportamento da função compareSync do bcrypt
    bcrypt.compareSync.mockReturnValue(true);

    // Act
    const response = await request(app)
      .post('/api/players')
      .send(player);

    // Assert
    expect(response.status).toBe(200); // Verifica se o status da resposta é 200 (OK)
    expect(response.body).toHaveProperty('message', 'Player criado com sucesso'); // Verifica se a mensagem de resposta é correta

    // Verifica se o jogador foi criado no banco de dados
    expect(Player.create).toHaveBeenCalledWith(player); // Verifica se a função create do modelo Player foi chamada com o objeto player
    expect(bcrypt.compareSync).toHaveBeenCalledWith(player.password, player.password); // Verifica se a função compareSync do bcrypt foi chamada com as senhas corretas
  });

  test('Deve retornar erro ao criar jogador com email ou nickname já existentes', async () => {
    // Arrange
    const player = {
      name: 'Jane Doe',
      nickname: 'janedoe',
      email: 'johndoe@example.com', // Use o mesmo email do jogador criado no teste anterior
      password: 'mypassword2'
    };

    // Mockando o comportamento da função estática findOne do modelo Player
    Player.findOne.mockResolvedValue(true);

    // Act
    const response = await request(app)
      .post('/api/players')
      .send(player);

    // Assert
    expect(response.status).toBe(500); // Verifica se o status da resposta é 500 (Erro Interno do Servidor)
    expect(response.body).toHaveProperty('message', 'Email ou nickname já existentes'); // Verifica se a mensagem de resposta é correta

    // Verifica se a função findOne do modelo Player foi chamada com o email correto
    expect(Player.findOne).toHaveBeenCalledWith({ where: { email: player.email } });
  });
});
