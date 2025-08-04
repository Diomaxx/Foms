const express = require('express')
const router = express.Router()
const brigadasController = require('../controllers/brigadasController')

router.get('/', brigadasController.obtenerBrigadas)
router.post('/', brigadasController.crearBrigada)
router.get('/:id', brigadasController.obtenerBrigadaPorId)
router.put('/:id', brigadasController.actualizarBrigada)
router.delete('/:id', brigadasController.eliminarBrigada)

module.exports = router
