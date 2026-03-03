import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getRoomMessages = async (req: any, res: Response) => {
    try {
        const { roomId } = req.params;
        const { limit = 50, cursor } = req.query;

        const messages = await prisma.message.findMany({
            where: { roomId },
            take: Number(limit),
            ...(cursor ? { skip: 1, cursor: { id: cursor as string } } : {}),
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } }
            }
        });

        res.status(200).json({ messages: messages.reverse() });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Error fetching messages' });
    }
};
