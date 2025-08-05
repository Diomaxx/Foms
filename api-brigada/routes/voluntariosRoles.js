const express = require('express')
const router = express.Router()
const controller = require('../controllers/voluntariosRolesController')

router.get('/', controller.obtenerTodos)
router.post('/', controller.asignarRol)
router.delete('/:id_voluntario/:id_rol', controller.eliminarRol)

module.exports = router
