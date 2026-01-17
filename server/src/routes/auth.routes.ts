import express from 'express';
import { login, registerAdmin } from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', login);
router.post('/register-secret', registerAdmin);

export default router;
