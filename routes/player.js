const { response } = require('express')
const express = require('express')
const connection = require('../connection')
const router = express.Router()
require('dotenv').config()

router.post('/readPlayer', (req, res) => {
    const player = req.body
    let query = 'SELECT * FROM players WHERE nickname = ? and password = ?'
    connection.query(query, [player.nickname, player.password], (err, results) => {
        if(!err) {
            if(results.length <= 0) {
                return res.status(400).json({message: 'Nickname ou password incorreto'})
            } else {
                return res.status(200).json(results[0])
            }
        } else {
            return res.status(500).json({message: 'Erro ao tentar buscar player'})
        }
    })
})

router.get('/getPlayers', (req, res) => {
    const player = req.body
    let query = 'SELECT * FROM players'
    connection.query(query, (err, results) => {
        if(!err) {
            if(results.length <= 0) {
                return res.status(400).json({message: 'Nenhum player encontrado'})
            } else {
                return res.status(200).json(results[0])
            }
        } else {
            return res.status(500).json({message: 'Erro ao tentar buscar players'})
        }
    } )
})

router.post('/createPlayer', (req, res) => {
    const player = req.body
    query = 'SELECT email, nickname FROM players'
    connection.query(query, [player.email, player.nickname], (err, results) => {
        if(!err) {
            if(results.length <= 0) {
                let query = 'INSERT INTO players (name, nickname, email, password, status) VALUES (?, ?, ?, ?, "user")'
                connection.query(query, [player.name, player.nickname,player.email, player.password], (err, results) => {
                    if(!err) {
                        return res.status(200).json({message: 'Player criado com sucesso'})
                    } else {
                        return res.status(500).json({message: 'Erro ao criar novo player'})
                    }
                })
            } else {
                return res.status(500).json({message: 'Email ou nickname já existentes'})
            }
        } else {
            return res.status(500).json({message: 'Ops! Algo deu errado. Por favor, tente novamente mais tarde'})
        }
    })
})

module.exports = router