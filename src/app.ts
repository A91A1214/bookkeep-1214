import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './config/db';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/accounts', accountRoutes);
app.use('/', transactionRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Financial Ledger API is operational' });
});

// Initialization
const start = async () => {
    console.log('Starting Financial Ledger API...');

    // Optional delay for DB readiness in container environments
    await new Promise(resolve => setTimeout(resolve, 2000));

    await initDb();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

start();

export default app;
