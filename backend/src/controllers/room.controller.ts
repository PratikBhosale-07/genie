import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { z } from 'zod';

const createRoomSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    isPrivate: z.boolean().default(false)
});

export const createRoom = async (req: any, res: Response) => {
    try {
        const { name, description, isPrivate } = createRoomSchema.parse(req.body);
        const userId = req.user.id;

        const room = await prisma.room.create({
            data: {
                name,
                description,
                isPrivate,
                members: {
                    create: {
                        userId,
                        role: 'OWNER'
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                }
            }
        });

        res.status(201).json({ room });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Error creating room' });
    }
};

export const joinRoom = async (req: any, res: Response) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (room.isPrivate) {
            return res.status(403).json({ error: 'Cannot join private room without invite' });
        }

        const existingMember = await prisma.roomMember.findUnique({
            where: { userId_roomId: { userId, roomId } }
        });

        if (existingMember) {
            return res.status(400).json({ error: 'Already a member' });
        }

        const membership = await prisma.roomMember.create({
            data: {
                userId,
                roomId,
                role: 'MEMBER'
            }
        });

        res.status(200).json({ membership });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Error joining room' });
    }
};

export const getUserRooms = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const memberships = await prisma.roomMember.findMany({
            where: { userId },
            include: {
                room: true
            }
        });

        const rooms = memberships.map(m => m.room);
        res.status(200).json({ rooms });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Error fetching rooms' });
    }
};

export const getRoomDetails = async (req: any, res: Response) => {
    try {
        const { roomId } = req.params;

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true, avatarUrl: true } }
                    }
                }
            }
        });

        if (!room) return res.status(404).json({ error: 'Room not found' });

        res.status(200).json({ room });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Error fetching room' });
    }
};
