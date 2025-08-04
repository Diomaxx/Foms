const express = require('express')
const router = express.Router()
const rolesController = require('../controllers/rolesController')

router.get('/', rolesController.obtenerRoles)
router.post('/', rolesController.crearRol)
router.get('/:id', rolesController.obtenerRolPorId)
router.put('/:id', rolesController.actualizarRol)
router.delete('/:id', rolesController.eliminarRol)

module.exports = router
