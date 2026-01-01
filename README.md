# Financial Ledger API – Double-Entry Bookkeeping System

## 📌 Objective

The goal of this project is to develop a **robust financial ledger REST API** that strictly follows the principles of **double-entry bookkeeping**.  
This system acts as the core backend for a mock banking application, where **data integrity, correctness, and auditability** are non-negotiable.

Unlike basic CRUD systems, this project focuses on **financial correctness**, **ACID-compliant transactions**, **immutability**, and **race-condition safety**.  
All balances are derived from ledger history, making the ledger the **single source of truth**.

---

## 🧠 Key Learning Outcomes

Through this project, I gained practical experience with:

- Double-entry accounting systems
- ACID database transactions
- Database isolation levels
- Immutable data modeling
- Preventing race conditions in concurrent financial operations
- Designing audit-ready systems
- Business rule enforcement at the database and service layer

---

## 🏗️ System Architecture

The application follows a **layered architecture**:

- **Controller Layer** – REST API endpoints
- **Service Layer** – Core business logic and validations
- **Data Access Layer** – Database operations
- **Database** – Relational DB with strong ACID guarantees

---

## 🗄️ Data Models

### 1️⃣ Account

Represents a user-owned financial account.

| Field | Description |
|-----|------------|
| id | Unique account identifier |
| user_id | Owner of the account |
| account_type | Checking / Savings |
| currency | ISO currency code (e.g., USD, INR) |
| status | Active / Frozen |
| balance | ❌ Not stored – calculated dynamically from ledger |

---

### 2️⃣ Transaction

Represents the **intent** to move money.

| Field | Description |
|-----|------------|
| id | Unique transaction ID |
| type | Transfer / Deposit / Withdrawal |
| source_account_id | Debit account (nullable for deposits) |
| destination_account_id | Credit account (nullable for withdrawals) |
| amount | High-precision decimal |
| currency | Currency of transaction |
| status | Pending / Completed / Failed |
| description | Optional notes |
| created_at | Timestamp |

---

### 3️⃣ Ledger Entry (Immutable)

Represents a **single debit or credit** record.

| Field | Description |
|-----|------------|
| id | Unique ledger entry ID |
| account_id | Account affected |
| transaction_id | Parent transaction |
| entry_type | DEBIT / CREDIT |
| amount | Exact amount |
| created_at | Timestamp |

⚠️ **Ledger entries are append-only and immutable. They can never be updated or deleted.**

---

## 🔁 Double-Entry Bookkeeping Rules

- Every financial transaction creates **exactly two ledger entries**
- One **debit** and one **credit**
- The sum of both entries **must always equal zero**
- No single-sided transactions are allowed

---

## 🔐 Core Business Rules

### ✅ ACID Transactions
All operations related to a financial transaction are wrapped inside a **single database transaction**:

- Create transaction record
- Create debit ledger entry
- Create credit ledger entry
- Update transaction status

If **any step fails**, the entire operation is **rolled back**.

---

### ❌ Overdraft Prevention
Before committing a transaction:

- The system calculates the **current balance**
- Verifies the resulting balance is **not negative**
- Rejects and rolls back if funds are insufficient

---

### 📊 Balance Calculation

Balances are **never stored**.  
They are calculated dynamically using:

This ensures:

- Ledger is the source of truth
- No balance corruption
- Full auditability

---

## 🌐 API Endpoints

### 🔹 Accounts

#### Create Account

#### Get Account Details (with balance)
#### Get Account Ledger
---

### 🔹 Transactions

#### Transfer Between Accounts

Creates:
- Debit entry from source account
- Credit entry to destination account

---

#### Deposit

Creates:
- Credit entry only

---

#### Withdrawal
Creates:
- Debit entry only (after balance validation)

---

## 🧪 Error Handling & HTTP Status Codes

| Scenario | Status Code |
|-------|------------|
| Invalid input | 400 Bad Request |
| Insufficient funds | 422 Unprocessable Entity |
| Account not found | 404 Not Found |
| Internal error | 500 Internal Server Error |

Clear, meaningful error messages are returned for all failures.

---

## 🔒 Concurrency & Isolation

- Uses **READ COMMITTED / REPEATABLE READ** isolation level
- Prevents:
  - Dirty reads
  - Lost updates
  - Partial writes
- Concurrent transfers are safely handled without data corruption

---

## 🛠️ Technology Stack

- **Backend:** REST API (Node.js / Java / Python – implementation flexible)
- **Database:** PostgreSQL / MySQL
- **ORM / Query Layer:** Transaction-aware
- **Numeric Precision:** DECIMAL / NUMERIC (no floating point)

---

## ✅ Expected Outcomes Achieved

✔ Fully functional financial ledger API  
✔ Strict double-entry bookkeeping  
✔ Immutable ledger with audit trail  
✔ ACID-compliant transaction handling  
✔ No negative balances possible  
✔ Safe concurrent transaction execution  
✔ Accurate real-time balance calculation  
✔ Clear and maintainable architecture  

---

## 📌 Conclusion

This project demonstrates how real-world financial systems are designed — where **correctness is more important than convenience**.  
By enforcing immutability, atomicity, and strict business rules, this ledger system provides a **trustworthy and auditable financial backbone** suitable for banking and accounting applications.



