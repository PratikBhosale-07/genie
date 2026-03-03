import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRoomAccess } from '../middlewares/room.middleware';
import { getRoomMessages } from '../controllers/chat.controller';

const router = Router();

router.use(requireAuth);

router.get('/:roomId/messages', requireRoomAccess(['OWNER', 'ADMIN', 'MEMBER']), getRoomMessages);

export default router;
