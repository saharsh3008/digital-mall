import express from 'express';
import { getParkingStatus } from '../controllers/parking.controller';

const router = express.Router();

router.get('/', getParkingStatus);

export default router;
