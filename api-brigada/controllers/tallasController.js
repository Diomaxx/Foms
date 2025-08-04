const pool = require('../db')

exports.obtenerTallas = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tallas')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tallas' })
  }
}

exports.crearTalla = async (req, res) => {
  const { nombre } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO tallas (nombre) VALUES ($1) RETURNING *',
      [nombre]
    )
    res.status(201).json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear talla' })
  }
}

exports.obtenerTallaPorId = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query('SELECT * FROM tallas WHERE id = $1', [id])
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Talla no encontrada' })
    }
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener talla' })
  }
}

exports.actualizarTalla = async (req, res) => {
  const { id } = req.params
  const { nombre } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE tallas SET nombre=$1 WHERE id=$2 RETURNING *',
      [nombre, id]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar talla' })
  }
}

exports.eliminarTalla = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM tallas WHERE id=$1', [id])
    res.json({ mensaje: 'Talla eliminada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar talla' })
  }
}
