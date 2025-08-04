const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Importar rutas
const voluntariosRoutes = require('./routes/voluntarios')
const rolesRoutes = require('./routes/roles')
const brigadasRoutes = require('./routes/brigadas')
const refaccionesRoutes = require('./routes/refacciones')
const ropaRoutes = require('./routes/ropa')
const tallasRoutes = require('./routes/tallas')

app.use('/api/voluntarios', voluntariosRoutes)
app.use('/api/roles', rolesRoutes)
app.use('/api/brigadas', brigadasRoutes)
app.use('/api/refacciones', refaccionesRoutes)
app.use('/api/ropa', ropaRoutes)
app.use('/api/tallas', tallasRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
