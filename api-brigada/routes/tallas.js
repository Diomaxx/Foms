const express = require('express')
const router = express.Router()
const tallasController = require('../controllers/tallasController')

router.get('/', tallasController.obtenerTallas)
router.post('/', tallasController.crearTalla)
router.get('/:id', tallasController.obtenerTallaPorId)
router.put('/:id', tallasController.actualizarTalla)
router.delete('/:id', tallasController.eliminarTalla)

module.exports = router
