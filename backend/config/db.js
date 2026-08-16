const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    instanceName: 'SQLEXPRESS',
    encrypt: true,
    trustServerCertificate: true
  }
};

let pool;

async function conectarDB() {
  try {
    pool = await sql.connect(config);
    console.log('✅ Conectado a SQL Server');
    return pool;
  } catch (err) {
    console.error('❌ Error al conectar a SQL Server:', err);
  }
}

function getPool() {
  if (!pool) {
    throw new Error('La base de datos no está conectada todavía. Llama a conectarDB() primero.');
  }
  return pool;
}

module.exports = { conectarDB, getPool, sql };