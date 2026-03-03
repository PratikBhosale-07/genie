import { Router } from 'express';
import { createRoom, getUserRooms, joinRoom, getRoomDetails } from '../controllers/room.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRoomAccess } from '../middlewares/room.middleware';

const router = Router();

// Need to be logged in for all room actions
router.use(requireAuth);

router.post('/', createRoom);
router.get('/', getUserRooms);
router.post('/:roomId/join', joinRoom);
router.get('/:roomId', requireRoomAccess(['OWNER', 'ADMIN', 'MEMBER']), getRoomDetails);

export default router;
