const { response } = require('express')
const express = require('express')
const connection = require('../connection')
const router = express.Router()
require('dotenv').config()

router.post('/getPlayer', (req, res) => {
    const player = req.body
    let query = 'SELECT * FROM players WHERE nickname = ?'
    connection.query(query, [player.nickname], (err, results) => {
        if(!err) {
            if(results.length <= 0) {
                return res.status(400).json({message: 'Nickname não encontrado'})
            } else {
                return res.status(200).json(results[0])
            }
        } else {
            return res.status(500).json({message: 'Erro ao tentar buscar player'})
        }
    })
})

router.get('/readPlayers', (req, res) => {
    const player = req.body
    let query = 'SELECT * FROM players ORDER BY id'
    connection.query(query, (err, results) => {
        if(!err) {
            if(results.length <= 0) {
                return res.status(400).json({message: 'Nenhum player encontrado'})
            } else {
                return res.status(200).json(results)
            }
        } else {
            return res.status(500).json({message: 'Erro ao tentar buscar players'})
        }
    } )
})

router.post('/createPlayer', (req, res) => {
    const player = req.body
    let query = 'SELECT email, nickname FROM players WHERE email = ? OR nickname = ?'
    connection.query(query, [player.email, player.nickname], (err, results) => {
        if(!err) {
            if(results.length <= 0) {
                let query = 'INSERT INTO players (name, nickname, email, password, status) VALUES (?, ?, ?, ?, "user")'
                connection.query(query, [player.name, player.nickname, player.email, player.password], (err, results) => {
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

router.patch('/updatePlayer', (req, res) => {
    const player = req.body
    let query = 'SELECT email, nickname FROM players WHERE (email = ? OR nickname = ?) AND id != ?'
    connection.query(query, [player.email, player.nickname, player.id], (err, results) => {
        if(!err) {
            if(results.length <= 0) {
                query = 'UPDATE players SET name = ?, nickname = ?, email = ?, password = ? WHERE id = ?'
                connection.query(query, [player.name, player.nickname, player.email, player.password, player.id], (err, results) => {
                    if(!err) {
                        if(results.affectedRows == 0) {
                            return res.status(404).json({message: 'ID não existente'})
                        }
                        return res.status(200).json({message: 'Player atualizado com sucesso'})
                    } else {
                        return res.status(500).json(err)
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

router.delete('/deletePlayer', (req, res) => {
    const player = req.body
    let query = 'DELETE FROM players WHERE nickname = ?'
    connection.query(query, [player.nickname], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: 'Nickname não encontrado'})
            }
            return res.status(200).json({message: 'Player deletado com sucesso'})
        } else {
            return res.status(500).json({message: 'Ops! Algo deu errado. Por favor, tente novamente mais tarde'})
        }
    })
})

module.exports = router