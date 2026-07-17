import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fluideka_lms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Pool de conexiones
let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Helper para ejecutar queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T[];
  } finally {
    connection.release();
  }
}

// Helper para ejecutar una query y obtener un solo resultado
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}
