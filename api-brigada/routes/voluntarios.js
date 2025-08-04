const express = require('express')
const router = express.Router()
const voluntariosController = require('../controllers/voluntariosController')

router.get('/', voluntariosController.obtenerVoluntarios)
router.post('/', voluntariosController.crearVoluntario)
router.get('/:id', voluntariosController.obtenerVoluntarioPorId)
router.put('/:id', voluntariosController.actualizarVoluntario)
router.delete('/:id', voluntariosController.eliminarVoluntario)

module.exports = router
