import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import {
    createStore,
    updateStore,
    deleteStore,
    getAdminStores
} from '../controllers/admin.store.controller';
import {
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/admin.event.controller';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(restrictTo('admin', 'infrastructure_admin'));

// Store Mgmt
router.route('/stores')
    .get(getAdminStores)
    .post(createStore);

router.route('/stores/:id')
    .put(updateStore)
    .delete(deleteStore);

// Event Mgmt
router.route('/events')
    .post(createEvent);

router.route('/events/:id')
    .put(updateEvent)
    .delete(deleteEvent);

export default router;
