const pool = require('../db')

exports.obtenerRoles = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM roles')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener roles' })
  }
}

exports.crearRol = async (req, res) => {
  const { nombre } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO roles (nombre) VALUES ($1) RETURNING *',
      [nombre]
    )
    res.status(201).json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear rol' })
  }
}

exports.obtenerRolPorId = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query('SELECT * FROM roles WHERE id = $1', [id])
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' })
    }
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rol' })
  }
}

exports.actualizarRol = async (req, res) => {
  const { id } = req.params
  const { nombre } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE roles SET nombre=$1 WHERE id=$2 RETURNING *',
      [nombre, id]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rol' })
  }
}

exports.eliminarRol = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM roles WHERE id=$1', [id])
    res.json({ mensaje: 'Rol eliminado' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar rol' })
  }
}
