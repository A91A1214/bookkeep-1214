# 💰 Financial Ledger API  
### Double-Entry Bookkeeping System

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Database](https://img.shields.io/badge/database-PostgreSQL%20%7C%20MySQL-blue)
![API](https://img.shields.io/badge/API-RESTful-orange)
![Transactions](https://img.shields.io/badge/ACID-Compliant-success)
![Ledger](https://img.shields.io/badge/Ledger-Immutable-important)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 📌 Overview

This project is a **robust financial ledger REST API** built using the principles of **double-entry bookkeeping**.  
It serves as the core backend for a mock banking system where **data integrity, correctness, and auditability** are critical.

Unlike traditional CRUD-based applications, this system ensures:
- **Balances are never stored**
- **Ledger history is the single source of truth**
- **Every financial operation is atomic and verifiable**

---

## 🎯 Objective

To design and implement a backend system capable of **reliably tracking financial transactions between accounts**, enforcing strict accounting rules while remaining safe under concurrent usage.

This project emphasizes:
- ACID database transactions
- Immutable data modeling
- Business rule enforcement
- Correctness over convenience

---

## 🧠 Key Concepts Implemented

- ✅ Double-entry bookkeeping
- ✅ ACID-compliant transactions
- ✅ Database isolation levels
- ✅ Immutable ledger design
- ✅ Overdraft prevention
- ✅ Concurrent transaction safety
- ✅ Audit-ready transaction history

---

## 🏗️ Architecture

The application follows a **clean layered architecture**:


- **Controller Layer** – Exposes REST endpoints
- **Service Layer** – Orchestrates business logic
- **Data Layer** – Handles transactional database operations
- **Database** – Relational DB with strong ACID guarantees

---

## 🗄️ Data Models

### 🧾 Account

| Field | Description |
|-----|------------|
| id | Unique account identifier |
| user_id | Account owner |
| account_type | Checking / Savings |
| currency | ISO currency code |
| status | Active / Frozen |
| balance | ❌ Not stored (calculated dynamically) |

---

### 🔁 Transaction

Represents the **intent** to move money.

| Field | Description |
|-----|------------|
| id | Unique transaction ID |
| type | Transfer / Deposit / Withdrawal |
| source_account_id | Debit account |
| destination_account_id | Credit account |
| amount | High-precision decimal |
| currency | Transaction currency |
| status | Pending / Completed / Failed |
| description | Optional notes |

---

### 📒 Ledger Entry (Immutable)

| Field | Description |
|-----|------------|
| id | Ledger entry ID |
| account_id | Affected account |
| transaction_id | Parent transaction |
| entry_type | DEBIT / CREDIT |
| amount | Exact amount |
| timestamp | Creation time |

⚠️ **Ledger entries are append-only and cannot be modified or deleted.**

---

## 🔁 Double-Entry Rules

- Every transaction produces **exactly two ledger entries**
- One debit and one credit
- Total amount across entries **must equal zero**
- Ensures full accounting consistency

---

## 🔐 Core Business Rules

### 🧱 ACID Transactions
All operations for a transaction execute inside a **single database transaction**:

- Create transaction record
- Create debit ledger entry
- Create credit ledger entry
- Update transaction status

Failure at any step triggers a **rollback**.

---

### 🚫 Overdraft Prevention
Before committing:
- The system calculates the current balance
- Ensures the resulting balance is not negative
- Rejects and rolls back if insufficient funds

---

### 📊 Balance Calculation
Balances are derived dynamically:


✔ Always consistent  
✔ Fully auditable  
✔ No data corruption risk  

---

## 🌐 API Endpoints

### 🏦 Accounts

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /accounts | Create new account |
| GET | /accounts/{id} | Get account details + balance |
| GET | /accounts/{id}/ledger | Fetch ledger history |

---

### 💸 Transactions

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /transfers | Transfer between accounts |
| POST | /deposits | Deposit funds |
| POST | /withdrawals | Withdraw funds |

---

## ⚠️ Error Handling

| Scenario | HTTP Status |
|-------|------------|
| Invalid input | 400 Bad Request |
| Insufficient funds | 422 Unprocessable Entity |
| Resource not found | 404 Not Found |
| Server error | 500 Internal Server Error |

All errors return **clear, meaningful messages**.

---

## 🔒 Concurrency & Isolation

- Uses **READ COMMITTED / REPEATABLE READ**
- Prevents:
  - Dirty reads
  - Lost updates
  - Partial writes
- Safe handling of concurrent financial transactions

---

## 🛠️ Technology Stack

- **Backend:** REST API (Language-agnostic)
- **Database:** PostgreSQL / MySQL
- **Precision:** DECIMAL / NUMERIC (no floats)
- **Transactions:** Database-managed ACID compliance

---

## ✅ Features Summary

✔ Immutable ledger system  
✔ Double-entry bookkeeping  
✔ No negative balances  
✔ Fully auditable transaction history  
✔ Safe concurrent execution  
✔ Clean separation of concerns  
✔ Production-grade backend design  

---

## 🧪 Suitable For

- Banking systems
- Accounting platforms
- FinTech backends
- Audit-focused applications
- Backend engineering assessments


