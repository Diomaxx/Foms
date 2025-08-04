const pool = require('../db')

exports.asignarVoluntario = async (req, res) => {
  const { id_brigada, id_voluntario } = req.body
  try {
    await pool.query(
      'INSERT INTO brigadas_voluntarios (id_brigada, id_voluntario) VALUES ($1, $2)',
      [id_brigada, id_voluntario]
    )
    res.status(201).json({ mensaje: 'Voluntario asignado a la brigada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar voluntario' })
  }
}

exports.eliminarVoluntario = async (req, res) => {
  const { id_brigada, id_voluntario } = req.params
  try {
    await pool.query(
      'DELETE FROM brigadas_voluntarios WHERE id_brigada = $1 AND id_voluntario = $2',
      [id_brigada, id_voluntario]
    )
    res.json({ mensaje: 'Voluntario eliminado de la brigada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar voluntario' })
  }
}
