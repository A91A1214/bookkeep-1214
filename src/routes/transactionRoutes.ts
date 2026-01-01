import { Router } from 'express';
import { transfer, deposit, withdraw } from '../controllers/transactionController';

const router = Router();

router.post('/transfers', transfer);
router.post('/deposits', deposit);
router.post('/withdrawals', withdraw);

export default router;
