//const Pool = require("pg").Pool;

import poolconfig from 'pg';
const Pool = poolconfig.Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'groupomania',
});

export default pool;
