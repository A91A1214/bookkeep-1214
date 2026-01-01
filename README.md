# Financial Ledger API

A robust financial ledger API implementing **Double-Entry Bookkeeping** with **ACID transactions**.

## Core Features
- **Double-Entry Ledger**: Every transfer generates balanced debit/credit entries.
- **ACID Atomicity**: Transactions are either fully committed or rolled back.
- **No Floating Point Errors**: Uses `decimal.js` for all financial calculations.
- **Concurrency Control**: Implements SQL row-level locking (`FOR UPDATE`) to prevent race conditions.
- **Immutable Audit Trail**: Ledger entries are append-only.

## Setup & Run

### Using Docker (Recommended)
1. Ensure Docker is installed.
2. Run:
   ```bash
   docker-compose up --build
   ```
3. The API will be available at `http://localhost:3000`.

### Local Setup
1. Copy `.env.example` to `.env`.
2. Configure your local PostgreSQL credentials.
3. Install dependencies: `npm install`
4. Run in dev mode: `npm run dev`

## API Reference

### Accounts
- `POST /accounts`: Create a new account.
- `GET /accounts/{id}`: Get details and calculated balance.
- `GET /accounts/{id}/ledger`: Get transaction history.

### Transactions
- `POST /deposits`: Add funds.
- `POST /withdrawals`: Remove funds (prevents negative balance).
- `POST /transfers`: Move money between internal accounts.

## Technical Details
### Data Integrity
Balances are never stored; they are calculated on-the-fly by summing ledger entries:
```sql
SELECT SUM(CASE WHEN direction = 'CREDIT' THEN amount ELSE -amount END) FROM ledger_entries;
```
### Concurrency
To handle simultaneous transfers, we lock account rows in a consistent sorted order:
```typescript
const accounts = [sourceId, destId].sort();
// ... SELECT FOR UPDATE on each ...
```
This guarantees that two requests won't deadlock or cause race conditions during balance verification.
