import { Request, Response } from 'express';
import { TransactionService } from '../services/transactionService';
import { isValidUUID, isValidAmount } from '../utils/validation';

export const transfer = async (req: Request, res: Response) => {
    try {
        const { sourceId, destId, amount, description } = req.body;
        if (!sourceId || !destId || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!isValidUUID(sourceId) || !isValidUUID(destId)) {
            return res.status(400).json({ error: 'Invalid account ID(s)' });
        }
        if (!isValidAmount(amount)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const result = await TransactionService.transfer(sourceId, destId, amount, description || 'Transfer');
        res.status(200).json(result);
    } catch (err: any) {
        if (err.message === 'Insufficient funds') {
            res.status(422).json({ error: err.message });
        } else if (err.message.includes('not found')) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(400).json({ error: err.message });
        }
    }
};

export const deposit = async (req: Request, res: Response) => {
    try {
        const { accountId, amount, description } = req.body;
        if (!accountId || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!isValidUUID(accountId)) {
            return res.status(400).json({ error: 'Invalid account ID' });
        }
        if (!isValidAmount(amount)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const result = await TransactionService.deposit(accountId, amount, description || 'Deposit');
        res.status(200).json(result);
    } catch (err: any) {
        if (err.message.includes('not found')) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(400).json({ error: err.message });
        }
    }
};

export const withdraw = async (req: Request, res: Response) => {
    try {
        const { accountId, amount, description } = req.body;
        if (!accountId || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!isValidUUID(accountId)) {
            return res.status(400).json({ error: 'Invalid account ID' });
        }
        if (!isValidAmount(amount)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const result = await TransactionService.withdraw(accountId, amount, description || 'Withdrawal');
        res.status(200).json(result);
    } catch (err: any) {
        if (err.message === 'Insufficient funds') {
            res.status(422).json({ error: err.message });
        } else if (err.message.includes('not found')) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(400).json({ error: err.message });
        }
    }
};
