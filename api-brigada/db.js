const { Pool } = require('pg')

const pool = new Pool({
  host: '34.44.39.16',     
  user: 'admin',     
  password: 'admin123', 
  database: 'brigada', 
  port: 5440,             
})

module.exports = pool
