const express = require('express')
const router = express.Router()
const refaccionesController = require('../controllers/refaccionesController')

router.get('/', refaccionesController.obtenerRefacciones)
router.post('/', refaccionesController.crearRefaccion)
router.get('/:id', refaccionesController.obtenerRefaccionPorId)
router.put('/:id', refaccionesController.actualizarRefaccion)
router.delete('/:id', refaccionesController.eliminarRefaccion)

module.exports = router
