import express from 'express';
import { getEvents, getEvent } from '../controllers/event.controller';

const router = express.Router();

router.route('/')
    .get(getEvents);

router.route('/:id')
    .get(getEvent);

export default router;
