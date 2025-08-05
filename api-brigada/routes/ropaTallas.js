const express = require('express')
const router = express.Router()
const controller = require('../controllers/ropaTallasController')

router.get('/', controller.obtenerTodos)
router.post('/', controller.asignarTalla)
router.put('/:id_ropa/:id_talla', controller.actualizarCantidad)
router.delete('/:id_ropa/:id_talla', controller.eliminarTalla)

module.exports = router
