const pool = require('../db')

exports.asignarTalla = async (req, res) => {
  const { id_ropa, id_talla, cantidad } = req.body
  try {
    await pool.query(
      'INSERT INTO ropa_tallas (id_ropa, id_talla, cantidad) VALUES ($1, $2, $3)',
      [id_ropa, id_talla, cantidad]
    )
    res.status(201).json({ mensaje: 'Talla asignada a la prenda' })
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar talla' })
  }
}

exports.actualizarCantidad = async (req, res) => {
  const { id_ropa, id_talla } = req.params
  const { cantidad } = req.body
  try {
    await pool.query(
      'UPDATE ropa_tallas SET cantidad = $1 WHERE id_ropa = $2 AND id_talla = $3',
      [cantidad, id_ropa, id_talla]
    )
    res.json({ mensaje: 'Cantidad actualizada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cantidad' })
  }
}

exports.eliminarTalla = async (req, res) => {
  const { id_ropa, id_talla } = req.params
  try {
    await pool.query(
      'DELETE FROM ropa_tallas WHERE id_ropa = $1 AND id_talla = $2',
      [id_ropa, id_talla]
    )
    res.json({ mensaje: 'Talla eliminada de la prenda' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar talla' })
  }
}
