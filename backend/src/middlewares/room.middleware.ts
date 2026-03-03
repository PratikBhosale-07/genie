import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { RoomRole } from '@prisma/client';

export const requireRoomAccess = (roles: RoomRole[] = ['OWNER', 'ADMIN', 'MEMBER']) => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            const { roomId } = req.params;
            const userId = req.user?.id;

            if (!userId || !roomId) {
                return res.status(400).json({ error: 'Missing user or room context' });
            }

            const membership = await prisma.roomMember.findUnique({
                where: {
                    userId_roomId: {
                        userId,
                        roomId
                    }
                }
            });

            if (!membership) {
                return res.status(403).json({ error: 'Access denied: Not a member of this room' });
            }

            if (!roles.includes(membership.role)) {
                return res.status(403).json({ error: 'Access denied: Insufficient permissions in this room' });
            }

            req.roomRole = membership.role;
            next();
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error confirming access' });
        }
    };
};
