import express, { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getMe, updateProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../utils/upload';

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), (req: AuthRequest, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a file' });
    }
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, data: avatarUrl });
});

export default router;
