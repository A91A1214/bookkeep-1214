import { Router } from 'express';
import { createAccount, getAccount, getLedger } from '../controllers/accountController';

const router = Router();

router.post('/', createAccount);
router.get('/:id', getAccount);
router.get('/:id/ledger', getLedger);

export default router;
