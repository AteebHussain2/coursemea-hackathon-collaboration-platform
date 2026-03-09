import express from 'express';
import {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceDetails,
    updateWorkspace,
    joinWorkspace,
    removeMember,
    getWorkspaceActivity,
} from '../controllers/workspaceController';
import { protect } from '../middleware/authMiddleware';
import { checkWorkspaceRole } from '../middleware/roleMiddleware';
import projectRoutes from './projectRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = express.Router();

// All workspace routes require authentication
router.use(protect);

router.post('/', createWorkspace);
router.get('/', getMyWorkspaces);
router.post('/join/:token', joinWorkspace);

router.delete('/:id/members/:userId', checkWorkspaceRole(['Admin']), removeMember);
router.get('/:id/activity', checkWorkspaceRole(['Admin', 'Member', 'Guest']), getWorkspaceActivity);
router.get('/:id', checkWorkspaceRole(['Admin', 'Member', 'Guest']), getWorkspaceDetails);
router.put('/:id', checkWorkspaceRole(['Admin']), updateWorkspace);

// Re-route to analytics routes
router.use('/:workspaceId/analytics', analyticsRoutes);

// Re-route to project routes
router.use('/:workspaceId/projects', projectRoutes);

export default router;
