import express from 'express';
import { seedDatabase } from '../controllers/system.controller';

const router = express.Router();

router.post('/seed', seedDatabase);

export default router;
