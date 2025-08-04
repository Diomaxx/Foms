const pool = require('../db')

// CRUD básico para Voluntarios

exports.obtenerVoluntarios = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM voluntarios')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener voluntarios' })
  }
}

exports.crearVoluntario = async (req, res) => {
  const { codigo, nombre, ci, telefono, activo } = req.body
  try {
    const resultado = await pool.query(
      `INSERT INTO voluntarios (codigo, nombre, ci, telefono, activo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [codigo, nombre, ci, telefono, activo ?? true]
    )
    res.status(201).json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear voluntario' })
  }
}

exports.obtenerVoluntarioPorId = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query('SELECT * FROM voluntarios WHERE id = $1', [id])
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Voluntario no encontrado' })
    }
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener voluntario' })
  }
}

exports.actualizarVoluntario = async (req, res) => {
  const { id } = req.params
  const { codigo, nombre, ci, telefono, activo } = req.body
  try {
    const resultado = await pool.query(
      `UPDATE voluntarios SET codigo=$1, nombre=$2, ci=$3, telefono=$4, activo=$5
       WHERE id=$6 RETURNING *`,
      [codigo, nombre, ci, telefono, activo, id]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar voluntario' })
  }
}

exports.eliminarVoluntario = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM voluntarios WHERE id=$1', [id])
    res.json({ mensaje: 'Voluntario eliminado' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar voluntario' })
  }
}
