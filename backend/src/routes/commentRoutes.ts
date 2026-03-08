import express from 'express';
import {
    addComment,
    getTaskComments,
    deleteComment,
} from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';
import { checkWorkspaceRole } from '../middleware/roleMiddleware';

// Merge params to access workspaceId, projectId, and taskId
const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/', checkWorkspaceRole(['Admin', 'Member']), addComment);
router.get('/', checkWorkspaceRole(['Admin', 'Member', 'Guest']), getTaskComments);
router.delete('/:id', checkWorkspaceRole(['Admin', 'Member']), deleteComment);

export default router;
