const pool = require('../db')

exports.obtenerRefacciones = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM refacciones')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener refacciones' })
  }
}

exports.crearRefaccion = async (req, res) => {
  const { nombre, categoria, observaciones, costo_aproximado } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO refacciones (nombre, categoria, observaciones, costo_aproximado) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, categoria, observaciones, costo_aproximado]
    )
    res.status(201).json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear refacción' })
  }
}

exports.obtenerRefaccionPorId = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query('SELECT * FROM refacciones WHERE id = $1', [id])
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Refacción no encontrada' })
    }
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener refacción' })
  }
}

exports.actualizarRefaccion = async (req, res) => {
  const { id } = req.params
  const { nombre, categoria, observaciones, costo_aproximado } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE refacciones SET nombre=$1, categoria=$2, observaciones=$3, costo_aproximado=$4 WHERE id=$5 RETURNING *',
      [nombre, categoria, observaciones, costo_aproximado, id]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar refacción' })
  }
}

exports.eliminarRefaccion = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM refacciones WHERE id=$1', [id])
    res.json({ mensaje: 'Refacción eliminada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar refacción' })
  }
}
