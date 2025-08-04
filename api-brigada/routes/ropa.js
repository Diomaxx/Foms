const express = require('express')
const router = express.Router()
const ropaController = require('../controllers/ropaController')

router.get('/', ropaController.obtenerRopa)
router.post('/', ropaController.crearRopa)
router.get('/:id', ropaController.obtenerRopaPorId)
router.put('/:id', ropaController.actualizarRopa)
router.delete('/:id', ropaController.eliminarRopa)

module.exports = router
