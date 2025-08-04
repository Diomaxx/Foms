const pool = require('../db')

exports.asignarRol = async (req, res) => {
  const { id_voluntario, id_rol } = req.body
  try {
    await pool.query(
      'INSERT INTO voluntarios_roles (id_voluntario, id_rol) VALUES ($1, $2)',
      [id_voluntario, id_rol]
    )
    res.status(201).json({ mensaje: 'Rol asignado al voluntario' })
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar rol' })
  }
}

exports.eliminarRol = async (req, res) => {
  const { id_voluntario, id_rol } = req.params
  try {
    await pool.query(
      'DELETE FROM voluntarios_roles WHERE id_voluntario = $1 AND id_rol = $2',
      [id_voluntario, id_rol]
    )
    res.json({ mensaje: 'Rol eliminado del voluntario' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar rol' })
  }
}
