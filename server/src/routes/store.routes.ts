import express from 'express';
import { getStores, getStore } from '../controllers/store.controller';

const router = express.Router();

router.route('/')
    .get(getStores);

router.route('/:id')
    .get(getStore);

export default router;
