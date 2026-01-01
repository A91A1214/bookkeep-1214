import pool from '../config/db';
import { Decimal } from 'decimal.js';

export class TransactionService {
    /**
     * Executes a transfer between two internal accounts.
     * Enforces double-entry bookkeeping, ACID atomicity, and balance integrity.
     */
    static async transfer(sourceId: string, destId: string, amount: string, description: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const transferAmount = new Decimal(amount);
            if (transferAmount.lte(0)) throw new Error('Amount must be positive');

            // 1. Lock accounts in consistent order to prevent deadlocks
            const accounts = [sourceId, destId].sort();
            for (const id of accounts) {
                const res = await client.query('SELECT id FROM accounts WHERE id = $1 FOR UPDATE', [id]);
                if (res.rowCount === 0) throw new Error(`Account ${id} not found`);
            }

            // 2. Create the Transaction record
            const transRes = await client.query(
                `INSERT INTO transactions (amount, currency, type, status, source_account_id, destination_account_id, description) 
                 VALUES ($1, 'USD', 'transfer', 'pending', $2, $3, $4) RETURNING id`,
                [transferAmount.toString(), sourceId, destId, description]
            );
            const transactionId = transRes.rows[0].id;

            // 3. Double-Entry Bookkeeping
            // Debit Source (- amount)
            await client.query(
                `INSERT INTO ledger_entries (transaction_id, account_id, amount, direction)
                 VALUES ($1, $2, $3, 'DEBIT')`,
                [transactionId, sourceId, transferAmount.toString()]
            );

            // Credit Destination (+ amount)
            await client.query(
                `INSERT INTO ledger_entries (transaction_id, account_id, amount, direction)
                 VALUES ($1, $2, $3, 'CREDIT')`,
                [transactionId, destId, transferAmount.toString()]
            );

            // 4. Enforce Balance Integrity (Check Source)
            const balRes = await client.query(
                `SELECT COALESCE(SUM(CASE WHEN direction = 'CREDIT' THEN amount ELSE -amount END), 0) as balance 
                 FROM ledger_entries 
                 WHERE account_id = $1`,
                [sourceId]
            );
            const currentBalance = new Decimal(balRes.rows[0].balance);
            if (currentBalance.lt(0)) throw new Error('Insufficient funds');

            // 5. Success - Set status to completed and commit
            await client.query('UPDATE transactions SET status = \'completed\' WHERE id = $1', [transactionId]);
            await client.query('COMMIT');

            return { transactionId, status: 'completed' };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    static async deposit(accountId: string, amount: string, description: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const depAmount = new Decimal(amount);
            if (depAmount.lte(0)) throw new Error('Amount must be positive');

            // Lock account
            const accRes = await client.query('SELECT id FROM accounts WHERE id = $1 FOR UPDATE', [accountId]);
            if (accRes.rowCount === 0) throw new Error('Account not found');

            const transRes = await client.query(
                `INSERT INTO transactions (amount, currency, type, status, destination_account_id, description) 
                 VALUES ($1, 'USD', 'deposit', 'pending', $2, $3) RETURNING id`,
                [depAmount.toString(), accountId, description]
            );
            const transactionId = transRes.rows[0].id;

            // Credit Account (Double entry from "External" source, but for simplicity here we just credit the account)
            await client.query(
                `INSERT INTO ledger_entries (transaction_id, account_id, amount, direction)
                 VALUES ($1, $2, $3, 'CREDIT')`,
                [transactionId, accountId, depAmount.toString()]
            );

            await client.query('UPDATE transactions SET status = \'completed\' WHERE id = $1', [transactionId]);
            await client.query('COMMIT');

            return { transactionId, status: 'completed' };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    static async withdraw(accountId: string, amount: string, description: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const withAmount = new Decimal(amount);
            if (withAmount.lte(0)) throw new Error('Amount must be positive');

            // Lock account
            const accRes = await client.query('SELECT id FROM accounts WHERE id = $1 FOR UPDATE', [accountId]);
            if (accRes.rowCount === 0) throw new Error('Account not found');

            const transRes = await client.query(
                `INSERT INTO transactions (amount, currency, type, status, source_account_id, description) 
                 VALUES ($1, 'USD', 'withdrawal', 'pending', $2, $3) RETURNING id`,
                [withAmount.toString(), accountId, description]
            );
            const transactionId = transRes.rows[0].id;

            // Debit Account
            await client.query(
                `INSERT INTO ledger_entries (transaction_id, account_id, amount, direction)
                 VALUES ($1, $2, $3, 'DEBIT')`,
                [transactionId, accountId, withAmount.toString()]
            );

            // Check Balance
            const balRes = await client.query(
                `SELECT COALESCE(SUM(CASE WHEN direction = 'CREDIT' THEN amount ELSE -amount END), 0) as balance 
                 FROM ledger_entries 
                 WHERE account_id = $1`,
                [accountId]
            );
            const currentBalance = new Decimal(balRes.rows[0].balance);
            if (currentBalance.lt(0)) throw new Error('Insufficient funds');

            await client.query('UPDATE transactions SET status = \'completed\' WHERE id = $1', [transactionId]);
            await client.query('COMMIT');

            return { transactionId, status: 'completed' };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}
