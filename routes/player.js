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

module.exports = router