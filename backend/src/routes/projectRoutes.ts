import express from 'express';
import {
    createProject,
    getWorkspaceProjects,
    getProjectDetails,
    updateProject,
    deleteProject,
} from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';
import { checkWorkspaceRole } from '../middleware/roleMiddleware';
import taskRoutes from './taskRoutes';

// Merge params to access workspaceId from parent router
const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/', checkWorkspaceRole(['Admin', 'Member']), createProject);
router.get('/', checkWorkspaceRole(['Admin', 'Member', 'Guest']), getWorkspaceProjects);
router.get('/:id', checkWorkspaceRole(['Admin', 'Member', 'Guest']), getProjectDetails);
router.put('/:id', checkWorkspaceRole(['Admin', 'Member']), updateProject);
router.delete('/:id', checkWorkspaceRole(['Admin']), deleteProject);

// Re-route to task routes
router.use('/:projectId/tasks', taskRoutes);

export default router;
