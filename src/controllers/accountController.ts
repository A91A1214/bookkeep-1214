import { Request, Response } from 'express';
import { AccountService } from '../services/accountService';
import { isValidUUID } from '../utils/validation';

export const createAccount = async (req: Request, res: Response) => {
    try {
        const { user_id, type, currency } = req.body;
        if (!user_id || !type || !currency) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (currency.length !== 3) {
            return res.status(400).json({ error: 'Invalid currency code' });
        }
        const account = await AccountService.create(user_id, type, currency);
        res.status(201).json(account);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) return res.status(400).json({ error: 'Invalid account ID' });

        const account = await AccountService.getAccountDetails(id);
        res.status(200).json(account);
    } catch (err: any) {
        if (err.message === 'Account not found') {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};

export const getLedger = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) return res.status(400).json({ error: 'Invalid account ID' });

        const ledger = await AccountService.getLedger(id);
        res.status(200).json(ledger);
    } catch (err: any) {
        if (err.message === 'Account not found') {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};
