import pool from '../config/db';
import { Decimal } from 'decimal.js';

export interface Account {
    id: string;
    user_id: string;
    type: string;
    currency: string;
    status: string;
    created_at: Date;
    balance?: string;
}

export class AccountModel {
    static async create(userId: string, type: string, currency: string): Promise<Account> {
        const result = await pool.query(
            'INSERT INTO accounts (user_id, type, currency) VALUES ($1, $2, $3) RETURNING *',
            [userId, type, currency]
        );
        return result.rows[0];
    }

    static async findById(id: string): Promise<Account | null> {
        const result = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        return result.rows[0];
    }

    static async getBalance(accountId: string): Promise<string> {
        const result = await pool.query(
            `SELECT COALESCE(SUM(CASE WHEN direction = 'CREDIT' THEN amount ELSE -amount END), 0) as balance 
       FROM ledger_entries 
       WHERE account_id = $1`,
            [accountId]
        );
        // Use decimal.js to format consistently
        return new Decimal(result.rows[0].balance).toFixed(4);
    }

    static async getLedger(accountId: string): Promise<any[]> {
        const result = await pool.query(
            'SELECT * FROM ledger_entries WHERE account_id = $1 ORDER BY created_at DESC',
            [accountId]
        );
        return result.rows;
    }
}
