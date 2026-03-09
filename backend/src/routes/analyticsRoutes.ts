import express from 'express';
import {
    getWorkspaceStats,
    getTeamPerformance,
} from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';
import { checkWorkspaceRole } from '../middleware/roleMiddleware';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/stats', checkWorkspaceRole(['Admin', 'Member', 'Guest']), getWorkspaceStats);
router.get('/performance', checkWorkspaceRole(['Admin', 'Member', 'Guest']), getTeamPerformance);

export default router;
