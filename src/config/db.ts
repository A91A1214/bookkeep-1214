import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
});

export const initDb = async () => {
    try {
        const client = await pool.connect();
        try {
            const schemaPath = path.join(__dirname, '../../schema.sql');
            if (fs.existsSync(schemaPath)) {
                const schemaSql = fs.readFileSync(schemaPath, 'utf8');
                await client.query(schemaSql);
                console.log('Database schema initialization successful.');
            }
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Database initialization failed:', err);
    }
};

export default pool;
