const pool = require('../db')

// Obtener todos los artículos
exports.obtenerArticulos = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM articulos')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener artículos' })
  }
}

// Crear nuevo artículo
exports.crearArticulo = async (req, res) => {
  const { nombre, categoria, observaciones, cantidad } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO articulos (nombre, categoria, observaciones, cantidad) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, categoria, observaciones, cantidad]
    )
    res.status(201).json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear artículo' })
  }
}

// Obtener artículo por ID
exports.obtenerArticuloPorId = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query('SELECT * FROM articulos WHERE id = $1', [id])
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Artículo no encontrado' })
    }
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener artículo' })
  }
}

// Actualizar artículo
exports.actualizarArticulo = async (req, res) => {
  const { id } = req.params
  const { nombre, categoria, observaciones, cantidad } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE articulos SET nombre=$1, categoria=$2, observaciones=$3, cantidad=$4 WHERE id=$5 RETURNING *',
      [nombre, categoria, observaciones, cantidad, id]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar artículo' })
  }
}

// Eliminar artículo
exports.eliminarArticulo = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM articulos WHERE id=$1', [id])
    res.json({ mensaje: 'Artículo eliminado' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar artículo' })
  }
}
