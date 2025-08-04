const pool = require('../db')

exports.obtenerRopa = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM ropa')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ropa' })
  }
}

exports.crearRopa = async (req, res) => {
  const { tipo, nombre } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO ropa (tipo, nombre) VALUES ($1, $2) RETURNING *',
      [tipo, nombre]
    )
    res.status(201).json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ropa' })
  }
}

exports.obtenerRopaPorId = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query('SELECT * FROM ropa WHERE id = $1', [id])
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Ropa no encontrada' })
    }
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ropa' })
  }
}

exports.actualizarRopa = async (req, res) => {
  const { id } = req.params
  const { tipo, nombre } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE ropa SET tipo=$1, nombre=$2 WHERE id=$3 RETURNING *',
      [tipo, nombre, id]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ropa' })
  }
}

exports.eliminarRopa = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM ropa WHERE id=$1', [id])
    res.json({ mensaje: 'Ropa eliminada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ropa' })
  }
}
