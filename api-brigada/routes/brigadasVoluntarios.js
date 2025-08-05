const express = require('express')
const router = express.Router()
const controller = require('../controllers/brigadasVoluntariosController')

router.get('/', controller.obtenerTodos)
router.post('/', controller.asignarVoluntario)
router.delete('/:id_brigada/:id_voluntario', controller.eliminarVoluntario)

module.exports = router
