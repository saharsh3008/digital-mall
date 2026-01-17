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
import { getActivityOverTime, getTopSearches, getTopStores } from '../controllers/admin.analytics.controller';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect, restrictTo('admin'));

// Analytics Dashboard
router.get('/analytics/top-stores', getTopStores);
router.get('/analytics/top-searches', getTopSearches);
router.get('/analytics/activity', getActivityOverTime);

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
