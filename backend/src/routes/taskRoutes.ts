import express from 'express';
import {
    createTask,
    getProjectTasks,
    getTaskDetails,
    updateTask,
    deleteTask,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';
import { checkWorkspaceRole } from '../middleware/roleMiddleware';

const router = express.Router({ mergeParams: true });

router.use(protect);

// Projects are already protected by workspace ID in the path
// We double check workspace role to ensure user belongs to the hub
router.post('/', checkWorkspaceRole(['Admin', 'Member']), createTask);
router.get('/', checkWorkspaceRole(['Admin', 'Member', 'Guest']), getProjectTasks);
router.get('/:id', checkWorkspaceRole(['Admin', 'Member', 'Guest']), getTaskDetails);
router.put('/:id', checkWorkspaceRole(['Admin', 'Member']), updateTask);
router.delete('/:id', checkWorkspaceRole(['Admin']), deleteTask);

export default router;
