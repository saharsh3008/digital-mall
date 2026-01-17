import express from 'express';
import { getActiveOffers } from '../controllers/offer.controller';

const router = express.Router();

router.get('/', getActiveOffers);

export default router;
