// Players - Controller 

// Importando a model Player
const { Player } = require('../models');

// Importando as bibliotecas
require('dotenv').config()

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

// Importando a biblioteca bcryptjs, para armazenar senhas como um hash no banco de dados
const bcrypt = require('bcryptjs');

// Importando o Sequelize
const { Sequelize } = require('sequelize');

// Seleciona as informações de um jogador por seu nickname
async function getPlayer(req, res) {
    try {
        const player = req.body;
        const result = await Player.findOne({
            where: { nickname: player.nickname }
        });

        if (!result) {
            return res.status(400).json({ message: 'Nickname não encontrado' });
        } else {
            return res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro ao buscar player' });
    }
}

// Seleciona as informações de todos os jogadores, ordenando pelo número do ID
async function readPlayers(req, res) {
    try {
        const players = await Player.findAll({
            order: [
                ['id', 'ASC']
            ]
        });

        if (players.length <= 0) {
            return res.status(400).json({ message: 'Nenhum player encontrado' });
        } else {
            return res.status(200).json(players);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao tentar buscar players' });
    }
}

// Cria um novo jogador, verificando se já existe email ou nickname cadastrado no banco de dados
async function createPlayer(req, res) {
    try {
        const player = req.body;
        const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
        const results = await Player.findAll({ 
            where: {
                [Sequelize.Op.or]: [
                    { email: player.email },
                    { nickname: player.nickname }
                ]
            }
        });

        if (results.length <= 0) {
            // Cria o hash da senha
            const hashedPassword = bcrypt.hashSync(player.password, 10); // O segundo parâmetro é o salt, que define o nível de complexidade do hash

            await Player.create({
                name: player.name,
                nickname: player.nickname,
                email: player.email,
                password: hashedPassword, // Salva o hash da senha no banco de dados
                status: 'user',
                createdAt: createdAt,
                updatedAt: createdAt
            });
            return res.status(200).json({ message: 'Player criado com sucesso' });
        } else {
            return res.status(500).json({ message: 'Email ou nickname já existentes' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao criar novo player' });
    }
}

// Atualiza um jogador de acordo com seu ID, verificando se já existe email ou nickname cadastrado em outro ID no banco de dados
async function updatePlayer(req, res) {
    try {
        const player = req.body;

        // Verifica se o email ou o nickname já existem em outros registros, exceto o próprio ID do jogador atual
        const existingPlayer = await Player.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email: player.email },
                    { nickname: player.nickname }
                ],
                id: { [Sequelize.Op.ne]: player.id }
            }
        });

        if (!existingPlayer) {

             // Gera o hash da nova senha
            const hashedPassword = bcrypt.hashSync(player.password, 10);

            // Atualiza o jogador no banco de dados
            const [affectedRows] = await Player.update(
                {
                    name: player.name,
                    nickname: player.nickname,
                    email: player.email,
                    password: hashedPassword
                },
                {
                    where: { id: player.id }
                }
            );

            if (affectedRows === 0) {
                return res.status(404).json({ message: 'ID não existente' });
            }

            return res.status(200).json({ message: 'Player atualizado com sucesso' });
        } else {
            return res.status(500).json({ message: 'Email ou nickname já existentes' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao atualizar player' });
    }
}

// Deleta um jogador de acordo com o nickname, verificando se o nickname existe no banco de dados
async function deletePlayer(req, res) {
    try {
        const player = req.body;

        // Deleta o jogador no banco de dados pelo nickname
        const affectedRows = await Player.destroy({
            where: {
                nickname: player.nickname
            }
        });

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Nickname não encontrado' });
        }

        return res.status(200).json({ message: 'Player deletado com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao deletar player' });
    }
}

module.exports = {
    getPlayer,
    readPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer
}