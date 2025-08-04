const { Pool } = require('pg')

const pool = new Pool({
  host: '10.26.7.240',     
  user: 'admin',     
  password: 'admin123', 
  database: 'brigada', 
  port: 5440,             
})

module.exports = pool
