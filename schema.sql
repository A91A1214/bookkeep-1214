CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'checking', 'savings'
    currency VARCHAR(3) NOT NULL, -- e.g., 'USD'
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(19, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'transfer', 'deposit', 'withdrawal'
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed'
    source_account_id UUID REFERENCES accounts(id),
    destination_account_id UUID REFERENCES accounts(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    account_id UUID NOT NULL REFERENCES accounts(id),
    amount DECIMAL(19, 4) NOT NULL, -- Always positive
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('DEBIT', 'CREDIT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_ledger_account ON ledger_entries(account_id);
CREATE INDEX IF NOT EXISTS idx_ledger_transaction ON ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);
