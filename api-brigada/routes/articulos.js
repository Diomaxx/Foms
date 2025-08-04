const express = require('express')
const router = express.Router()
const articulosController = require('../controllers/articulosController')

router.get('/', articulosController.obtenerArticulos)
router.post('/', articulosController.crearArticulo)
router.get('/:id', articulosController.obtenerArticuloPorId)
router.put('/:id', articulosController.actualizarArticulo)
router.delete('/:id', articulosController.eliminarArticulo)

module.exports = router
