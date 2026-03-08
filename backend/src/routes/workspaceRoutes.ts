import express from 'express';
import {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceDetails,
    updateWorkspace,
    joinWorkspace,
} from '../controllers/workspaceController';
import { protect } from '../middleware/authMiddleware';
import { checkWorkspaceRole } from '../middleware/roleMiddleware';
import projectRoutes from './projectRoutes';

const router = express.Router();

// All workspace routes require authentication
router.use(protect);

router.post('/', createWorkspace);
router.get('/', getMyWorkspaces);
router.post('/join/:token', joinWorkspace);

router.get('/:id', checkWorkspaceRole(['Admin', 'Member', 'Guest']), getWorkspaceDetails);
router.put('/:id', checkWorkspaceRole(['Admin']), updateWorkspace);

// Re-route to project routes
router.use('/:workspaceId/projects', projectRoutes);

export default router;
