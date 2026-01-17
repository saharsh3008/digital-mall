import express from 'express';
import { recordEvent } from '../controllers/analytics.controller';

const router = express.Router();

router.post('/event', recordEvent);

export default router;
