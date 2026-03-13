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
    
    // Convert to Base64 for MongoDB storage (via User model)
    const base64Data = req.file.buffer.toString('base64');
    const avatarUrl = `data:${req.file.mimetype};base64,${base64Data}`;
    
    res.status(200).json({ success: true, data: avatarUrl });
});

export default router;
