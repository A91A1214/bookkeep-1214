import { Account, AccountModel } from '../models/accountModel';

export class AccountService {
    static async create(userId: string, type: string, currency: string): Promise<Account> {
        return await AccountModel.create(userId, type, currency);
    }

    static async getAccountDetails(id: string): Promise<Account & { balance: string }> {
        const account = await AccountModel.findById(id);
        if (!account) throw new Error('Account not found');

        const balance = await AccountModel.getBalance(id);
        return { ...account, balance };
    }

    static async getLedger(id: string): Promise<any[]> {
        const account = await AccountModel.findById(id);
        if (!account) throw new Error('Account not found');

        return await AccountModel.getLedger(id);
    }
}
