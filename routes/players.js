// Rotas player - Todas as rotas dos players(jogadores) se encontram aqui

const express = require('express')
const router = express.Router()
const playersController = require('../controllers/playersController')

require('dotenv').config()

router.post('/getPlayer', playersController.getPlayer)
router.get('/readPlayers', playersController.readPlayers)
router.post('/createPlayer', playersController.createPlayer)
router.patch('/updatePlayer', playersController.updatePlayer)
router.delete('/deletePlayer', playersController.deletePlayer)

module.exports = router