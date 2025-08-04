const pool = require('../db')

// CRUD para brigadas

exports.obtenerBrigadas = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM brigadas')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener brigadas' })
  }
}

exports.crearBrigada = async (req, res) => {
  const { nombre, descripcion } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO brigadas (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    )
    res.status(201).json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear brigada' })
  }
}

exports.obtenerBrigadaPorId = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query('SELECT * FROM brigadas WHERE id = $1', [id])
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Brigada no encontrada' })
    }
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener brigada' })
  }
}

exports.actualizarBrigada = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE brigadas SET nombre=$1, descripcion=$2 WHERE id=$3 RETURNING *',
      [nombre, descripcion, id]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar brigada' })
  }
}

exports.eliminarBrigada = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM brigadas WHERE id=$1', [id])
    res.json({ mensaje: 'Brigada eliminada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar brigada' })
  }
}
